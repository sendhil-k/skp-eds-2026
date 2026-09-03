#!/usr/bin/env node
/*
 * compute-data.js — derive the supplementary datasets the dashboard needs from the
 * crawl + render + block artifacts:
 *   - urls-all.json      (built from the crawler output; see SKILL.md step 1)
 *   - pages.jsonl        (render-pages.js)
 *   - blocks.jsonl       (capture-blocks.js)
 *   - groups.json        (build-render-set.js)
 *   - layouts.json       (cluster-layouts.js)
 *
 * Produces: site-structure.json, documents.json, url-groups.json,
 *           heatmap.json (per-layout), block-heatmap.json (per-base-type).
 *
 * Usage: node compute-data.js <catalogFolder> [siteOrigin]
 *   siteOrigin defaults to the origin of the first crawled URL.
 */
const fs = require('fs');
const path = require('path');
const CF = process.argv[2] || '.';
const rd = (f) => JSON.parse(fs.readFileSync(path.join(CF, f), 'utf8'));
const rdl = (f) => fs.readFileSync(path.join(CF, f), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

const all = rd('urls-all.json')['analysis-urls-all'];
const pages = rdl('pages.jsonl').filter((p) => p.status === 'ok');
const blocks = rdl('blocks.jsonl').filter((b) => b.captured);
const layouts = rd('layouts.json').templates;

// Scope prefix: the path portion of the configured siteUrl (e.g. "/int/en" or "/saran").
// Structure/URL groups are computed RELATIVE to this so a section-scoped analysis
// groups by its real sub-sections rather than collapsing to one prefix.
let SCOPE = '';
try { const cfg = rd('config.json'); SCOPE = (cfg.siteUrl || '').replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, ''); } catch (e) { /* none */ }
const rel = (pathOnly) => (SCOPE && pathOnly.startsWith(SCOPE) ? pathOnly.slice(SCOPE.length) : pathOnly);

