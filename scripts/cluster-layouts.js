#!/usr/bin/env node
/*
 * cluster-layouts.js — cluster rendered pages into layout templates + integrations.
 *
 * Inputs: pages.jsonl (fingerprints), groups.json (pattern-group -> all pages).
 * Clustering: exact structural signature, refined by primary site-section + block
 *   family, so "text" news pages and "text" policy pages don't over-merge.
 * Extrapolation: each rendered page represents its pattern group; a template's
 *   full-population estimate = sum of (group.total / group.rendered) over its members.
 * Also aggregates third-party integration signals across all pages.
 *
 * Outputs: layouts.json, integrations.json, and a summary to stdout.
 */
const fs = require('fs');
const path = require('path');

const CF = process.argv[2] || __dirname;
const pages = fs.readFileSync(path.join(CF, 'pages.jsonl'), 'utf8').split('\n')
  .filter(Boolean).map((l) => JSON.parse(l)).filter((p) => p.status === 'ok');
const groupsData = JSON.parse(fs.readFileSync(path.join(CF, 'groups.json'), 'utf8'));

// map each URL -> its pattern group meta (for extrapolation weight)
function groupKey(u) {
  const p = u.replace(/^https?:\/\/[^/]+/, '');
  const parts = p.split('/').filter(Boolean);
  if (parts.length <= 1) return '/(root-level)/*';
  return '/' + parts.slice(0, -1).join('/') + '/*';
}
const weightOf = (u) => {
  const gm = groupsData.groupMeta[groupKey(u)];
  if (!gm || !gm.rendered) return 1;
  return gm.total / gm.rendered; // pages represented per rendered sample
};

// primary section = first 2 path segments after locale (locale + section)
function sectionOf(u) {
  const parts = u.replace(/^https?:\/\/[^/]+/, '').split('/').filter(Boolean);
  const locales = ['en', 'jp', 'ja', 'brasil', 'korea', 'philippines', 'tw', 'oceania', 'vietnam', 'gallery'];
  let loc = 'root'; let sec = '(home)';
  if (parts.length) {
    if (locales.includes(parts[0])) { loc = parts[0]; sec = parts[1] || '(home)'; }
    else { loc = 'root'; sec = parts[0]; }
  }
  return { loc, sec };
}
function localeOf(u) { return sectionOf(u).loc; }

// dominant block family drives naming
function familyOf(sig) {
  if (!sig) return 'empty';
  const b = sig.split('>');
  const has = (t) => b.includes(t);
  if (has('form')) return 'form';
  if (has('hero') && has('cards')) return 'hero+cards';
  if (has('carousel')) return 'carousel';
  if (has('accordion')) return 'accordion';
  if (has('tabs')) return 'tabs';
  if (has('iframe-embed')) return 'embed';
  if (has('table')) return 'table';
  if (has('cards')) return 'cards';
  if (has('hero')) return 'hero';
  if (b.every((x) => x === 'list')) return 'list';
  if (has('media') && has('text')) return 'media+text';
  if (b.every((x) => x === 'text')) return 'text';
  if (has('breadcrumbs')) return 'breadcrumbed';
  return b[0] || 'other';
}

// cluster key: signature (captures structure). Store rich members.
const clusters = {};
for (const p of pages) {
  const key = p.signature || '(empty)';
  const c = clusters[key] || (clusters[key] = { signature: key, family: familyOf(p.signature), rendered: 0, estPop: 0, urls: [], sections: {}, locales: {}, blockCountMode: {} });
  c.rendered += 1;
  c.estPop += weightOf(p.url);
  if (c.urls.length < 8) c.urls.push(p.url);
  const { loc, sec } = sectionOf(p.url);
  c.sections[sec] = (c.sections[sec] || 0) + 1;
  c.locales[loc] = (c.locales[loc] || 0) + 1;
  c.blockCountMode[p.blockCount] = (c.blockCountMode[p.blockCount] || 0) + 1;
}
const clusterList = Object.values(clusters).map((c) => {
  c.estPop = Math.round(c.estPop);
  c.topSections = Object.entries(c.sections).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}(${v})`);
  c.topLocales = Object.entries(c.locales).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`);
  return c;
}).sort((a, b) => b.estPop - a.estPop);

// human-friendly name per cluster
function nameCluster(c, i) {
  const fam = c.family;
  const topSec = (c.topSections[0] || '').replace(/\(\d+\)$/, '');
  const map = {
    text: 'article-text', table: 'data-table', list: 'section-nav-list', 'media+text': 'media-article',
    cards: 'card-grid', form: 'form-page', hero: 'hero-page', 'hero+cards': 'hero-landing',
    carousel: 'carousel-page', accordion: 'accordion-page', tabs: 'tabbed-page', embed: 'embed-page',
    breadcrumbed: 'breadcrumb-page', empty: 'minimal-page', other: 'mixed-layout',
  };
  const base = map[fam] || fam;
  return `${base}`;
}
clusterList.forEach((c, i) => { c.name = nameCluster(c, i); });

