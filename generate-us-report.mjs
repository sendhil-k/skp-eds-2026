import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ImageRun,
  PageBreak, ShadingType, Header, Footer, PageNumber
} from 'docx';
import fs from 'fs';

// Load screenshot images
const screenshots = {};
const screenshotFiles = [
  'us-homepage.png', 'us-l1-category.png', 'us-l2-category.png',
  'us-brand-page.png', 'us-support.png', 'us-documents.png',
  'us-promotions.png', 'us-events.png'
];
for (const f of screenshotFiles) {
  const path = `/tmp/playwright/${f}`;
  if (fs.existsSync(path)) {
    screenshots[f] = fs.readFileSync(path);
  }
}

// Constants
const BRAND_RED = 'C41230';
const BRAND_DARK = '2D2D2D';
const HEADER_BG = 'F0F0F0';
const LIGHT_GRAY = 'F8F8F8';
const WHITE = 'FFFFFF';

// Helper functions
function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });
}
function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
}
function h3(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, size: 22, font: 'Calibri', ...opts })]
  });
}
function bold(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, bold: true, size: 22, font: 'Calibri' })]
  });
}
function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Calibri' })]
  });
}
function multiRun(runs) {
  return new Paragraph({
    spacing: { after: 120 },
    children: runs.map(r => new TextRun({ size: 22, font: 'Calibri', ...r }))
  });
}

function headerCell(text) {
  return new TableCell({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, size: 20, font: 'Calibri', color: WHITE })]
    })],
    shading: { fill: BRAND_RED, type: ShadingType.CLEAR },
    verticalAlign: 'center',
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text: String(text), size: 20, font: 'Calibri', ...opts })]
    })],
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    verticalAlign: 'center',
  });
}

function createTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map(h => headerCell(h)), tableHeader: true }),
      ...rows.map((row, i) => new TableRow({
        children: row.map(c => cell(c, { shading: i % 2 === 1 ? LIGHT_GRAY : undefined }))
      }))
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
    }
  });
}

function addScreenshot(name, caption) {
  const parts = [];
  if (screenshots[name]) {
    parts.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data: screenshots[name], transformation: { width: 500, height: 350 }, type: 'png' })]
    }));
    parts.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: caption, italics: true, size: 18, font: 'Calibri', color: '666666' })]
    }));
  }
  return parts;
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ============================================================
// BUILD DOCUMENT
// ============================================================
const sections = [];

