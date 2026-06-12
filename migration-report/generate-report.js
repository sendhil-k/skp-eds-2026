/* eslint-disable */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, PageBreak, TableOfContents,
} = require('docx');

const OUT = path.join(__dirname, 'BOTOXONE-AEM-Migration-Scope-Report.docx');

// ---------- color palette ----------
const C = {
  primary: '0F1E5B',   // deep navy
  accent: 'D52B1E',     // abbvie/botox red
  headerBg: '0F1E5B',
  headerText: 'FFFFFF',
  zebra: 'F2F4F8',
  border: 'C9D1E0',
  low: '2E7D32',
  medium: 'E68A00',
  high: 'C62828',
  muted: '5A6472',
};

// ---------- helpers ----------
const TITLE_FONT = 'Calibri';

function txt(text, opts = {}) {
  return new TextRun({ text: String(text), font: TITLE_FONT, ...opts });
}

function para(text, opts = {}) {
  const { runs, ...rest } = opts;
  return new Paragraph({
    children: runs || [txt(text, opts.runOpts || {})],
    spacing: { after: 120, ...(opts.spacing || {}) },
    ...rest,
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: TITLE_FONT, bold: true, color: C.primary, size: 30 })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: TITLE_FONT, bold: true, color: C.accent, size: 24 })],
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60 },
    children: Array.isArray(text) ? text : [txt(text)],
  });
}

function cell(content, { bg, bold, color, align, width, size } = {}) {
  const children = Array.isArray(content) ? content : [
    new Paragraph({
      alignment: align || AlignmentType.LEFT,
      children: [new TextRun({ text: String(content), font: TITLE_FONT, bold: !!bold, color: color || '000000', size: size || 18 })],
    }),
  ];
  return new TableCell({
    children,
    shading: bg ? { type: ShadingType.CLEAR, fill: bg, color: 'auto' } : undefined,
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
  });
}

function complexityRun(level) {
  const map = { Low: C.low, Medium: C.medium, High: C.high };
  return new TextRun({ text: level, font: TITLE_FONT, bold: true, color: map[level] || '000000', size: 18 });
}

// Build a table from header[] and rows[][]; complexityCols = indices rendered as colored
function table(headers, rows, { widths, complexityCols = [] } = {}) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, {
      bg: C.headerBg, bold: true, color: C.headerText, align: AlignmentType.LEFT,
      width: widths ? widths[i] : undefined, size: 18,
    })),
  });
  const bodyRows = rows.map((r, ri) => new TableRow({
    children: r.map((val, ci) => {
      const bg = ri % 2 === 1 ? C.zebra : undefined;
      if (complexityCols.includes(ci) && ['Low', 'Medium', 'High'].includes(val)) {
        return new TableCell({
          children: [new Paragraph({ children: [complexityRun(val)] })],
          shading: bg ? { type: ShadingType.CLEAR, fill: bg, color: 'auto' } : undefined,
          width: widths ? { size: widths[ci], type: WidthType.PERCENTAGE } : undefined,
          margins: { top: 40, bottom: 40, left: 80, right: 80 },
        });
      }
      return cell(val, { bg, width: widths ? widths[ci] : undefined });
    }),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: C.border },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border },
      left: { style: BorderStyle.SINGLE, size: 4, color: C.border },
      right: { style: BorderStyle.SINGLE, size: 4, color: C.border },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: C.border },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: C.border },
    },
    rows: [headerRow, ...bodyRows],
  });
}

function spacer() { return new Paragraph({ text: '', spacing: { after: 80 } }); }

// =====================================================================
// LOAD CATALOG DATA
// =====================================================================
const catalog = path.join(__dirname, '..', 'catalog');
const summary = JSON.parse(fs.readFileSync(path.join(catalog, 'summary.json'), 'utf8'))['analysis-summary'];
const templates = JSON.parse(fs.readFileSync(path.join(catalog, 'template-catalog.json'), 'utf8')).templates;
const blockCat = JSON.parse(fs.readFileSync(path.join(catalog, 'block-catalog.json'), 'utf8'))['analysis-block-catalog'];
const urlsAll = JSON.parse(fs.readFileSync(path.join(catalog, 'urls-all.json'), 'utf8'))['analysis-urls-all'];

const m = summary.metrics;

// base block rollup
const baseRollup = {};
Object.values(blockCat.blockVariants).forEach((v) => {
  const b = v.baseBlock || 'unknown';
  baseRollup[b] = baseRollup[b] || { variants: 0, pages: 0 };
  baseRollup[b].variants += 1;
  baseRollup[b].pages += (v.pagesFound || 0);
});

const children = [];