// --- integrations aggregation ---
const hosts = {}; const globalsCount = {}; const iframeHosts = {};
function host(u) { try { return new URL(u).hostname; } catch (e) { return null; } }
for (const p of pages) {
  const w = weightOf(p.url);
  for (const s of (p.scripts || [])) { const h = host(s); if (h) hosts[h] = (hosts[h] || 0) + 1; }
  for (const f of (p.iframeSrcs || [])) { const h = host(f); if (h) iframeHosts[h] = (iframeHosts[h] || 0) + 1; }
  for (const g of (p.globals || [])) globalsCount[g] = (globalsCount[g] || 0) + 1;
}
// classify notable 3rd-party hosts
const KNOWN = [
  [/googletagmanager\.com/, 'Google Tag Manager'], [/google-analytics\.com|analytics\.google/, 'Google Analytics'],
  [/googleadservices|doubleclick|googlesyndication/, 'Google Ads/DoubleClick'], [/youtube\.com|youtu\.be|ytimg/, 'YouTube embed'],
  [/facebook\.net|facebook\.com/, 'Facebook Pixel/SDK'], [/twitter\.com|twimg|x\.com/, 'Twitter/X'],
  [/linkedin\.com|licdn/, 'LinkedIn'], [/instagram\.com/, 'Instagram'], [/vimeo\.com/, 'Vimeo'],
  [/google\.com\/maps|maps\.google|gstatic/, 'Google Maps/static'], [/adobe|omtrdc|demdex|typekit|use\.typekit/, 'Adobe (Analytics/Fonts)'],
  [/hotjar/, 'Hotjar'], [/hubspot|hs-scripts|hsforms/, 'HubSpot'], [/marketo|mktoresp/, 'Marketo'],
  [/salesforce|pardot/, 'Salesforce/Pardot'], [/cookiebot|onetrust|cookielaw/, 'Consent (OneTrust/Cookiebot)'],
  [/karte\.io|plaid/, 'KARTE'], [/yahoo|yimg|yjtag/, 'Yahoo Japan tag'], [/line\.me|line-scdn/, 'LINE'],
  [/cloudflare|cdnjs|jsdelivr|unpkg|jquery/, 'CDN/jQuery libs'], [/recaptcha|gstatic\.com\/recaptcha/, 'reCAPTCHA'],
];
const integrations = {};
for (const [h, cnt] of Object.entries(hosts)) {
  const m = KNOWN.find(([re]) => re.test(h));
  const name = m ? m[1] : null;
  if (name) integrations[name] = (integrations[name] || 0) + cnt;
}
for (const [h, cnt] of Object.entries(iframeHosts)) {
  const m = KNOWN.find(([re]) => re.test(h));
  if (m) integrations[m[1]] = (integrations[m[1]] || 0) + cnt;
}

fs.writeFileSync(path.join(CF, 'layouts.json'), JSON.stringify({
  captured: new Date().toISOString(),
  renderedPages: pages.length,
  distinctSignatures: clusterList.length,
  templates: clusterList,
}, null, 1));
fs.writeFileSync(path.join(CF, 'integrations.json'), JSON.stringify({
  captured: new Date().toISOString(),
  integrations: Object.entries(integrations).sort((a, b) => b[1] - a[1]).map(([name, hits]) => ({ name, hits })),
  thirdPartyHosts: Object.entries(hosts).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([h, c]) => ({ host: h, count: c })),
  globals: Object.entries(globalsCount).sort((a, b) => b[1] - a[1]).map(([g, c]) => ({ global: g, count: c })),
  iframeHosts: Object.entries(iframeHosts).sort((a, b) => b[1] - a[1]).map(([h, c]) => ({ host: h, count: c })),
}, null, 1));

console.log('Rendered pages clustered:', pages.length);
console.log('Distinct layout signatures:', clusterList.length);
console.log('');
console.log('=== Layout templates (est. full-population pages) ===');
for (const c of clusterList.slice(0, 30)) {
  console.log(String(c.estPop).padStart(5), 'pp  rendered=' + String(c.rendered).padStart(3),
    ' ', c.name.padEnd(16), (c.signature || '').slice(0, 46).padEnd(46), '| ', c.topSections.slice(0, 3).join(' '));
}
console.log('');
console.log('=== Third-party integrations detected ===');
for (const [n, h] of Object.entries(integrations).sort((a, b) => b[1] - a[1])) console.log(String(h).padStart(5), n);
console.log('');
console.log('=== Global objects ===');
for (const g of Object.entries(globalsCount).sort((a, b) => b[1] - a[1])) console.log(String(g[1]).padStart(4), g[0]);