// COVER PAGE
sections.push(
  new Paragraph({ spacing: { before: 3000 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Thermo Fisher Scientific', size: 52, font: 'Calibri', bold: true, color: BRAND_RED })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new TextRun({ text: 'US Locale (thermofisher.com/us/en/)', size: 32, font: 'Calibri', color: BRAND_DARK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400 },
    children: [new TextRun({ text: 'AEM-to-EDS Migration Assessment', size: 44, font: 'Calibri', bold: true, color: BRAND_DARK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300 },
    children: [new TextRun({ text: 'Version 1.0 | March 15, 2026', size: 26, font: 'Calibri', color: '888888' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new TextRun({ text: 'CONFIDENTIAL', size: 24, font: 'Calibri', bold: true, color: BRAND_RED })]
  }),
  pageBreak(),

  // EXECUTIVE SUMMARY
  h1('Executive Summary'),
  p('This document provides a comprehensive migration assessment for thermofisher.com US locale (/us/en/) from Adobe Experience Manager (AMS) to Adobe Edge Delivery Services (EDS). The assessment covers technology stack analysis, page inventory, component catalog, integrations analysis, and a phased migration plan with effort estimates.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['Metric', 'Value'], [
    ['CMS Content Pages (US Locale)', '12,161'],
    ['Supplementary Pages (Product Catalog, Antibodies, etc.)', '~911,826 (out of EDS scope)'],
    ['Unique Page Templates', '16'],
    ['Reusable Blocks/Components', '48'],
    ['Third-Party Integrations', '23'],
    ['Web Forms Identified', '12'],
    ['Design Variations (Same Content Model)', '15'],
    ['Locales Served', '35 (23 countries, 9 languages)'],
    ['Estimated Migration Duration', '7-9 months (realistic)'],
    ['Estimated Team Size', '8-12 people'],
  ]),
  pageBreak(),

  // 1. CURRENT TECH STACK
  h1('1. Current Technology Stack'),
  p('The site is built on Adobe Experience Manager (AMS) with a server-rendered HTML architecture, supplemented by multiple client-side systems for commerce, personalization, and analytics.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['Layer', 'Technology', 'Details'], [
    ['CMS', 'Adobe Experience Manager (AMS)', 'Server-rendered pages, AEM client libraries (/etc/designs/komodo/)'],
    ['Frontend Framework', 'Vanilla JS + jQuery Migrate 3.4.1', 'No SPA framework; progressive enhancement; BEM CSS'],
    ['Commerce (Out of Scope)', 'Custom Java/AEM + React SPA', '/order/, /store/ paths; React/Redux for product catalog'],
    ['Blog (Out of Scope)', 'WordPress', 'acceleratingscience.com; API-fed into homepage'],
    ['Search', 'Lucidworks Fusion', 'Migrated from Oracle Endeca; typeahead autocomplete'],
    ['Analytics', 'Adobe Analytics + AEP/Alloy v2.23', 'digitalData layer; edge.adobedc.net data collection'],
    ['Tag Management', 'Adobe Launch (Experience Platform Tags)', 'assets.adobedtm.com; multiple extension bundles'],
    ['Personalization', 'Adobe Target + DM Dynamic Offers', 'Pre-hiding containers; server-side offer injection'],
    ['Authentication', 'Custom SSO + Gigya/SAP CDC', 'identity.thermofisher.com; /auth/initiate flow'],
    ['CDN / Security', 'Akamai', 'Bot management, edge caching, WAF'],
    ['Cookie Consent', 'TrustArc', 'GDPR compliance; consent.truste.com'],
    ['Chat', 'Custom + Magellan GenAI (feature-flagged)', 'chat-api.thermofisher.com; Vue.js-based'],
    ['Accessibility', 'UserWay', 'Widget overlay; account P3pDlQucOz'],
    ['Feedback', 'Medallia / Kampyle', 'Form ID 29308; floating button'],
    ['Design System', 'HelveticaNeue, 11 weights, WOFF2', '7 breakpoints; #e71316 brand red'],
  ]),
  pageBreak(),

  // 2. INTEGRATIONS ANALYSIS
  h1('2. Integrations Analysis'),
  p('23 third-party integrations identified across the site. Each integration is classified by type and complexity for migration planning.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['#', 'Integration', 'Type', 'Complexity', 'Reference / Evidence'], [
    ['1', 'Adobe Analytics', 'Embed / API', 'Medium', '_satellite object, digitalData layer on all pages'],
    ['2', 'Adobe Experience Platform (Alloy)', 'API / SDK', 'High', 'alloy.min.js v2.23.0, edge.adobedc.net'],
    ['3', 'Adobe Launch (EP Tags)', 'Embed', 'High', 'assets.adobedtm.com, multiple RC bundles'],
    ['4', 'Adobe Target', 'API', 'High', '/api/store/recommendations/recommendation/target/attributes'],
    ['5', 'DM Dynamic Offers', 'Custom Code', 'High', '/dm-offers/offers.min.js; CSS template injection'],
    ['6', 'OOB Recommendation Engine', 'API', 'Medium', '/api/store/recommendations/oobRecommendation/'],
    ['7', 'Price & Availability API', 'API', 'High', '/api/store/recommendations/priceandavail (POST, 24 items/batch)'],
    ['8', 'TF Identity Service', 'Custom Code', 'High', 'identity.thermofisher.com; /auth/initiate SSO'],
    ['9', 'Gigya / SAP CDC', 'Plugin', 'Medium', 'digitalData.user.gigyaId field'],
    ['10', 'Lucidworks Fusion', 'Embed / API', 'High', '/search/searchbar/, /search/static/resources/js/signals.min.js'],
    ['11', 'Custom Chat System', 'Embed / API', 'High', 'chat-api.thermofisher.com; eligibility API; Vue.js app'],
    ['12', 'Magellan GenAI Chat', 'API (Feature-flagged)', 'High', 'Cookie ts_magellan_genai; A/B tested'],
    ['13', 'TrustArc', 'Embed', 'Medium', 'consent.truste.com/notice; Accept/Reject/Manage'],
    ['14', 'Akamai CDN + Bot Mgmt', 'Infrastructure', 'High', 'akacd_TFCOM_Prod_AWS_Publish; bot detection scripts'],
    ['15', 'UserWay Accessibility', 'Embed', 'Medium', 'cdn.userway.org/widgetapp/; API tunings'],
    ['16', 'Medallia / Kampyle', 'Embed', 'Medium', 'nebula-cdn.kampyle.com; form IDs 29308, 46937'],
    ['17', 'WordPress Blog API', 'API', 'Medium', 'admin.acceleratingscience.com/wp-json/as-api/v1/blog-feed'],
    ['18', 'MasterControl', 'External Link', 'Low', 'thermofisher.mastercontrol.com (privacy policy)'],
    ['19', 'Adobe Cart System', 'API', 'High', '/api/store/carts/{cartId}/minicart; cartV3Enabled'],
    ['20', 'jQuery Migrate 3.4.1', 'Embed', 'Low', 'Legacy compatibility; deprecated APIs in use'],
    ['21', 'Hotjar', 'Embed', 'Low', 'Cookie _hjSessionUser_4539 (corporate subdomain)'],
    ['22', 'Form Security (CSRF)', 'Custom Code', 'Low', 'Cookie formSecurity'],
    ['23', 'TrustArc GTM Bridge', 'Plugin', 'Low', 'gtm=true parameter in consent notice'],
  ]),
  pageBreak(),

  // 3. PAGES & ASSETS INVENTORY
  h1('3. Pages and Assets Inventory'),
  h2('3.1 CMS Content Pages (In EDS Scope)'),
  p('The US locale sitemap (sitemap-us-en.xml) contains 12,161 CMS-authored pages. These are the pages targeted for EDS migration.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['Section', 'Page Count', '% of Total', 'Avg Depth'], [
    ['Life Science', '3,476', '28.6%', '4-5'],
    ['Industrial', '1,978', '16.3%', '4-5'],
    ['References / Protocols', '1,545', '12.7%', '3-4'],
    ['Technical Resources', '1,223', '10.1%', '3-4'],
    ['Products & Services (incl. Promotions)', '837', '6.9%', '3-4'],
    ['Clinical', '628', '5.2%', '4-5'],
    ['About Us / Events', '573', '4.7%', '2-3'],
    ['Electron Microscopy', '418', '3.4%', '3-4'],
    ['Materials Science', '282', '2.3%', '3-4'],
    ['Brands', '250', '2.1%', '2-3'],
    ['Bioprocessing', '215', '1.8%', '3-4'],
    ['Chemicals', '169', '1.4%', '3-4'],
    ['Virtual / 3D Tours', '109', '0.9%', '2'],
    ['Other (Events, New Ideas, Global, etc.)', '458', '3.8%', '2-3'],
    ['TOTAL', '12,161', '100%', '—'],
  ]),

  h2('3.2 Supplementary Pages (Out of EDS Scope)'),
  p('These application-generated pages are served by dedicated systems (React SPA, antibody app, etc.) and are NOT in scope for EDS CMS migration.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['System', 'URL Pattern', 'Approx. Pages', 'Technology'], [
    ['Product Catalog', '/order/catalog/product/{SKU}', '393,254', 'React SPA'],
    ['Antibodies', '/antibody/product/{name}/{id}', '359,830', 'Dedicated App'],
    ['Citations', '/order/catalog/product/{SKU}/citations', '109,062', 'React SPA'],
    ['FAQ Pages', '/store/sitemap/faq/', '32,122', 'React SPA'],
    ['Antibody Videos', 'Video sitemap', '11,336', 'Video CDN'],
    ['CAS Chemical Search', '/search/cas/{CAS-number}', '5,648', 'Search App'],
    ['Other (OneLambda, Allergy, etc.)', 'Various', '574', 'Dedicated Apps'],
    ['TOTAL OUT OF SCOPE', '—', '~911,826', '—'],
  ]),

  h2('3.3 Assets'),
  p('Images and media assets are served from AEM DAM (/content/dam/) and Adobe Dynamic Media. Key observations:'),
  bullet('Hero banners and promotional images: dynamically served via DM Offers system'),
  bullet('Product images: served from product catalog CDN (shared across locales)'),
  bullet('Brand logos and icons: served from /etc/designs/ client libraries'),
  bullet('Blog images: served from WordPress (acceleratingscience.com)'),
  bullet('Estimated unique image assets: 15,000-25,000 (excluding product catalog)'),
  pageBreak(),

  // 4. TRAFFIC GROUPING
  h1('4. Page Grouping by Traffic'),
  p('Pages are classified into HIGH, MEDIUM, and LOW traffic groups based on URL depth, section importance, and typical user navigation patterns for a B2B scientific commerce site.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['Traffic Group', 'Page Count', '% of Total', 'Description', 'Migration Priority'], [
    ['HIGH', '233', '1.9%', 'Homepage, L1 section hubs (27), L2 major categories (205)', 'Phase 1 - First'],
    ['MEDIUM', '4,116', '33.8%', 'L3-L4 subcategories, brand pages, promotions (710), events (562), virtual tours', 'Phase 2'],
    ['LOW', '7,812', '64.2%', 'Depth 5+ pages, reference articles (1,545), technical library (1,200+), deep subpages', 'Phase 3'],
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  h3('Traffic Group Breakdown by Section'),
  createTable(['Section', 'HIGH', 'MEDIUM', 'LOW'], [
    ['Life Science', '24', '1,168', '2,284'],
    ['Industrial', '18', '569', '1,391'],
    ['References', '—', '8', '1,537'],
    ['Technical Resources', '—', '14', '1,209'],
    ['Products & Services', '1', '126', '710'],
    ['Clinical', '12', '76', '540'],
    ['About Us / Events', '1', '91', '481'],
    ['Electron Microscopy', '1', '110', '307'],
    ['Brands', '18', '86', '146'],
    ['Support', '1', '12', '—'],
    ['Other', '157', '1,856', '1,207'],
    ['TOTAL', '233', '4,116', '7,812'],
  ]),
  pageBreak(),

  // 5. TEMPLATES INVENTORY
  h1('5. Templates Inventory'),
  p('16 unique page templates identified across the US locale. Templates are classified by complexity and migration approach.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['#', 'Template', 'Complexity', 'Count', 'Reasoning', 'Example URL'], [
    ['1', 'Homepage', 'High', '1', 'Dynamic offers, personalization, carousels, product carousel with pricing, blog feed', 'thermofisher.com/us/en/home.html'],
    ['2', 'L1 Category Hub', 'Medium', '27', 'H1 title, featured links, 4-column category grid, banner images', '/us/en/home/life-science.html'],
    ['3', 'L2 Category', 'High', '205', 'Hero with CTA, image cards, value props, application links, research areas', '/us/en/home/life-science/antibodies.html'],
    ['4', 'L3-L5 Product Category', 'Medium', '8,300', 'Nested categories with sidebar nav, product specs, comparison content', '/us/en/home/life-science/pcr/real-time-pcr.html'],
    ['5', 'Brand Page', 'Medium', '250', 'Brand logo, sidebar nav, multi-section content, resource cards', '/us/en/home/brands/thermo-scientific.html'],
    ['6', 'Technical Resources', 'Medium', '1,223', 'Reference library pages, learning centers, document hubs', '/us/en/home/technical-resources.html'],
    ['7', 'References / Protocols', 'Low', '1,545', 'Structured document pages, text-heavy, minimal interactivity', '/us/en/home/references/protocols.html'],
    ['8', 'Support Hub', 'Medium', '13', 'Multi-column link grid, collapsible TOC, contact sidebar', '/us/en/home/support.html'],
    ['9', 'Promotions / Campaign', 'Medium', '710', 'Promo hero, product cards, CTAs, time-sensitive content', '/us/en/home/products-and-services/promotions.html'],
    ['10', 'About Us', 'Low', '91', 'Corporate content, text-focused, external links', '/us/en/home/about-us.html'],
    ['11', 'Events / Webinars', '  Medium', '562', 'Table-based layout, client-side filter, date-driven content', '/us/en/home/events.html'],
    ['12', 'Virtual / 3D Tours', 'High', '109', 'Embedded 3D product viewers, interactive experiences', '/us/en/home/virtual/vanquish-horizon-hplc.html'],
    ['13', 'Clinical', 'Medium', '628', 'Category pattern with clinical-specific content', '/us/en/home/clinical/diagnostic-testing.html'],
    ['14', 'Industrial', 'Medium', '1,978', 'Category pattern with industrial-specific content', '/us/en/home/industrial/chromatography.html'],
    ['15', 'Global / Legal', 'Low', '52', 'Simple text pages (terms, privacy, policies)', '/us/en/home/global/terms-and-conditions.html'],
    ['16', 'Misc / Legacy', '  Low', '128', 'Campaign landing pages, test pages, unsubscribe', '/us/en/home/homepage2020.html'],
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  ...addScreenshot('us-homepage.png', 'Figure 1: Homepage Template — Hero carousel, product offers, promotions, blog feed'),
  ...addScreenshot('us-l1-category.png', 'Figure 2: L1 Category Template — Life Sciences hub with 4-column category grid'),
  ...addScreenshot('us-l2-category.png', 'Figure 3: L2 Category Template — Antibodies with hero, image cards, research areas'),
  ...addScreenshot('us-brand-page.png', 'Figure 4: Brand Page Template — Thermo Scientific with sidebar nav, resource cards'),
  ...addScreenshot('us-support.png', 'Figure 5: Support Hub Template — Multi-column link grid with collapsible TOC'),
  ...addScreenshot('us-documents.png', 'Figure 6: Documents & Certificates — CoA, SDS, Manuals lookup forms'),
  ...addScreenshot('us-promotions.png', 'Figure 7: Promotions Template — Card grid with promo imagery and CTAs'),
  ...addScreenshot('us-events.png', 'Figure 8: Events Template — Table-based layout with client-side filter'),
  pageBreak(),

  // 6. BLOCKS / COMPONENTS CATALOG
  h1('6. Blocks / Components Catalog'),
  p('48 unique reusable blocks/components identified. Where the same content model has different visual layouts, these are cataloged as design variations rather than separate blocks.'),
  new Paragraph({ spacing: { after: 100 } }),
  h2('6.1 Navigation Components (10)'),
  createTable(['Block', 'Complexity', 'Behavior & Functionality', 'Pages', 'Reference URL'], [
    ['Global Header Bar', 'High', 'Fixed position, responsive (60px mobile/88px desktop), logo, search, utility icons, z-index:80', 'All pages', '/us/en/home.html'],
    ['Promotional Top Bar', 'Medium', 'Rotating promo banner above header, full-width clickable link, dismiss button', 'All pages', '/us/en/home.html'],
    ['Mega Navigation Menu', 'High', 'Left slide-out on mobile (380px), horizontal mega-menu desktop (993px+), multi-level hierarchy', 'All pages', '/us/en/home.html'],
    ['Breadcrumb Trail', 'Low', 'Home > Category > Subcategory with ">" separator, linked parents', 'Category, Brand', '/us/en/home/life-science.html'],
    ['Utility Bar', 'Medium', 'Order Status, Quick Order, Sign In, Bell, Cart icons; hidden below 993px', 'All pages', '/us/en/home.html'],
    ['Account Dropdown', 'Medium', '330px dropdown with user name, My Account, loyalty info, Sign Out', 'All pages (auth)', '/us/en/home.html'],
    ['Left Sidebar Nav', 'Medium', 'Sticky vertical nav: Popular Products, Key Applications, Resources sections', 'Brand pages', '/us/en/home/brands/thermo-scientific.html'],
    ['Collapsible TOC', 'Medium', 'Accordion button expanding/collapsing page content outline', 'Support', '/us/en/home/support.html'],
    ['In-Page Anchor Nav', 'Low', 'Horizontal link list linking to #anchor sections within page', 'Brand pages', '/us/en/home/brands/thermo-scientific.html'],
    ['Country/Locale Selector', 'Low', 'Footer element: flag icon + country name, locale picker modal', 'All pages', '/us/en/home.html'],
  ]),

  h2('6.2 Hero & Banner Components (5)'),
  createTable(['Block', 'Complexity', 'Behavior & Functionality', 'Pages', 'Reference URL'], [
    ['Full-Width Hero Banner', 'High', 'DM Offers dynamic content, background image, overlaid text + CTA, multiple rotating variants', 'Homepage', '/us/en/home.html'],
    ['Category Hero Banner', 'Medium', 'Colored background (#A51C36), H1 heading, subtitle, primary CTA button', 'L2 categories', '/us/en/home/life-science/antibodies.html'],
    ['Brand Hero Image', 'Low', 'Large brand logo image with in-page anchor nav below', 'Brand pages', '/us/en/home/brands/thermo-scientific.html'],
    ['Page Title Header', 'Low', 'Plain H1 on light gray background strip', 'L1, Support', '/us/en/home/life-science.html'],
    ['Sticky Bottom Promo Bar', 'Medium', 'Fixed bottom bar with promo text, CTA link, dismiss "x" button', 'Homepage, L1, L2', '/us/en/home.html'],
  ]),

  h2('6.3 Content Blocks (11)'),
  createTable(['Block', 'Complexity', 'Behavior & Functionality', 'Design Variations'], [
    ['Featured Education Section', 'Medium', 'H2 + "See all" link, teaser cards with full-width image, title, bullet points, CTA', '—'],
    ['Blog Post List', 'Medium', 'H2 + "View all" link, 3 entries: thumbnail, title, date, "Read more"', '—'],
    ['Category Description Grid', 'Medium', '4-column grid of H3-linked categories with paragraph descriptions (18 categories)', '—'],
    ['Value Proposition Cards', 'Medium', '3-card horizontal: image, H4, description, "Learn more" link', '—'],
    ['Application Links + Image', 'Medium', 'Left image + right 2-column link list with arrow icons', 'Variation: Research Areas (3-col no image)'],
    ['Research Areas Grid', 'Low', '3-column grid of arrow-prefixed links (9 links)', 'Variation of Application Links'],
    ['Related Categories', 'Medium', 'Image + 2-column link list with arrows', '—'],
    ['Brand Description Block', 'Low', 'H2 + multi-paragraph rich text with inline links, separated by <hr>', '—'],
    ['Multi-Column Support Grid', 'High', '2-column layout with 10+ H2/H3 categorized link sections', '—'],
    ['Supply Center Block', 'Low', 'H2 + subtitle + CTA link, text-only, no image', '—'],
    ['Regulatory Disclaimer', 'Low', 'Single-line "For Research Use Only" text at page bottom', '—'],
  ]),

  h2('6.4 Card Components (10)'),
  createTable(['Block', 'Complexity', 'Behavior & Functionality', 'Design Variations'], [
    ['Promotional Pod Cards (3-up)', 'Medium', 'Background image, short text, CTA link; part of DM offers system', '—'],
    ['Product Carousel Card', 'High', 'Catalog #, name, image, strikethrough price, special offer, savings %, "Add to cart"', '—'],
    ['Promotion Banner Card (2-up)', 'Medium', 'Background image, text overlay, badge label, primary CTA button', 'Variation: 4-up layout'],
    ['New Product Card (3-up)', 'Medium', 'Product image, title, description, "Learn more" CTA', '—'],
    ['Educational Content Card', 'Low', '3-up horizontal: icon image + linked title, no description', '—'],
    ['Related Pages Card (2-up)', 'Low', 'Icon + linked title only', '—'],
    ['Resource Card w/ Thumbnail', 'Medium', '70x70 thumbnail left, H3 linked title + description right', '—'],
    ['Category Image Card (2x2)', 'Medium', 'Full-width image + linked label below; grid layout', '—'],
    ['Event Table Row', 'Medium', 'Table-based layout: date, title, location, type, CTA', '—'],
    ['Promotion Listing Card', 'Medium', 'Image, promo badge, description, CTA; filterable grid', 'Variation: with/without badge'],
  ]),

  h2('6.5 Interactive & Third-Party Components (12)'),
  createTable(['Block', 'Complexity', 'Behavior & Functionality', 'Pages'], [
    ['Product Offer Carousel', 'High', '4 visible cards, arrow + dot nav, 24 products, pricing, "Add to cart"', 'Homepage'],
    ['Promotional Carousel', 'Medium', '2-4 visible cards, arrow + dot navigation', 'Homepage'],
    ['Global Search Bar', 'High', 'Typeahead autocomplete, provider dropdown, mobile full-screen overlay', 'All pages'],
    ['Cookie Consent Banner', 'Medium', 'TrustArc: Accept All / Reject All / Manage Settings', 'All pages'],
    ['Cart Drawer Sidebar', 'High', 'Right-slide 440px, product list, pricing, suggested products, checkout CTA', 'All pages'],
    ['Notification Bell Dropdown', 'Medium', '420px dropdown, scrollable notifications, timestamps, "See All"', 'All pages'],
    ['TrustArc Cookie Manager', 'High', 'Full GDPR consent system, tag injection management', 'All pages'],
    ['Adobe Launch/DTM', 'High', 'Tag management, Adobe Target personalization with 3s pre-hiding', 'All pages'],
    ['Kampyle/Medallia Feedback', 'Medium', 'Fixed "Feedback" button, form ID 29308', 'Most pages'],
    ['AI Chat Widget', 'High', 'Chat launcher, eligibility API, Vue.js app', 'Category, Support'],
    ['Accessibility Quick Menu', 'Medium', '4 buttons: skip content, visual impairment, a11y menu, a11y nav', 'All pages'],
    ['Global Footer (5-column)', 'High', 'Ordering, Support, Resources, About TF, Portfolio; legal bar', 'All pages'],
  ]),
  pageBreak(),

  // 7. PAGE COUNTS BY TEMPLATE
  h1('7. Page Counts by Template (Migration Approach)'),
  createTable(['Template', 'Total', 'Auto-Migratable', 'Manual Migration', 'Notes'], [
    ['Homepage', '1', '0', '1', 'Dynamic offers, personalization, carousels require manual setup'],
    ['L1 Category Hub', '27', '22', '5', 'Standard grid pattern; some have custom promo banners'],
    ['L2 Category', '205', '155', '50', 'Hero + cards + links; variable section counts'],
    ['L3-L5 Product Category', '8,300', '7,300', '1,000', 'Bulk-importable with templates; edge cases need manual review'],
    ['Brand Page', '250', '190', '60', 'Sidebar nav + mixed content; some heavily customized'],
    ['Technical Resources', '1,223', '1,050', '173', 'Reference content, mostly structured text'],
    ['References / Protocols', '1,545', '1,400', '145', 'Highly structured document pages'],
    ['Support Hub', '13', '0', '13', 'Complex multi-column layouts, all need manual work'],
    ['Promotions / Campaign', '710', '550', '160', 'Variable layouts, some time-sensitive logic'],
    ['About Us', '91', '75', '16', 'Text-focused, some link to corporate subdomain'],
    ['Events / Webinars', '562', '450', '112', 'Table-based with filter; date-driven content'],
    ['Virtual / 3D Tours', '109', '0', '109', 'Embedded 3D viewers need custom implementation'],
    ['Clinical', '628', '520', '108', 'Standard category pattern with clinical specifics'],
    ['Industrial', '1,978', '1,700', '278', 'Standard category pattern, deepest hierarchy'],
    ['Global / Legal', '52', '48', '4', 'Simple text pages'],
    ['Misc / Legacy', '128', '40', '88', 'Campaign pages, test pages, varied layouts'],
    ['TOTALS', '12,161', '9,500 (78%)', '2,661 (22%)', '—'],
  ]),
  pageBreak(),

  // 8. COMPLEX USE CASES
  h1('8. Complex Use Cases & Observations'),
  createTable(['#', 'Use Case', 'Instances', 'Where Found', 'Why Complex'], [
    ['1', 'Product Recommendation Engine (Adobe Target)', '1 carousel + multiple placements', 'Homepage, category pages', 'Real-time API calls to /api/store/recommendations/; personalized per user context (region, cart, history). Requires EDS integration with Target APIs.'],
    ['2', 'Dynamic Pricing Display', '24+ products per carousel', 'Homepage Online Offers', 'Dual pricing (regular + special offer), savings calculation, real-time price API. Currency/locale-aware.'],
    ['3', 'DM Dynamic Offers System', '3-5 placements per page', 'Homepage, category pages', 'Server-side personalization injecting HTML into placeholders. 200+ country code validation. CSS template loading. Retry mechanism (25 attempts).'],
    ['4', 'Geolocation / Locale Detection', 'Global', '35 locales, 23 countries', 'Cookie-based (CK_ISO_CODE), hreflang tags, marketing region mapping. EDS needs edge-side detection or cookie routing.'],
    ['5', 'Real-Time Cart Management', 'Global', 'All pages (mini-cart)', 'Server-side cart with cartId cookie, version flag (cartV3Enabled), suggested products. Cross-page persistence.'],
    ['6', 'Certificate of Analysis Lookup', '1 form', 'Documents & Certificates page', 'AJAX lot/serial number lookup against backend API. Critical for regulated customers.'],
    ['7', 'Safety Data Sheet Search', '1 form', 'Documents & Certificates page', 'Catalog number-based document retrieval. Regulatory compliance requirement.'],
    ['8', 'AI Chat (Magellan GenAI)', 'Feature-flagged', 'Category, Support pages', 'Generative AI-powered chat being A/B tested. Feature flag via cookie ts_magellan_genai.'],
    ['9', 'Multi-Step Contact Routing', '1 hub', '/store/v2/contact-us', '6 topic cards leading to specialized contact methods. Real-time chat eligibility API check.'],
    ['10', 'Event Table with Client-Side Filter', '1 page + subpages', '/us/en/home/events.html', 'Table-based layout with text search filtering. Not server-side search.'],
    ['11', 'WordPress Blog Feed Integration', '1 section', 'Homepage', 'API-fed content from acceleratingscience.com. Dynamic date/title/thumbnail rendering.'],
    ['12', 'Virtual / 3D Product Tours', '109 pages', '/us/en/home/virtual/*', 'Embedded interactive 3D viewers. Each product has custom viewer configuration.'],
  ]),
  pageBreak(),

  // 9. WEB FORMS
  h1('9. Web Forms Analysis'),
  p('12 form types identified across the site. Forms are grouped by structure similarity and tagged by complexity.'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(['#', 'Form', 'Location', 'Complexity', 'Fields', 'Reasoning'], [
    ['1', 'Global Search Bar', 'All pages (header)', 'High', '1 text + 1 dropdown', 'Typeahead autocomplete, Lucidworks integration, mobile-responsive overlay, search signals analytics'],
    ['2', 'Contact Us Hub', '/store/v2/contact-us', 'High', '6 topic cards + sub-forms', 'Multi-step routing, chat eligibility API, multiple contact methods per topic'],
    ['3', 'CoA Lookup', 'Documents & Certificates', 'Medium', '1 text + 1 submit', 'AJAX lot/serial number lookup against backend API'],
    ['4', 'SDS Lookup', 'Documents & Certificates', 'Medium', '1 text + 1 submit', 'AJAX catalog number lookup; regulatory compliance'],
    ['5', 'Manuals & Guides Lookup', 'Documents & Certificates', 'Medium', '1 text + 1 submit', 'AJAX catalog number lookup'],
    ['6', 'FAQ Search', 'Documents & Certificates', 'Medium', '1 text + 1 submit', 'AJAX catalog number lookup'],
    ['7', 'Shopping Cart / Mini-Cart', 'All pages (sidebar)', 'High', 'Qty selectors + remove buttons', 'Cart API integration, real-time updates, suggested products'],
    ['8', 'Authentication / Sign-In', 'Header account', 'High', 'SSO redirect flow', 'identity.thermofisher.com; Gigya/SAP CDC integration'],
    ['9', 'Medallia Feedback', 'Floating button', 'Medium', 'Survey form', 'Kampyle SDK; form ID 29308'],
    ['10', 'Cookie Consent', 'Bottom banner', 'Low', 'Accept / Reject / Manage', 'TrustArc integration'],
    ['11', 'Event Text Filter', 'Events page', 'Low', '1 text input', 'Client-side table filtering'],
    ['12', 'Webinar Registration', '/global/forms/*', 'Medium', '5-10 fields', 'Standardized registration form template for events/webinars'],
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  h3('Form Complexity Summary'),
  createTable(['Complexity', 'Count', 'Forms'], [
    ['High', '4', 'Global Search, Contact Hub, Shopping Cart, Authentication'],
    ['Medium', '6', 'CoA Lookup, SDS Lookup, Manuals Lookup, FAQ Search, Medallia Feedback, Webinar Registration'],
    ['Low', '2', 'Cookie Consent, Event Text Filter'],
  ]),
  pageBreak(),

  // 10. ANALYSIS SUMMARY
  h1('10. Analysis Summary'),
  createTable(['Category', 'Total', 'Low', 'Medium', 'High'], [
    ['Page Templates', '16', '4', '8', '4'],
    ['Blocks / Components', '48', '14', '22', '12'],
    ['Design Variations', '15', '8', '5', '2'],
    ['Third-Party Integrations', '23', '5', '7', '11'],
    ['Web Forms', '12', '2', '6', '4'],
    ['Complex Use Cases', '12', '—', '4', '8'],
  ]),
  new Paragraph({ spacing: { after: 100 } }),
  bold('Key Metrics:'),
  bullet('Total CMS pages in scope: 12,161'),
  bullet('Auto-migratable pages: 9,500 (78%)'),
  bullet('Manual migration pages: 2,661 (22%)'),
  bullet('High-traffic pages (migration priority): 233'),
  bullet('Out-of-scope application pages: ~911,826'),
  bullet('Supported locales: 35 (potential for multi-locale rollout)'),
  pageBreak(),

  // 11. MIGRATION ESTIMATES
  h1('11. Migration Estimates'),
  h2('11.1 Effort Summary'),
  createTable(['Activity', 'Optimistic (days)', 'Realistic (days)', 'Pessimistic (days)'], [
    ['Discovery & Planning', '15', '20', '30'],
    ['Design System Migration', '15', '20', '25'],
    ['Core Block Development (48 components)', '80', '110', '140'],
    ['Integration Layer (23 integrations)', '45', '65', '85'],
    ['Import Infrastructure (parsers, transformers)', '30', '45', '60'],
    ['Content Migration (12,161 pages)', '90', '130', '175'],
    ['QA & Validation (visual, a11y, performance)', '45', '65', '85'],
    ['UAT & Launch (stakeholder review, cutover)', '20', '30', '40'],
    ['TOTAL', '340', '485', '640'],
  ]),

  h2('11.2 Team & Timeline'),
  createTable(['Scenario', 'Team Size', 'Duration', 'Total Person-Days', 'Cost @ $150-200/hr'], [
    ['Optimistic', '6-8', '5-6 months', '340', '$408K - $544K'],
    ['Realistic', '8-12', '7-9 months', '485', '$582K - $776K'],
    ['Pessimistic', '10-14', '9-12 months', '640', '$768K - $1.02M'],
  ]),
  pageBreak(),

  // 12. THREE-PHASE MIGRATION PLAN
  h1('12. Three-Phase Migration Plan'),
  p('The migration is structured into 3 sequential phases with no parallel execution. Each phase has defined workstreams, deliverables, and exit criteria.'),

  new Paragraph({ spacing: { after: 150 } }),
  // ROADMAP DIAGRAM (ASCII art in a code block)
  h2('12.1 Sequential Roadmap'),
  new Paragraph({
    spacing: { after: 200 },
    children: [new TextRun({ text: '    PHASE 1: Foundation          PHASE 2: Build & Migrate       PHASE 3: Scale & Launch', size: 18, font: 'Courier New', bold: true })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '    Month 1 ---- Month 3         Month 4 ---- Month 7          Month 8 ---- Month 9', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   ┌─────────────────────┐    ┌───────────────────────┐    ┌─────────────────────┐', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │ AEM: Content Audit   │    │ AEM: Bulk Import       │    │ AEM: Remaining Pages │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │   Template Mapping   │    │   Manual Migration     │    │   Content Freeze     │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │   Asset Inventory    │    │   Content Validation   │    │   Final Validation   │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   ├─────────────────────┤    ├───────────────────────┤    ├─────────────────────┤', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │ EDS: Design System   │    │ EDS: All 48 Blocks    │    │ EDS: Perf Tuning     │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │   Core Blocks (15)   │    │   Template Refinement  │    │   SEO Validation     │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │   Header/Footer      │    │   Visual QA            │    │   Lighthouse 100     │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   ├─────────────────────┤    ├───────────────────────┤    ├─────────────────────┤', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │ INT: Analytics Setup  │    │ INT: Target/Offers     │    │ INT: E2E Testing     │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │   Search POC         │    │   Cart Integration     │    │   DNS Cutover        │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   │   Auth Planning      │    │   Chat/Consent/A11y   │    │   Monitoring Setup   │', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    children: [new TextRun({ text: '   └─────────────────────┘    └───────────────────────┘    └─────────────────────┘', size: 18, font: 'Courier New' })]
  }),
  new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: '        EXIT: 233 HIGH pages       EXIT: 4,116 MED pages        EXIT: All 12,161 pages', size: 18, font: 'Courier New', bold: true })]
  }),

  new Paragraph({ spacing: { after: 200 } }),

  // PHASE 1 DETAIL
  h2('12.2 Phase 1: Foundation (Months 1-3)'),
  p('Establish the EDS project, migrate design system, build core blocks, and migrate all HIGH-traffic pages (233 pages).'),
  new Paragraph({ spacing: { after: 100 } }),
  h3('AEM Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['Content Audit & Template Mapping', '2 weeks', 'Complete page-template mapping for all 12,161 pages'],
    ['Asset Inventory', '1 week', 'Catalog of 15-25K unique images with source/format/dimensions'],
    ['Content Export Tooling', '2 weeks', 'AEM content extraction scripts and bulk export pipeline'],
    ['HIGH Page Content Prep', '3 weeks', 'Content for 233 high-traffic pages exported, cleaned, validated'],
  ]),
  h3('EDS Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['EDS Project Setup', '1 week', 'GitHub repo, aem.live config, local dev environment'],
    ['Design System Migration', '3 weeks', 'CSS custom properties, HelveticaNeue fonts, 7 breakpoints, brand colors'],
    ['Global Header Block', '2 weeks', 'Responsive header with search, utility bar, mega nav'],
    ['Global Footer Block', '1 week', '5-column footer with legal bar and locale selector'],
    ['Core Blocks (15 priority)', '4 weeks', 'Hero, cards, content blocks, breadcrumbs, sidebar nav'],
    ['HIGH Pages Import & Validation', '2 weeks', '233 pages migrated, visually verified against original'],
  ]),
  h3('Integrations Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['Analytics Setup (Adobe Analytics + AEP)', '2 weeks', 'digitalData layer, Launch integration, event tracking'],
    ['Search POC (Lucidworks)', '2 weeks', 'Searchbar integration proof-of-concept on EDS'],
    ['Auth Architecture Planning', '1 week', 'SSO flow design for identity.thermofisher.com on EDS'],
    ['Cookie Consent (TrustArc)', '1 week', 'TrustArc script integration and consent flow'],
  ]),
  bold('Phase 1 Exit Criteria:'),
  bullet('233 HIGH-traffic pages live on EDS preview environment'),
  bullet('Design system fully implemented with visual parity'),
  bullet('15 core blocks functional and responsive'),
  bullet('Analytics and consent tracking operational'),
  pageBreak(),

  // PHASE 2 DETAIL
  h2('12.3 Phase 2: Build & Migrate (Months 4-7)'),
  p('Complete all block development, migrate MEDIUM-traffic pages (4,116 pages), and implement all integrations.'),
  new Paragraph({ spacing: { after: 100 } }),
  h3('AEM Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['Bulk Import Pipeline Execution', '4 weeks', '~3,200 auto-migratable MEDIUM pages imported'],
    ['Manual Migration (Complex Pages)', '4 weeks', '~916 MEDIUM pages requiring manual content work'],
    ['Content Validation & QA', '3 weeks', 'Visual regression testing against original for all MEDIUM pages'],
    ['Asset Migration', '2 weeks', 'All images and media for MEDIUM pages transferred'],
    ['Redirect Mapping', '1 week', 'URL mapping document for all migrated pages'],
  ]),
  h3('EDS Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['Remaining Blocks (33)', '6 weeks', 'All 48 blocks complete: interactive, commerce, third-party widgets'],
    ['Product Carousel Block', '2 weeks', 'Carousel with pricing, add-to-cart, Target API integration'],
    ['Template Refinement', '2 weeks', 'All 16 templates polished for content author experience'],
    ['Visual QA & Responsive Testing', '3 weeks', 'Cross-browser, cross-device validation for all blocks'],
    ['Accessibility Audit', '1 week', 'WCAG 2.1 AA compliance for all blocks and pages'],
  ]),
  h3('Integrations Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['Adobe Target / DM Offers', '3 weeks', 'Personalization engine on EDS with pre-hiding, offer injection'],
    ['Cart Integration', '2 weeks', 'Cart drawer sidebar, add-to-cart, mini-cart API on EDS pages'],
    ['Lucidworks Search (Full)', '2 weeks', 'Complete searchbar with typeahead, signals, provider selector'],
    ['Chat Widget (Custom + Magellan)', '2 weeks', 'Chat launcher, eligibility API, GenAI feature flag'],
    ['UserWay Accessibility', '1 week', 'Accessibility overlay widget integration'],
    ['Medallia Feedback', '1 week', 'Kampyle SDK integration, floating feedback button'],
    ['WordPress Blog Feed', '1 week', 'API integration for homepage blog section'],
  ]),
  bold('Phase 2 Exit Criteria:'),
  bullet('4,349 pages (HIGH + MEDIUM) live on EDS preview'),
  bullet('All 48 blocks complete and tested'),
  bullet('All 23 integrations functional'),
  bullet('Visual regression pass rate > 95%'),
  pageBreak(),

  // PHASE 3 DETAIL
  h2('12.4 Phase 3: Scale & Launch (Months 8-9)'),
  p('Migrate all remaining LOW-traffic pages (7,812 pages), performance tuning, SEO validation, and production launch.'),
  new Paragraph({ spacing: { after: 100 } }),
  h3('AEM Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['Bulk Import: Remaining LOW Pages', '3 weeks', '~6,300 auto-migratable LOW pages imported'],
    ['Manual Migration: Complex LOW Pages', '2 weeks', '~1,512 LOW pages requiring manual work'],
    ['Content Freeze & Final Validation', '1 week', 'No new AEM content changes; final content verification'],
    ['Redirect Implementation', '1 week', 'All 12,161 redirects configured and tested'],
  ]),
  h3('EDS Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['Performance Optimization', '2 weeks', 'LCP < 2.5s, CLS < 0.1, FID < 100ms on all templates'],
    ['SEO Validation', '1 week', 'Meta tags, structured data, sitemap, canonical URLs verified'],
    ['Lighthouse Score Target: 100', '1 week', 'PageSpeed Insights validation on all template types'],
    ['Edge Worker Configuration', '1 week', 'Akamai/EDS edge rules for locale routing, caching, redirects'],
  ]),
  h3('Integrations Workstream'),
  createTable(['Activity', 'Duration', 'Deliverables'], [
    ['End-to-End Integration Testing', '2 weeks', 'Full test suite: analytics, search, cart, auth, chat, consent'],
    ['DNS Cutover Planning & Execution', '1 week', 'Phased DNS migration with rollback plan'],
    ['Production Monitoring Setup', '1 week', 'Error tracking, performance monitoring, uptime alerts'],
    ['Hypercare / Post-Launch Support', '2 weeks', 'Dedicated team for issue triage and hotfixes'],
  ]),
  bold('Phase 3 Exit Criteria:'),
  bullet('All 12,161 pages live on EDS production'),
  bullet('Lighthouse score >= 95 on all template types'),
  bullet('All redirects functional with zero 404 errors'),
  bullet('All integrations verified in production'),
  bullet('Hypercare team in place for 2-week post-launch'),
  pageBreak(),

  // 13. ASSUMPTIONS & BOUNDARY CONDITIONS
  h1('13. Assumptions & Boundary Conditions'),
  h2('13.1 Assumptions'),
  bullet('AEM AMS environment remains available for content extraction throughout the migration period'),
  bullet('Product catalog pages (/order/catalog/, /antibody/, /search/) remain on their current React SPA and are NOT migrated to EDS'),
  bullet('WordPress blog (acceleratingscience.com) remains on WordPress; only the API feed integration is migrated'),
  bullet('corporate.thermofisher.com (About Us) remains a separate AEM instance and is NOT in scope'),
  bullet('Identity service (identity.thermofisher.com) remains as-is; EDS integrates via redirect-based SSO'),
  bullet('Content authors will use AEM Universal Editor or Google Docs/Sheets for EDS content authoring'),
  bullet('Existing Akamai CDN configuration can be adapted for EDS edge delivery'),
  bullet('No new feature development during migration (feature freeze on CMS pages)'),
  bullet('Image assets can be referenced via existing CDN URLs (no re-hosting required initially)'),

  h2('13.2 Boundary Conditions (Scope Creep Risks)'),
  createTable(['Risk', 'Impact', 'Likelihood', 'Mitigation'], [
    ['Multi-locale rollout requested', 'High — 34 additional locales × 12K pages each', 'Medium', 'Scope US-only first; design for locale reuse from Day 1'],
    ['Product catalog pages added to scope', 'Very High — 393K+ React SPA pages', 'Low', 'Maintain clear boundary: /order/* stays on React SPA'],
    ['Custom eCommerce on EDS', 'High — cart/checkout rebuild', 'Low', 'Keep cart as shared JS widget; don\'t rebuild commerce'],
    ['New brand/design refresh during migration', 'High — rework all blocks and CSS', 'Medium', 'Freeze design system in Phase 1; absorb changes post-launch'],
    ['Legacy page discovery (unlisted pages)', 'Medium — additional manual migration', 'High', 'Buffer 15% in estimates for undiscovered content'],
    ['Third-party integration changes', 'Medium — API contract changes', 'Medium', 'Lock integration versions; defer upgrades to post-launch'],
    ['Performance targets increased', 'Medium — additional optimization', 'Low', 'Design for 100 Lighthouse from start; use EDS best practices'],
    ['Accessibility compliance upgrade (WCAG 2.2)', 'Medium — additional testing/remediation', 'Medium', 'Build to WCAG 2.1 AA; assess 2.2 delta post-launch'],
    ['Content authoring training delays', 'Low — author productivity impact', 'Medium', 'Start training in Phase 2; provide comprehensive documentation'],
    ['jQuery dependency in shared components', 'Medium — header/footer rely on jQuery', 'High', 'Rebuild header/footer as vanilla JS blocks; no jQuery in EDS'],
  ]),
  pageBreak(),

  // 14. RECOMMENDED TEAM
  h1('14. Recommended Team Composition'),
  createTable(['Role', 'Count', 'Phase Allocation', 'Key Responsibilities'], [
    ['Technical Architect / Lead', '1', 'P1-P3', 'Integration design, block architecture, EDS patterns, technical decisions'],
    ['Senior Frontend Developer', '2', 'P1-P3', 'Core block development, design system, responsive implementation'],
    ['Frontend Developer', '2-3', 'P1-P3', 'Block development, CSS/JS, template implementation'],
    ['Content Migration Engineer', '2', 'P1-P3', 'Import scripts, parsers, bulk migration tooling, content validation'],
    ['Integration Developer', '1-2', 'P1-P3', 'Adobe Target, Analytics, Cart API, Auth, Chat, Search integration'],
    ['QA Engineer', '1-2', 'P2-P3', 'Visual regression, accessibility, performance, cross-browser testing'],
    ['Content Author / Editor', '1-2', 'P2-P3', 'Manual content review, content validation, author training'],
    ['Project Manager', '1', 'P1-P3', 'Sprint planning, stakeholder communication, risk management'],
    ['TOTAL', '11-15', '—', '—'],
  ]),
);

// Build document
const doc = new Document({
  styles: {
    default: {
      heading1: { run: { font: 'Calibri', size: 36, bold: true, color: BRAND_RED } },
      heading2: { run: { font: 'Calibri', size: 30, bold: true, color: BRAND_DARK } },
      heading3: { run: { font: 'Calibri', size: 26, bold: true, color: '555555' } },
    }
  },
  sections: [{
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: 'TF US Migration Assessment | CONFIDENTIAL', size: 16, font: 'Calibri', color: '999999', italics: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Page ', size: 16, font: 'Calibri', color: '999999' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Calibri', color: '999999' }),
            new TextRun({ text: ' of ', size: 16, font: 'Calibri', color: '999999' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, font: 'Calibri', color: '999999' }),
          ]
        })]
      })
    },
    children: sections
  }]
});

// Generate and save
const buffer = await Packer.toBuffer(doc);
const outPath = '/workspace/TF-migration-assesment-us-only-15-mar-2026-v1.docx';
fs.writeFileSync(outPath, buffer);
console.log(`Report generated: ${outPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