// =====================================================================
// COVER
// =====================================================================
children.push(new Paragraph({ spacing: { before: 1600 }, children: [] }));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 },
  children: [new TextRun({ text: 'AEM as a Cloud Service Migration', font: TITLE_FONT, bold: true, size: 52, color: C.primary })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 80 },
  children: [new TextRun({ text: 'Site Scope & Effort Assessment', font: TITLE_FONT, bold: true, size: 36, color: C.accent })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 80 },
  children: [new TextRun({ text: 'www.botoxone.com', font: TITLE_FONT, size: 30, color: C.muted })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 600 },
  children: [new TextRun({ text: 'Target Platform: AEM as a Cloud Service (Edge Delivery Services) with ALM integration', font: TITLE_FONT, italics: true, size: 20, color: C.muted })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 120 },
  children: [new TextRun({ text: `Analysis Date: ${summary.metadata.analysisDate}`, font: TITLE_FONT, size: 20, color: C.muted })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 120 },
  children: [new TextRun({ text: 'Report Status: Site catalog complete — 117 of 139 sitemap URLs analyzed (84%)', font: TITLE_FONT, size: 18, color: C.muted })],
}));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// TABLE OF CONTENTS
// =====================================================================
children.push(h1('Contents'));
children.push(new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// EXECUTIVE SUMMARY
// =====================================================================
children.push(h1('Executive Summary'));
children.push(para('BOTOX ONE is the US healthcare-professional (HCP) portal for AbbVie’s BOTOX therapeutic franchise. The site is built on Adobe Experience Manager (classic AEM 6.5 / AEMaaCS author-publish) served through an AWS ALB + Amazon CloudFront CDN, and is deeply instrumented with the Adobe Experience Cloud stack (Launch/DTM, Target, Analytics, Audience Manager) plus Coveo enterprise search and AEM Adaptive Forms behind an HCP authentication gate.'));
children.push(para('The site is content-heavy but highly templated. Across the entire sitemap of 139 URLs, content collapses into 19 structural templates dominated by a small number of repeated indication (therapeutic-area) patterns. This makes the bulk of the estate well-suited to automated, template-driven migration to Edge Delivery Services, with a focused manual effort reserved for forms, search, the authentication gate, personalization, and the interactive dosing calculators.'));

children.push(h2('Key Metrics at a Glance'));
children.push(table(
  ['Metric', 'Value'],
  [
    ['Total URLs in sitemap', String(urlsAll.totalUrls)],
    ['Pages successfully analyzed', `${m.pagesAnalyzed} (${m.percentAnalyzed}% coverage)`],
    ['Pages failed / dead (HTTP 404)', `${m.pagesFailed} (legacy /content/*.html + "blepharospam" typo paths)`],
    ['Document assets (PDF) in sitemap', '30'],
    ['Estimated image / media assets (DAM)', '300–500 (extrapolated)'],
    ['Unique page templates', String(m.totalTemplates)],
    ['Block instances catalogued', String(blockCat.totalBlocksProcessed)],
    ['Unique block variants', String(blockCat.totalBlockVariants)],
    ['Locales', `${m.localeCount} (en + en-us authoring path)`],
    ['Primary CMS', 'Adobe Experience Manager (author/publish + Dispatcher)'],
    ['CDN / Edge', 'Amazon CloudFront + AWS ALB'],
  ],
  { widths: [50, 50] },
));
children.push(spacer());
children.push(para([
  txt('Headline estimate: ', { bold: true }),
  txt('approximately 380–470 person-hours (~10–12 calendar weeks with a 3–4 person team) for a full migration including automated content migration, custom block development, integrations re-platforming, QA and UAT. See Section 9 for the detailed breakdown.'),
]));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 0. URL ACCOUNTING
// =====================================================================
children.push(h1('URL Accounting & Coverage'));
children.push(para('Every URL discovered from the BOTOX ONE sitemap set (sitemap.xml, sitemap.pages.xml, sitemap.documents.xml) was tracked through analysis. The table below reconciles the full URL inventory.'));
children.push(table(
  ['Category', 'Count', 'Notes'],
  [
    ['Total URLs discovered (sitemap)', String(urlsAll.totalUrls), 'Deduplicated, homepage included'],
    ['Pages analyzed successfully', String(m.pagesAnalyzed), 'Fingerprinted, templated, blocks catalogued'],
    ['Pages failed (HTTP 404 / dead)', String(m.pagesFailed), 'Not migratable — see breakdown below'],
    ['Document assets (PDF)', '30', 'From sitemap.documents.xml — migrate to DAM'],
    ['Live content pages (unique)', '~104', 'Excludes form-iframe internal URLs & dead links'],
  ],
  { widths: [42, 14, 44] },
));
children.push(spacer());
children.push(h2('Dead / Non-Migratable URLs (21 failures)'));
children.push(bullet('"blepharospam" typo paths («/blepharospam/*») — a misspelling of "blepharospasm"; these 404 and should be dropped or 301-redirected to the correct blepharospasm pages.'));
children.push(bullet('Legacy /content/botoxone/en-us/*.html paths — old AEM internal resource paths exposed in the sitemap that now 404; superseded by the clean vanity URLs.'));
children.push(bullet('/complete-program — retired page returning 404.'));
children.push(para('Recommendation: these URLs should be captured in a redirect map during migration rather than re-created.', { runOpts: { italics: true, color: C.muted } }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 1. HIGH LEVEL SUMMARY
// =====================================================================
children.push(h1('1. High-Level Summary'));

children.push(h2('1.1 Current Technology Stack'));
children.push(table(
  ['Layer', 'Technology', 'Evidence'],
  [
    ['CMS / Authoring', 'Adobe Experience Manager (6.5 / AEMaaCS classic, author-publish)', 'x-dispatcher, x-vhost: publish headers; /etc.clientlibs/, /content/dam/ paths'],
    ['Rendering', 'Server-side HTL/JSP components + AEM clientlibs (jQuery-era common-elements lib)', 'clientlib-component.min.js, components.min.js'],
    ['CDN / Edge', 'Amazon CloudFront + AWS Application Load Balancer', 'via: CloudFront, x-amz-cf-id, AWSALB cookies'],
    ['Tag Management', 'Adobe Launch / DTM', 'assets.adobedtm.com'],
    ['Analytics', 'Adobe Analytics (AppMeasurement)', 'smetrics.abbvie.com, omtrdc'],
    ['Personalization', 'Adobe Target', 'abbviecommercial.tt.omtrdc.net'],
    ['Audience / DMP', 'Adobe Audience Manager', 'demdex.net, dpm.demdex.net'],
    ['Enterprise Search', 'Coveo (cloud-hosted)', 'platform.cloud.coveo.com, coveoOrganizationId'],
    ['Forms', 'AEM Adaptive Forms (iframe embed)', 'forms-embed clientlib, aemform.iframe.en.html'],
    ['Web Fonts', 'Adobe Fonts (Typekit)', 'use.typekit.net'],
    ['Bot / spam', 'Google reCAPTCHA', 'recaptcha reference on register'],
    ['Performance RUM', 'AEM Edge RUM beacon', 'rum.hlx.page'],
    ['Identity / CRM', 'Salesforce (AbbVie metadata site)', 'abbviemetadata.my.site.com'],
  ],
  { widths: [22, 38, 40] },
));
children.push(spacer());

children.push(h2('1.2 Page Count by Thematic Breakdown'));
children.push(table(
  ['Theme', 'Approx. Pages', 'Examples'],
  [
    ['Corporate / Company / Legal', '4–6', 'site-map, AbbVie privacy, ISI/safety boilerplate'],
    ['Marketing — Indication content (therapeutic areas)', '~90', '10 indications × (overview + patient-id + efficacy + safety + dosing + resources)'],
    ['Account / Authentication', '7', 'sign-in, register, manage-account, forgot/reset password'],
    ['eCommerce / Ordering systems', '2–3', 'allergandirect.com & savings program links (external)'],
    ['Search & Resource listing (Coveo-fed)', '~25', 'practice-resources, */resources, search-results'],
    ['Tools / Interactive', '3–4', 'find-an-injector, ULS/LLS dosing calculators'],
    ['Programs / Training', '4–6', 'maxedge, online-training, education-and-training, badges'],
  ],
  { widths: [42, 16, 42] },
));
children.push(spacer());
children.push(para('Marketing pages organize by main-menu indication: Chronic Migraine, Adult Spasticity, Pediatric Spasticity, Cervical Dystonia, Strabismus, Blepharospasm, Overactive Bladder (OAB), Adult NDO, Pediatric NDO, and Hyperhidrosis. Each indication repeats the same sub-page structure (overview → patient identification → efficacy → safety → dosing → resources), which is the principal driver of the high template-reuse ratio.'));

children.push(h2('1.3 Static vs. Dynamic Pages'));
children.push(table(
  ['Type', 'Approx. Pages', 'Characterisation'],
  [
    ['Static (authored content)', '~95', 'Indication content/clinical pages — authored HTL, image/text/CTA blocks. Directly template-migratable.'],
    ['Dynamic (data-driven)', '~25', 'Coveo-fed resources & search listings — results rendered client-side from search API.'],
    ['Interactive / app-like', '~9', 'Adaptive Forms (7) + dosing calculators (2) — stateful, gated, JS logic.'],
  ],
  { widths: [28, 16, 56] },
));
children.push(spacer());

children.push(h2('1.4 Design System Analysis'));
children.push(para('The site uses a shared AbbVie "common-elements" AEM clientlib that provides a consistent but legacy design system: a fixed header/utility nav, indication-colored hero banners, card grids, tabbed content, accordions, data tables, and a persistent Important Safety Information (ISI) tray/footer. Styling is delivered through a single minified CSS clientlib rather than a token-based modern design system. For EDS, this translates cleanly into a small set of reusable blocks with style variations (dark/light, with/without image) rather than many distinct blocks — confirmed by the variant analysis where 96 variants roll up to ~13 base block families.'));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 2. TEMPLATES INVENTORY
// =====================================================================
children.push(h1('2. Templates Inventory'));
children.push(para(`Template discovery (weighted structural-similarity clustering over ${m.pagesAnalyzed} analyzed pages) produced ${m.totalTemplates} unique templates. Complexity is rated on layout richness, dynamic behaviour, and integration dependency.`));

// complexity heuristic per template
const tmplComplexity = {
  'homepage': 'High',
  'indication-overview-a': 'Medium',
  'indication-overview-b': 'Medium',
  'indication-overview-c': 'Medium',
  'indication-content-page': 'Medium',
  'indication-clinical-detail': 'High',
  'resources-listing': 'High',
  'search-results-listing': 'High',
  'info-content-page': 'Low',
  'support-content-page': 'Low',
  'training-page': 'Medium',
  'program-landing-maxedge': 'Medium',
  'find-an-injector': 'High',
  'form-sign-in': 'High',
  'form-register': 'High',
  'form-forgot-password': 'Medium',
  'form-reset-password': 'Medium',
  'form-request-a-rep': 'High',
  'form-patient-access': 'High',
};
const tmplReason = {
  'homepage': 'Hero, indication grid, promos, personalization slots',
  'indication-overview-a': 'Hero + nav tiles, repeated layout',
  'indication-overview-b': 'Hero + section nav, repeated layout',
  'indication-overview-c': 'Hero + nav tiles, repeated layout',
  'indication-content-page': 'Rich body sections + ISI; high volume but standardized',
  'indication-clinical-detail': 'Data tables, charts, dosing logic, ISI',
  'resources-listing': 'Coveo-fed faceted document search',
  'search-results-listing': 'Coveo search results + facets + query params',
  'info-content-page': 'Body copy + accordions, mostly static',
  'support-content-page': 'Body copy + links',
  'training-page': 'Course modules, likely gated',
  'program-landing-maxedge': 'Program hero + CTAs + details',
  'find-an-injector': 'Map/locator widget, external data',
  'form-sign-in': 'Adaptive Form + auth gate',
  'form-register': 'Multi-field Adaptive Form + reCAPTCHA + CRM',
  'form-forgot-password': 'Adaptive Form, single field',
  'form-reset-password': 'Adaptive Form, token flow',
  'form-request-a-rep': 'Adaptive Form + CRM routing',
  'form-patient-access': 'Adaptive Form + support workflow',
};

children.push(table(
  ['Template', 'Pages', 'Complexity', 'Reasoning', 'Reference URL'],
  templates
    .slice()
    .sort((a, b) => b.urls.length - a.urls.length)
    .map((t) => [
      t.name,
      String(t.urls.length),
      tmplComplexity[t.name] || 'Medium',
      tmplReason[t.name] || t.description.slice(0, 60),
      (t.representativePages && t.representativePages[0]) || t.urls[0],
    ]),
  { widths: [20, 7, 12, 33, 28], complexityCols: [2] },
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 3. COMPONENT CATALOG
// =====================================================================
children.push(h1('3. Component Catalog'));
children.push(para(`The ${blockCat.totalBlocksProcessed} block instances detected across the site roll up to ${blockCat.totalBlockVariants} variants over ~13 base block families. The "with-image / dark / light" suffixes are visual variations of the same content model — these should be built as design variants of a single block, not as new blocks.`));

children.push(h2('3.1 Base Block Families (usage rollup)'));
const famOrder = Object.entries(baseRollup).sort((a, b) => b[1].pages - a[1].pages);
children.push(table(
  ['Base Block', 'Variants', 'Page Instances'],
  famOrder.map(([k, v]) => [k, String(v.variants), String(v.pages)]),
  { widths: [40, 30, 30] },
));
children.push(spacer());
children.push(para('Note: the 21 "unknown" variants are predominantly default-content patterns (heading + text + CTA + image combinations) that map to native EDS default content rather than authored blocks — they do not require custom block development.', { runOpts: { italics: true, color: C.muted } }));

children.push(h2('3.2 Reusable Components Detail'));
const comp = [
  ['Header / Utility Nav', 'High', 'Sticky global nav, indication mega-menu, sign-in/account utility, search entry', 'No (custom)', 'No', 'Server-rendered nav model for LLM crawl', 'No', 'https://www.botoxone.com/'],
  ['Footer + ISI Tray', 'High', 'Persistent Important Safety Information tray + legal footer; sticky, expandable', 'Variant of core', 'No', 'Static content', 'No', 'all pages'],
  ['Hero Banner', 'Medium', 'Indication-colored hero with heading, copy, image, CTA; multiple variants', 'Variant of core (Teaser/Banner)', 'No', 'Static; ensure semantic markup', 'No', 'https://www.botoxone.com/oab'],
  ['Columns / Content Block', 'Medium', '34 variants — multi-column text/image/CTA layouts (the workhorse block)', 'Core (Columns/Container)', 'No', 'Static', 'No', 'https://www.botoxone.com/adult-ndo/efficacy'],
  ['Cards Grid', 'Medium', 'Indication navigation tiles & resource cards', 'Core (Teaser list)', 'Sometimes (Coveo)', 'Static or hydrated', 'No', 'https://www.botoxone.com/'],
  ['Tabs', 'Medium', '8 variants — tabbed clinical content', 'Core (Tabs)', 'No', 'Static', 'No', 'https://www.botoxone.com/chronic-migraine/efficacy'],
  ['Accordion', 'Low', 'FAQ / collapsible content', 'Core (Accordion)', 'No', 'Static', 'No', 'https://www.botoxone.com/faqs'],
  ['Carousel', 'Medium', '4 variants — image/content carousels', 'Core (Carousel)', 'No', 'Static', 'No', 'https://www.botoxone.com/'],
  ['Video', 'Medium', 'Inline HTML5 video player', 'Core (Embed)', 'No', 'Static, lazy', 'No', 'https://www.botoxone.com/'],
  ['Quote / Callout', 'Low', 'Pull-quote / testimonial callout', 'Core (Text)', 'No', 'Static', 'No', 'indication pages'],
  ['Breadcrumbs', 'Low', 'Path navigation', 'Core (Breadcrumb)', 'No', 'Static', 'No', 'sub-pages'],
  ['Coveo Search / Facets', 'High', 'Hosted search page, query suggestions, faceted document results', 'No (custom)', 'Yes (Coveo API)', 'Edge worker for data hydration recommended', 'Yes — Medium', 'https://www.botoxone.com/search-results'],
  ['Adaptive Form (embed)', 'High', 'Sign-in/register/support forms via iframe + clientlib', 'No (EDS Forms block)', 'Yes (form submit + CRM)', 'Server-side form handling', 'Yes — High', 'https://www.botoxone.com/register'],
  ['Dosing Calculator', 'High', 'ULS/LLS interactive dosing tools (gated, JS-driven)', 'No (custom)', 'Possibly', 'Edge worker / client logic', 'Yes — High', 'https://www.botoxone.com/adult-spasticity/dosing/uls-calculator'],
  ['Find-an-Injector', 'High', 'Provider locator (map + search)', 'No (custom)', 'Yes (locator data)', 'Edge worker for data', 'Yes — Medium', 'https://www.botoxone.com/find-an-injector'],
];
children.push(table(
  ['Component', 'Cplx', 'Behaviour', 'Core Component?', 'Backend?', 'LLM-ready need', 'UI-ext?', 'Reference URL'],
  comp,
  { widths: [13, 6, 22, 13, 9, 16, 9, 12], complexityCols: [1] },
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 4. PAGE COUNTS BY TEMPLATE
// =====================================================================
children.push(h1('4. Page Counts by Template & Migration Path'));
const autoMap = {
  'indication-content-page': 'Automated',
  'indication-clinical-detail': 'Mostly automated (manual QA on tables/charts)',
  'indication-overview-a': 'Automated',
  'indication-overview-b': 'Automated',
  'indication-overview-c': 'Automated',
  'info-content-page': 'Automated',
  'support-content-page': 'Automated',
  'homepage': 'Manual (personalization + promos)',
  'resources-listing': 'Manual (Coveo integration)',
  'search-results-listing': 'Manual (Coveo integration)',
  'training-page': 'Manual (gated content)',
  'program-landing-maxedge': 'Mostly automated',
  'find-an-injector': 'Manual (locator widget)',
  'form-sign-in': 'Manual (forms + auth)',
  'form-register': 'Manual (forms + auth)',
  'form-forgot-password': 'Manual (forms)',
  'form-reset-password': 'Manual (forms)',
  'form-request-a-rep': 'Manual (forms + CRM)',
  'form-patient-access': 'Manual (forms)',
};
children.push(table(
  ['Template', 'Pages', 'Migration Path'],
  templates.slice().sort((a, b) => b.urls.length - a.urls.length)
    .map((t) => [t.name, String(t.urls.length), autoMap[t.name] || 'Mostly automated']),
  { widths: [34, 12, 54] },
));
children.push(spacer());
const autoPages = templates.filter((t) => (autoMap[t.name] || '').startsWith('Auto') || (autoMap[t.name] || '').startsWith('Mostly')).reduce((s, t) => s + t.urls.length, 0);
const manualPages = m.pagesAnalyzed - autoPages;
children.push(table(
  ['Migration Path', 'Pages', 'Share'],
  [
    ['Automated / mostly automated', String(autoPages), `${Math.round((autoPages / m.pagesAnalyzed) * 100)}%`],
    ['Manual / custom', String(manualPages), `${Math.round((manualPages / m.pagesAnalyzed) * 100)}%`],
  ],
  { widths: [50, 25, 25] },
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 5. INTEGRATIONS ANALYSIS
// =====================================================================
children.push(h1('5. Integrations Analysis'));
children.push(table(
  ['Integration', 'Type', 'Cplx', 'Side', 'Status', 'Where Used'],
  [
    ['Adobe Launch / DTM', 'Embed (tag mgr)', 'Medium', 'Client', 'Active', 'All pages'],
    ['Adobe Analytics', 'JS beacon', 'Medium', 'Client', 'Active', 'All pages'],
    ['Adobe Target', 'JS / API', 'High', 'Client', 'Active', 'Homepage, indication pages'],
    ['Adobe Audience Manager (demdex)', 'JS beacon', 'Medium', 'Client', 'Active', 'All pages'],
    ['Coveo Search', 'API + JS', 'High', 'Both', 'Active', 'search-results, */resources, practice-resources'],
    ['AEM Adaptive Forms', 'Embed (iframe) + server', 'High', 'Both', 'Active', '7 form pages'],
    ['Google reCAPTCHA', 'Embed', 'Low', 'Client', 'Active', 'register, request-a-rep'],
    ['Adobe Fonts (Typekit)', 'Embed', 'Low', 'Client', 'Active', 'All pages'],
    ['AEM Edge RUM (hlx)', 'JS beacon', 'Low', 'Client', 'Active', 'All pages'],
    ['Salesforce (my.site.com)', 'Link / API', 'Medium', 'Server', 'Active (likely)', 'Account / metadata'],
    ['Allergan Direct (ordering)', 'External link', 'Low', 'Client', 'Active', 'Savings/ordering CTAs'],
    ['Social (FB/LI/IG/Pinterest/Tumblr/Twitter)', 'Link', 'Low', 'Client', 'Legacy (some dormant)', 'Footer'],
    ['BOTOX savings / abbv.ie short links', 'External link', 'Low', 'Client', 'Active', 'Promos'],
  ],
  { widths: [24, 17, 9, 10, 16, 24], complexityCols: [2] },
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 6. FORMS ANALYSIS
// =====================================================================
children.push(h1('6. Forms Analysis'));
children.push(para('All web forms are implemented as AEM Adaptive Forms, embedded through a "forms-embed" clientlib that lazily injects an iframe (aemform.iframe.en.html). Seven form-bearing pages were identified. Direct fetches of the form iframes returned empty/401, confirming they render only in an authenticated browser context behind the HCP gate.'));
children.push(table(
  ['Form Group', 'Sample URL', 'Features', 'Complexity', 'Backend Needed'],
  [
    ['Authentication (sign-in)', 'https://www.botoxone.com/sign-in', 'Email + password, session/JWT, auth gate', 'Complex', 'Yes — identity/SSO'],
    ['Registration', 'https://www.botoxone.com/register', 'Multi-field, validation, reCAPTCHA, CRM write', 'Complex', 'Yes — CRM/identity'],
    ['Password recovery', 'https://www.botoxone.com/forgot-password', 'Single field + email token flow', 'Medium', 'Yes — identity'],
    ['Password reset', 'https://www.botoxone.com/reset-password', 'Token-validated reset', 'Medium', 'Yes — identity'],
    ['Request a Rep', 'https://www.botoxone.com/request-a-rep', 'Lead capture, routing to sales/CRM', 'Complex', 'Yes — CRM routing'],
    ['Patient Access & Support', 'https://www.botoxone.com/patient-access-and-support', 'Support request workflow', 'Complex', 'Yes — workflow/CRM'],
    ['Manage Account', 'https://www.botoxone.com/manage-account', 'Profile edit (authenticated)', 'Complex', 'Yes — identity/profile'],
  ],
  { widths: [20, 30, 26, 12, 12], complexityCols: [3] },
));
children.push(spacer());
children.push(para('Total: 7 forms across 3 functional groups (authentication, lead-capture, support). All require backend service integration; none are simple client-only contact forms. In EDS these become Forms-block implementations wired to the identity provider and CRM — the single largest manual workstream after content.', { runOpts: { bold: false } }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 7. OFFERS / PERSONALIZATION
// =====================================================================
children.push(h1('7. Offers & Personalization Analysis'));
children.push(para('The presence of Adobe Target (abbviecommercial.tt.omtrdc.net) and Audience Manager (demdex) confirms an active personalization layer. Personalization is delivered client-side via Target mboxes/Launch rather than server-side, so individual offer content is not enumerable from static HTML. Below is the assessed structure.'));
children.push(table(
  ['Offer / Personalization Type', 'Sample Location', 'Features', 'Complexity', 'Backend Needed'],
  [
    ['Homepage hero / promo personalization', 'https://www.botoxone.com/', 'Target-driven hero & promo swaps by audience', 'Complex', 'Yes — Adobe Target'],
    ['Indication-level audience targeting', 'indication landing pages', 'Audience-Manager segment-based content', 'Medium', 'Yes — AAM/Target'],
    ['Savings / program offers', 'OAB, migraine promos', 'CTA / banner offers to savings programs', 'Medium', 'Yes — Target'],
  ],
  { widths: [28, 26, 22, 12, 12], complexityCols: [3] },
));
children.push(spacer());
children.push(para('Estimate: a handful of Target activities (likely 3–10) drive hero/promo personalization. These need re-implementation against Target in the EDS context (client-side decisioning is preserved; ensure Launch/Target are re-wired). Exact activity count requires access to the Adobe Target workspace — recommend a discovery session with the marketing team.', { runOpts: { italics: true, color: C.muted } }));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 8. COMPLEX USE CASES
// =====================================================================
children.push(h1('8. Complex Use Cases & Observations'));
children.push(table(
  ['Use Case', 'Instances', 'Where', 'Why Complex'],
  [
    ['HCP authentication gate', '1 (site-wide)', 'All gated content, calculators, account', 'Session/identity dependency; 401 on direct access; gating logic must be reproduced'],
    ['Adaptive Forms + CRM', '7', 'Auth & lead forms', 'Stateful, server-validated, CRM/identity backends, reCAPTCHA'],
    ['Coveo faceted search', '~25 pages', 'Resources & search listings', 'Client-side API rendering, query params, facets, document collections'],
    ['Dosing calculators (ULS/LLS)', '2', 'Adult spasticity dosing', 'Interactive JS logic, gated, clinical calculation rules'],
    ['Personalization (Target/AAM)', '3–10 activities', 'Homepage, indications', 'Audience-based content swaps not visible in static HTML'],
    ['Persistent ISI / regulatory tray', '1 (all pages)', 'Footer tray', 'Sticky, expandable, compliance-critical content that must render identically'],
    ['Find-an-Injector locator', '1', '/find-an-injector', 'Map + provider data source, geo-search'],
    ['Indication color theming', '10 indications', 'All indication pages', 'Each therapeutic area has distinct theme tokens applied to shared blocks'],
  ],
  { widths: [22, 12, 26, 40] },
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 9. OUTLIERS
// =====================================================================
children.push(h1('9. Outlier Scenarios (non-standard implementations)'));
children.push(table(
  ['Scenario', 'Behaviour / Implementation', 'EDS Approach', 'Effort'],
  [
    ['Form-as-iframe', 'Forms rendered via aemform.iframe.en.html injected by a clientlib — a full HTML document loaded into an iframe', 'Rebuild as native EDS Forms block; drop iframe pattern', '40–60 h'],
    ['Coveo client-rendered listings', 'Resource/search pages return a shell; results hydrated from Coveo API with query-param state (q=, sp_c=, collection=)', 'EDS block + edge worker / client fetch to Coveo; preserve deep-link params', '30–50 h'],
    ['Gated dosing calculators', 'Interactive calculators behind 401 auth; clinical JS logic', 'Custom EDS block + auth integration; port calculation logic', '24–40 h'],
    ['Legacy clientlib design system', 'Single monolithic minified CSS/JS clientlib (jQuery-era)', 'Re-implement as scoped EDS block CSS; no jQuery', 'Folded into block dev'],
    ['Sitemap pollution', 'Sitemap exposes internal /content/*.html + typo paths that 404', 'Clean sitemap; build 301 redirect map', '4–8 h'],
  ],
  { widths: [18, 38, 30, 14] },
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// 10. MIGRATION ESTIMATES
// =====================================================================
children.push(h1('10. Migration Estimates'));
children.push(para('Estimates assume migration to AEM as a Cloud Service with Edge Delivery Services and ALM (Adobe Lifecycle Management) integration, a 3–4 person team, and reuse of the automated catalog/import tooling for templated content.'));

children.push(h2('10.1 Effort Breakdown'));
children.push(table(
  ['Workstream', 'Scope', 'Effort (hours)'],
  [
    ['Automated content migration', '~80 templated indication/content/overview pages via import tooling', '60–80'],
    ['Block / component development', '~13 base blocks + variants (hero, columns, cards, tabs, accordion, carousel, video, ISI, etc.)', '90–110'],
    ['Forms re-platforming', '7 Adaptive Forms → EDS Forms + identity/CRM wiring', '70–90'],
    ['Search (Coveo) integration', 'Search + faceted resource listings, edge worker / client hydration', '40–55'],
    ['Personalization (Target/AAM)', 'Re-wire Launch/Target/AAM; rebuild 3–10 activities', '24–36'],
    ['Interactive tools', 'ULS/LLS calculators + find-an-injector', '40–60'],
    ['Auth gate & account', 'HCP gating + manage-account integration', '30–45'],
    ['Assets migration', '30 PDFs + ~300–500 images to DAM, redirect map', '16–24'],
    ['QA & functional testing', 'Cross-template, forms, search, gated flows', '40–55'],
    ['UAT, accessibility & launch', 'WCAG 2.1 AA, regulatory ISI verification, go-live', '24–32'],
  ],
  { widths: [28, 50, 22] },
));
children.push(spacer());
children.push(table(
  ['Summary', 'Low (h)', 'High (h)'],
  [
    ['Automated migration', '60', '80'],
    ['Manual / custom development', '294', '396'],
    ['QA & testing', '40', '55'],
    ['UAT & launch', '24', '32'],
    ['Total (person-hours)', '~418', '~563'],
  ],
  { widths: [50, 25, 25] },
));
children.push(spacer());
children.push(h2('10.2 Schedule & Cost'));
children.push(table(
  ['Dimension', 'Estimate'],
  [
    ['Total effort', '~420–565 person-hours'],
    ['Team size', '3–4 (1 lead/architect, 2 EDS devs, 1 QA; part-time integration specialist)'],
    ['Calendar duration', '~10–12 weeks'],
    ['Indicative cost (blended $120/h)', '~$50K–$68K (engineering only; excludes licensing, Adobe Target/Coveo re-contracting, content authoring)'],
    ['Confidence', 'Medium — forms/auth, Coveo, and Target activity counts need stakeholder discovery to firm up'],
  ],
  { widths: [38, 62] },
));
children.push(spacer());
children.push(h2('10.3 Key Assumptions & Risks'));
children.push(bullet('Gated content (calculators, account, some forms) requires credentialed access for full fidelity analysis — estimates carry contingency.'));
children.push(bullet('Adobe Target activity count and Coveo configuration require workspace access to confirm exact scope.'));
children.push(bullet('Regulatory/ISI content is compliance-critical; pixel-and-text-accurate reproduction and MLR sign-off may extend UAT.'));
children.push(bullet('External integrations (Allergan Direct, Salesforce, savings programs) assumed to remain external links, not re-platformed.'));
children.push(bullet('The 10-indication content set is highly repetitive — the dominant driver of automation savings; if indications diverge in structure, automated share drops.'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// =====================================================================
// APPENDIX
// =====================================================================
children.push(h1('Appendix A: URLs Analysed by Template'));
templates.slice().sort((a, b) => b.urls.length - a.urls.length).forEach((t) => {
  children.push(h2(`${t.name} (${t.urls.length} pages)`));
  t.urls.slice(0, 20).forEach((u) => children.push(bullet(u)));
  if (t.urls.length > 20) children.push(para(`… and ${t.urls.length - 20} more`, { runOpts: { italics: true, color: C.muted } }));
});

// =====================================================================
// BUILD
// =====================================================================
const doc = new Document({
  creator: 'EDS Migration Assessment',
  title: 'BOTOX ONE AEM Migration Scope Report',
  description: 'Site scope and effort assessment for migrating www.botoxone.com to AEM as a Cloud Service',
  features: { updateFields: true },
  styles: {
    default: {
      document: { run: { font: TITLE_FONT, size: 20 } },
    },
  },
  sections: [{
    properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log('WROTE', OUT, buf.length, 'bytes');
});