const norm = (u) => u.split(/[?#]/)[0].replace(/\/index\.html$/, '/');
const IMG = /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i;
const live = [...new Set(all.urls.filter((x) => x.status === 200 && !IMG.test(norm(x.url))).map((x) => norm(x.url)))].sort();
const LOCALES = ['en', 'jp', 'ja', 'brasil', 'korea', 'philippines', 'tw', 'oceania', 'vietnam', 'gallery', 'zh', 'cn', 'de', 'fr', 'es', 'th', 'id'];

// --- site structure: group by the first 1-2 path segments BELOW the scope prefix, keep >=3 pages ---
const struct = {};
for (const u of live) { const rp = rel(u.replace(/^https?:\/\/[^/]+/, '')).split('/').filter(Boolean); const k = (SCOPE || '') + '/' + rp.slice(0, 2).join('/'); struct[k] = (struct[k] || 0) + 1; }
let siteStructure = Object.entries(struct).filter(([, v]) => v >= 3).sort((a, b) => b[1] - a[1]).map(([p, v]) => ({ path: p, pages: String(v) }));
if (siteStructure.length < 2) { // fall back to deeper grouping if the 2-seg grouping collapsed
  const s2 = {}; for (const u of live) { const rp = rel(u.replace(/^https?:\/\/[^/]+/, '')).split('/').filter(Boolean); const k = (SCOPE || '') + '/' + rp.slice(0, 3).join('/'); s2[k] = (s2[k] || 0) + 1; }
  siteStructure = Object.entries(s2).filter(([, v]) => v >= 3).sort((a, b) => b[1] - a[1]).map(([p, v]) => ({ path: p, pages: String(v) }));
}
fs.writeFileSync(path.join(CF, 'site-structure.json'), JSON.stringify(siteStructure));

// --- documents (200) ---
const docs = all.documents.filter((d) => d.status === 200).map((d) => d.url);
fs.writeFileSync(path.join(CF, 'documents.json'), JSON.stringify(docs));

// --- url groups by first segment BELOW the scope prefix (locale/section) ---
const loc = {};
for (const u of live) { const p = u.replace(/^https?:\/\/[^/]+/, ''); const seg = rel(p).split('/').filter(Boolean)[0] || '(root)'; const g = (SCOPE || '') + '/' + seg; (loc[g] = loc[g] || []).push(p); }
const urlGroups = Object.entries(loc).sort((a, b) => b[1].length - a[1].length).map(([group, urls]) => ({ group, count: urls.length, urls: urls.slice(0, 60) }));
fs.writeFileSync(path.join(CF, 'url-groups.json'), JSON.stringify(urlGroups));

// --- integration detectors (shared) ---
const DET = [['GTM', /googletagmanager/], ['Analytics', /google-analytics|analytics\.google/], ['Consent', /onetrust|cookiebot|cookielaw/], ['jQuery/CDN', /jquery|cdnjs|jsdelivr|unpkg/], ['Maps', /maps\.google|google\.com\/maps|gstatic/], ['YouTube', /youtube|ytimg|youtu\.be/], ['Ads', /doubleclick|googleadservices|googlesyndication/]];
const INTG = DET.map((d) => d[0]);
const pageIntg = {};
for (const p of pages) { const src = ((p.scripts || []).concat(p.iframeSrcs || [])).join(' ').toLowerCase(); const set = new Set(); DET.forEach((d, i) => { if (d[1].test(src) || (d[0] === 'GTM' && (p.globals || []).includes('google_tag_manager'))) set.add(i); }); pageIntg[p.url] = set; }

// --- per-layout heatmap (cluster pages by fingerprint -> family name) ---
const sig2name = {}; for (const t of layouts) sig2name[t.signature] = t.name;
const famOf = {}; for (const p of pages) famOf[p.url] = sig2name[p.signature] || 'other';
const names = {};
for (const p of pages) { const n = famOf[p.url]; const o = names[n] = names[n] || { pg: 0, hit: INTG.map(() => 0) }; o.pg++; const s = pageIntg[p.url]; if (s) s.forEach((i) => o.hit[i]++); }
const hmRows = Object.entries(names).sort((a, b) => b[1].pg - a[1].pg).map(([template, o]) => ({ template, pg: String(o.pg), cellsPct: o.hit.map((h) => (h === 0 ? '·' : Math.round(h / o.pg * 100) + '%')), cellsCnt: o.hit.map((h) => (h === 0 ? '·' : h + '/' + o.pg)) }));
fs.writeFileSync(path.join(CF, 'heatmap.json'), JSON.stringify({ integrations: INTG, rows: hmRows }));

// --- per-base-type heatmap ---
const typePages = {};
for (const b of blocks) (typePages[b.type] = typePages[b.type] || new Set()).add(b.pageUrl);
const BASE_ORDER = ['cards', 'media', 'table', 'form', 'iframe-embed', 'breadcrumbs', 'hero', 'list', 'columns', 'carousel', 'tabs', 'accordion', 'video', 'text', 'unknown'];
const bpct = []; const bcnt = [];
for (const t of BASE_ORDER) {
  const set = typePages[t]; if (!set || !set.size) continue;
  const pg = set.size; const hit = INTG.map(() => 0);
  for (const u of set) { const s = pageIntg[u]; if (s) s.forEach((i) => hit[i]++); }
  const label = t === 'iframe-embed' ? 'Embed' : t.charAt(0).toUpperCase() + t.slice(1);
  bpct.push({ template: label, pg: String(pg), cells: hit.map((h) => (h === 0 ? '·' : Math.round(h / pg * 100) + '%')) });
  bcnt.push({ template: label, pg: String(pg), cells: hit.map((h) => (h === 0 ? '·' : h + '/' + pg)) });
}
fs.writeFileSync(path.join(CF, 'block-heatmap.json'), JSON.stringify({ integrations: INTG, pct: bpct, counts: bcnt }));

// --- integrations summary (site-wide) ---
const hostHits = {};
function host(u) { try { return new URL(u).hostname; } catch (e) { return null; } }
for (const p of pages) for (const s of (p.scripts || []).concat(p.iframeSrcs || [])) { const h = host(s); if (h) hostHits[h] = (hostHits[h] || 0) + 1; }
const KNOWN = [[/googletagmanager/, 'Google Tag Manager'], [/google-analytics|analytics\.google/, 'Google Analytics'], [/onetrust|cookiebot|cookielaw/, 'Consent (OneTrust/Cookiebot)'], [/jquery|cdnjs|jsdelivr|unpkg/, 'CDN/jQuery libs'], [/maps\.google|google\.com\/maps|gstatic/, 'Google Maps/static'], [/youtube|ytimg|youtu\.be/, 'YouTube embed'], [/doubleclick|googleadservices|googlesyndication/, 'Google Ads/DoubleClick']];
const integ = {};
for (const [h, c] of Object.entries(hostHits)) { const m = KNOWN.find(([re]) => re.test(h)); if (m) integ[m[1]] = (integ[m[1]] || 0) + c; }
const globals = {};
for (const p of pages) for (const g of (p.globals || [])) globals[g] = (globals[g] || 0) + 1;
fs.writeFileSync(path.join(CF, 'integrations.json'), JSON.stringify({
  integrations: Object.entries(integ).sort((a, b) => b[1] - a[1]).map(([name, hits]) => ({ name, hits })),
  globals: Object.entries(globals).sort((a, b) => b[1] - a[1]).map(([global, count]) => ({ global, count })),
  iframeHosts: [],
}));

console.log('compute-data: live pages', live.length, '| structure groups', siteStructure.length, '| docs', docs.length,
  '| url groups', urlGroups.length, '| layout heatmap rows', hmRows.length, '| block heatmap rows', bpct.length,
  '| integrations', Object.keys(integ).length);
