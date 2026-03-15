import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, ImageRun,
  PageBreak, ShadingType, TabStopPosition, TabStopType,
  TableOfContents, StyleLevel, Header, Footer, PageNumber
} from 'docx';
import fs from 'fs';

// Load screenshot images
const screenshots = {};
const screenshotFiles = [
  'tf-homepage.png', 'tf-category-l1.png', 'tf-category-l2.png',
  'tf-brand-page.png', 'tf-support.png'
];
for (const f of screenshotFiles) {
  const path = `/tmp/playwright/${f}`;
  if (fs.existsSync(path)) {
    screenshots[f] = fs.readFileSync(path);
  }
}

// Helper functions
const BRAND_RED = '9F1D20';
const BRAND_DARK = '333333';
const HEADER_BG = 'F2F2F2';
const LIGHT_BG = 'FAFAFA';

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 300, after: 150 } });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, size: 22, font: 'Calibri', ...opts })]
  });
}

function boldPara(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, bold: true, size: 22, font: 'Calibri' })]
  });
}

function bulletPoint(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Calibri' })]
  });
}

function createHeaderCell(text) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color: BRAND_RED },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, size: 20, font: 'Calibri', color: 'FFFFFF' })]
    })],
    verticalAlign: 'center',
  });
}

function createCell(text, opts = {}) {
  return new TableCell({
    shading: opts.shading ? { type: ShadingType.SOLID, color: opts.shading } : undefined,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text: text || '', size: 20, font: 'Calibri', bold: opts.bold || false, color: opts.color })]
    })],
    verticalAlign: 'center',
  });
}

function createTable(headers, rows, colWidths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(h => createHeaderCell(h)),
      }),
      ...rows.map((row, idx) => new TableRow({
        children: row.map((cell, ci) => createCell(cell, { shading: idx % 2 === 1 ? LIGHT_BG : undefined })),
      }))
    ],
  });
}

function addScreenshot(imageBuffer, width = 500, height = 350) {
  if (!imageBuffer) return [];
  return [
    new Paragraph({
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({
        data: imageBuffer,
        transformation: { width, height },
        type: 'png',
      })]
    })
  ];
}

// ========================================================================
// BUILD THE DOCUMENT
// ========================================================================

const children = [];

// --- COVER PAGE ---
children.push(
  new Paragraph({ spacing: { before: 2000 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: 'Thermo Fisher Scientific', size: 56, bold: true, font: 'Calibri', color: BRAND_RED })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: 'www.thermofisher.com', size: 32, font: 'Calibri', color: BRAND_DARK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: 'AEM AMS → Edge Delivery Services', size: 36, bold: true, font: 'Calibri', color: BRAND_DARK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text: 'Site Assessment & Migration Analysis Report', size: 44, bold: true, font: 'Calibri', color: BRAND_RED })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 },
    children: [new TextRun({ text: `Prepared: March 15, 2026`, size: 24, font: 'Calibri', color: '666666' })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'CONFIDENTIAL', size: 28, bold: true, font: 'Calibri', color: BRAND_RED })]
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// --- TABLE OF CONTENTS ---
children.push(
  heading('Table of Contents', HeadingLevel.HEADING_1),
  para('1. Executive Summary'),
  para('2. Current Technology Stack'),
  para('3. Integrations Analysis'),
  para('4. Page & Asset Inventory'),
  para('5. Templates Inventory'),
  para('6. Blocks / Components Catalog'),
  para('7. Page Counts by Template'),
  para('8. Web Forms Analysis'),
  para('9. Complex Use Cases & Observations'),
  para('10. Analysis Summary'),
  para('11. Migration Estimates'),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 1: EXECUTIVE SUMMARY
// =====================================================================
children.push(
  heading('1. Executive Summary', HeadingLevel.HEADING_1),
  para('Thermo Fisher Scientific (thermofisher.com) is one of the world\'s largest scientific services companies, with a complex web presence built on Adobe Experience Manager (AEM) Managed Services (AMS). This report provides a comprehensive analysis of the site for migration to Adobe Edge Delivery Services (EDS).'),
  para(''),
  boldPara('Key Findings:'),
  bulletPoint('Total estimated URLs across all sitemaps: ~138,300+'),
  bulletPoint('EDS migration scope (CMS content pages): ~31,200 pages across 39 locales'),
  bulletPoint('Multiple technology stacks: AEM CMS, React SPA (commerce), WordPress (blog)'),
  bulletPoint('23 third-party integrations identified'),
  bulletPoint('35 unique blocks/components cataloged with 15+ design variations'),
  bulletPoint('11 distinct page templates identified'),
  bulletPoint('9 web form types across the site'),
  bulletPoint('Estimated migration effort: 532-821 person-days (~6-9 months)'),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 2: CURRENT TECH STACK
// =====================================================================
children.push(
  heading('2. Current Technology Stack', HeadingLevel.HEADING_1),
  para('The following table outlines the complete technology stack currently powering thermofisher.com:'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(
    ['Layer', 'Technology', 'Details'],
    [
      ['CMS', 'Adobe Experience Manager (AEM AMS)', 'AEM 6.5+, release/2025.9.0 - ETO'],
      ['Frontend (CMS)', 'Vanilla JavaScript + jQuery Migrate 3.4.1', 'No framework; custom Design System'],
      ['Frontend (Commerce)', 'React + Redux', 'SPAs at /store/, /order/, /search/'],
      ['Frontend (Blog)', 'WordPress + jQuery', 'Genesis theme "accelerating-science"'],
      ['CSS', 'Custom Design System + BEM', 'HelveticaNeue font stack, CSS custom properties'],
      ['CDN', 'Akamai', 'Edge caching, TLS termination'],
      ['Cloud', 'AWS (S3, ELB, Kubernetes)', 'Microservices orchestration'],
      ['API Gateway', 'Apache APISIX (NGINX)', 'Request routing, rate limiting'],
      ['Analytics', 'Adobe Experience Platform Web SDK (Alloy) v2.30.1', 'Loaded via Adobe Launch'],
      ['Tag Management', 'Adobe Launch (2 properties)', 'Build date: 2026-03-10'],
      ['Personalization', 'Adobe Target (via Alloy)', 'Server-side + client-side targeting'],
      ['Identity', 'Custom OIDC + SAP Gigya', 'identity.thermofisher.com'],
      ['Commerce', 'Custom .NET + K8s microservices', 'commerce.thermofisher.com'],
      ['Search', 'Custom SearchBar v2023 + Lucidworks Solr', 'React SPA at /search/results'],
      ['Consent', 'TrustArc', 'consent.truste.com'],
      ['Responsive Breakpoints', '361px / 577px / 768px / 993px / 1201px / 1441px', '6 breakpoint system'],
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 3: INTEGRATIONS
// =====================================================================
children.push(
  heading('3. Integrations Analysis', HeadingLevel.HEADING_1),
  para('The following third-party integrations and embedded services have been identified across the site:'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(
    ['#', 'Integration', 'Type', 'Complexity', 'Where Used'],
    [
      ['1', 'Adobe Experience Platform Web SDK', 'API/SDK', 'High', 'All pages'],
      ['2', 'Adobe Launch (Tag Management)', 'Embed', 'Medium', 'All pages (2 properties)'],
      ['3', 'Adobe Target', 'API/SDK', 'High', 'All pages - personalization, A/B testing'],
      ['4', 'Adobe Audience Manager', 'API', 'Medium', 'All pages - audience segmentation'],
      ['5', 'Akamai CDN', 'Infrastructure', 'Medium', 'All pages - edge caching'],
      ['6', 'AWS S3', 'API/Storage', 'Low', 'Static asset delivery'],
      ['7', 'AWS ELB / Kubernetes', 'Infrastructure', 'High', 'Commerce microservices'],
      ['8', 'SAP Gigya (Customer Data Cloud)', 'API/OAuth', 'High', 'Sign-in, registration'],
      ['9', 'TrustArc', 'Embed/SDK', 'Medium', 'All pages - GDPR/CCPA consent'],
      ['10', 'Medallia / Kampyle', 'Embed/SDK', 'Low', 'All pages - feedback overlay'],
      ['11', 'Google reCAPTCHA v3', 'API', 'Low', 'Password reset form'],
      ['12', 'Genesys Cloud Chat', 'Embed/API', 'High', 'Category/product pages - AI chat'],
      ['13', 'Custom Commerce API', 'Custom API', 'High', 'Cart, pricing, recommendations'],
      ['14', 'Product Recommendations Engine', 'Custom API', 'High', 'Cart sidebar, product pages'],
      ['15', 'Lucidworks Fusion / Solr', 'API', 'High', 'Search, autocomplete, typeahead'],
      ['16', 'Custom OIDC Identity Provider', 'Custom API', 'High', 'Authentication flow, JWT tokens'],
      ['17', 'Endeca (Search Focus Areas)', 'API', 'Medium', 'Faceted navigation'],
      ['18', 'WordPress (Blog CMS)', 'Separate CMS', 'Medium', '/blog/ - Accelerating Science'],
      ['19', 'Magellan GenAI', 'Custom API', 'High', 'AI product Q&A (feature-flagged)'],
      ['20', 'MasterControl', 'External Link', 'Low', 'Privacy policy document hosting'],
      ['21', 'UserWay', 'Embed', 'Low', 'Accessibility overlay widget'],
      ['22', 'Custom Digital Data Layer', 'Custom Code', 'Medium', 'All pages - analytics data layer'],
      ['23', 'DM Preload Offers System', 'Custom Code', 'High', 'All pages - dynamic offer injection'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),
  boldPara('Integration Complexity Summary:'),
  createTable(
    ['Complexity', 'Count', 'Examples'],
    [
      ['High', '12', 'Adobe Target, Gigya Auth, Commerce API, Genesys Chat, Search'],
      ['Medium', '6', 'Adobe Launch, Audience Manager, TrustArc, Endeca, Digital Data Layer'],
      ['Low', '5', 'reCAPTCHA, Medallia, AWS S3, MasterControl, UserWay'],
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 4: PAGE & ASSET INVENTORY
// =====================================================================
children.push(
  heading('4. Page & Asset Inventory', HeadingLevel.HEADING_1),
  para('Page counts were derived from analysis of 11 sitemap hierarchies declared in robots.txt:'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(
    ['Category', 'Technology', 'Estimated URLs', 'In EDS Scope?'],
    [
      ['Regional CMS Content (39 sitemaps)', 'AEM CMS', '~31,200', 'Yes - Primary'],
      ['Store Product Catalog (239 sitemaps)', 'React SPA', '~47,800', 'No - Separate SPA'],
      ['Product FAQs (17 sitemaps)', 'React SPA', '~17,000', 'No - Separate SPA'],
      ['Product Citations (13 sitemaps)', 'React SPA', '~13,000', 'No - Separate SPA'],
      ['Antibody Products (16 sitemaps)', 'Custom App', '~14,750', 'No - Separate App'],
      ['Allergy Microsite (18 sitemaps)', 'AEM CMS', '~3,600', 'Phase 2'],
      ['Clinical Mass Spec (17 sitemaps)', 'AEM CMS', '~1,275', 'Phase 2'],
      ['One Lambda (1 sitemap)', 'AEM CMS', '~641', 'Phase 2'],
      ['Binding Site (12 sitemaps)', 'AEM CMS', '~960', 'Phase 2'],
      ['CAS Number Pages (6 sitemaps)', 'Custom App', '~570', 'No - Separate App'],
      ['Blog', 'WordPress', '~1,000-3,000', 'No - Separate CMS'],
      ['Antibody Video Sitemap', 'Mixed', '~7,500', 'No - Video index'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),
  boldPara('Total Estimated URLs: ~138,300+'),
  boldPara('Phase 1 EDS Migration Scope: ~31,200 CMS content pages'),
  boldPara('Phase 2 EDS Migration Scope: ~6,476 microsite pages'),
  new Paragraph({ spacing: { after: 200 } }),
  heading('Estimated Digital Assets', HeadingLevel.HEADING_2),
  createTable(
    ['Asset Type', 'Estimated Count', 'Notes'],
    [
      ['Product Images', '~500,000+', 'Managed by PIM/DAM system; referenced via CDN'],
      ['Marketing/Content Images', '~50,000-100,000', 'AEM DAM - hero banners, category images, icons'],
      ['PDF Documents', '~10,000-25,000', 'SDS, CoA, protocols, datasheets, manuals'],
      ['Video Assets', '~7,500+', 'Hosted via video sitemap; YouTube/Vimeo embeds'],
      ['SVG Icons', '~200-500', 'UI icons, brand logos, navigation elements'],
      ['Font Files', '~20-30', 'HelveticaNeue variants (WOFF2)'],
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 5: TEMPLATES INVENTORY
// =====================================================================
children.push(
  heading('5. Templates Inventory', HeadingLevel.HEADING_1),
  para('The following unique page templates have been identified across the site:'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(
    ['#', 'Template Name', 'Complexity', 'Reasoning', 'Reference URL(s)'],
    [
      ['1', 'Homepage', 'High', 'Heavy personalization (Adobe Target), dynamic carousels, multiple API integrations, hero with dynamic content', 'thermofisher.com/us/en/home.html'],
      ['2', 'L1 Category Page', 'Medium', 'Multi-column category card grid, quick links, breadcrumbs, standard component layout', 'thermofisher.com/us/en/home/life-science.html'],
      ['3', 'L2+ Category / Subcategory', 'Medium', 'Icon cards, value props, image+link layouts, deeper hierarchy', 'thermofisher.com/us/en/home/life-science/antibodies.html'],
      ['4', 'Brand Page', 'Medium', 'Sidebar nav, anchor jump nav, multi-section link lists, resources section', 'thermofisher.com/us/en/home/brands/thermo-scientific.html'],
      ['5', 'Product Detail Page (PDP)', 'High', 'React SPA, Redux state, real-time pricing, stock, citations, AI Q&A', 'thermofisher.com/order/catalog/product/44-2ML'],
      ['6', 'Antibody Product Page', 'High', 'Separate custom app, specialized search, antibody data model', 'thermofisher.com/antibody/product/CD4-Antibody-...'],
      ['7', 'Learning Center Hub', 'Medium', 'Educational modules, tutorial navigation, persistent learning menu', 'thermofisher.com/us/en/home/technical-resources/learning-centers.html'],
      ['8', 'Support Hub', 'Medium', 'TOC navigation, expandable sections, multi-column link directory', 'thermofisher.com/us/en/home/support.html'],
      ['9', 'Events / Webinars', 'Medium', 'Dynamic JS rendering, event registration, filters', 'thermofisher.com/us/en/home/events.html'],
      ['10', 'Promotions', 'Medium', 'Adobe Target personalization, dynamic offer cards, geo-filtering', 'thermofisher.com/us/en/home/products-and-services/promotions.html'],
      ['11', 'Contact / Forms', 'Medium', 'React-based rendering, multi-step forms, validation', 'thermofisher.com/us/en/home/technical-resources/contact-us.html'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),
  heading('Template Screenshots', HeadingLevel.HEADING_2),
  boldPara('Homepage Template'),
  ...addScreenshot(screenshots['tf-homepage.png'], 450, 600),
  boldPara('L1 Category Template (Life Sciences)'),
  ...addScreenshot(screenshots['tf-category-l1.png'], 450, 600),
  new Paragraph({ children: [new PageBreak()] }),
  boldPara('L2 Category Template (Antibodies)'),
  ...addScreenshot(screenshots['tf-category-l2.png'], 450, 600),
  boldPara('Brand Page Template (Thermo Scientific)'),
  ...addScreenshot(screenshots['tf-brand-page.png'], 450, 600),
  new Paragraph({ children: [new PageBreak()] }),
  boldPara('Support Hub Template'),
  ...addScreenshot(screenshots['tf-support.png'], 450, 500),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 6: BLOCKS/COMPONENTS CATALOG
// =====================================================================
children.push(
  heading('6. Blocks / Components Catalog', HeadingLevel.HEADING_1),
  para('All reusable blocks and components identified across the site. Design variations of the same content model are grouped under a single block rather than listed as separate blocks.'),
  new Paragraph({ spacing: { after: 100 } }),

  heading('6.1 Global Components', HeadingLevel.HEADING_2),
  createTable(
    ['#', 'Block Name', 'Complexity', 'Description', 'Variations', 'Reference URL'],
    [
      ['1', 'Header / Mega Navigation', 'High', 'Fixed header with multi-level mega-nav, search, account, cart, notifications, responsive drawer', 'Desktop mega-nav / Mobile drawer', 'All pages'],
      ['2', 'Search Bar + Typeahead', 'High', 'Autocomplete with category provider selector, recent searches, signals tracking', 'Context-aware scope per page', 'All pages'],
      ['3', 'Shopping Cart Sidebar', 'High', 'Right-sliding drawer with real-time cart, OOB recommendations API, pricing, quantity adjustment', 'Empty / Populated states', 'All pages'],
      ['4', 'Footer (6-column)', 'Low', 'Multi-column link groups, legal bar, copyright, country selector with flag', 'None', 'All pages'],
      ['5', 'Cookie Consent Banner', 'Medium', 'TrustArc GDPR/CCPA consent with preference management modal', 'None', 'All pages'],
      ['6', 'Messaging Bar', 'Low', 'Sticky top promotional banner, dismissible, campaign-specific content', 'Content varies by campaign', 'All pages'],
      ['7', 'Account Dropdown', 'Medium', 'Auth state-aware dropdown (guest sign-in vs. logged-in user details)', '2 states (guest / auth)', 'All pages'],
      ['8', 'Notification Bell', 'Medium', 'Order update notifications, badge count, delete/clear actions', 'Empty / Populated', 'All pages'],
      ['9', 'Chat Widget (Genesys)', 'High', 'AI-powered chat with eligibility API, async chunk-based loading', 'None (eligibility-gated)', 'Category/product pages'],
      ['10', 'Feedback Tab', 'Low', 'Fixed "Give Feedback" tab triggering Medallia/Kampyle overlay', 'None', 'All pages'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),

  heading('6.2 Hero & Banner Components', HeadingLevel.HEADING_2),
  createTable(
    ['#', 'Block Name', 'Complexity', 'Description', 'Variations', 'Reference URL'],
    [
      ['11', 'Hero Banner / Teaser', 'Medium', 'Full-width hero with bg image, headline, body, CTA. Supports Adobe Target personalization', 'Static / Dynamic (personalized)', 'Homepage'],
      ['12', 'Promotional Tile Strip (3-up)', 'Low', 'Row of 3 small promotional tiles with icon, short copy, CTA link', 'None', 'Homepage'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),

  heading('6.3 Navigation Components', HeadingLevel.HEADING_2),
  createTable(
    ['#', 'Block Name', 'Complexity', 'Description', 'Variations', 'Reference URL'],
    [
      ['13', 'Breadcrumbs', 'Low', 'Hierarchical path nav with ">" separator, last item plain text', 'Depth varies by page level', 'All non-homepage pages'],
      ['14', 'Sidebar Navigation', 'Low', 'Left-column categorized link lists (Popular products, Key apps, Resources)', 'Content varies by brand', 'Brand pages'],
      ['15', 'Anchor / Jump Navigation', 'Low', 'Horizontal in-page hash anchors with "Top" back-links', 'Items vary by content', 'Brand pages'],
      ['16', 'Quick Links Row', 'Low', 'Horizontal row of popular product links', 'Content varies per category', 'L1 Category pages'],
      ['17', 'Table of Contents (Collapsible)', 'Medium', 'Expandable section navigator for support/reference content', 'None', 'Support pages'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),

  heading('6.4 Content Components', HeadingLevel.HEADING_2),
  createTable(
    ['#', 'Block Name', 'Complexity', 'Description', 'Variations', 'Reference URL'],
    [
      ['18', 'Category Card Grid', 'Low', 'Grid of heading+description cards for subcategories (4-column responsive)', 'None', 'L1 Category pages'],
      ['19', 'Icon Link Cards (4-up)', 'Low', 'Row of 4 icon+label navigation cards for sub-categories', 'None', 'L2 Category pages'],
      ['20', 'Value Proposition Cards (3-up)', 'Low', 'Feature cards with icon/number, heading, description, CTA', 'None', 'L2 Category pages'],
      ['21', 'Image + Link List (Split)', 'Low', 'Large image with adjacent application link columns', 'Image left / Image right', 'L2 Category pages'],
      ['22', 'Link Grid (3-col with icons)', 'Low', 'Three-column icon+text link grid for research areas', 'None', 'L2 Category pages'],
      ['23', 'Resource Card Row', 'Low', 'Cards with thumbnail, title, description, CTA. Horizontal or vertical layout', 'Horizontal / Vertical', 'Multiple pages'],
      ['24', 'Text Block (Rich Text)', 'Low', 'Standard heading + paragraph content with inline links', 'Various heading levels', 'All pages'],
      ['25', 'Section Divider', 'Low', 'Styled horizontal rule between content sections', 'None', 'Multiple pages'],
      ['26', 'Categorized Link Lists (2-col)', 'Low', 'Two-column bulleted link sections under heading', 'None', 'Brand pages'],
      ['27', 'Resource Section + Thumbnails', 'Low', 'Boxed section with 3 resource cards (70x70 thumbnail) + link list', 'None', 'Brand pages'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),

  heading('6.5 E-Commerce Components', HeadingLevel.HEADING_2),
  createTable(
    ['#', 'Block Name', 'Complexity', 'Description', 'Variations', 'Reference URL'],
    [
      ['28', 'Online Offers Grid (4-up)', 'Medium', 'Product cards with pricing, discount badge, add-to-cart, pagination', 'None', 'Homepage'],
      ['29', 'Promotion Card Grid (2x2)', 'Low', 'Promo cards with image, discount badge overlay, CTA', 'Badge style varies', 'Homepage, Support'],
      ['30', 'New Products Row (3-up)', 'Low', 'Product feature cards with image, title, description, CTA', 'None', 'Homepage'],
      ['31', 'Suggested Products (Cross-sell)', 'Medium', 'API-driven recommendation strip in cart sidebar', 'None', 'All pages (in cart)'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),

  heading('6.6 Interactive & Utility Components', HeadingLevel.HEADING_2),
  createTable(
    ['#', 'Block Name', 'Complexity', 'Description', 'Variations', 'Reference URL'],
    [
      ['32', 'CTA Button', 'Low', 'Multi-variant button/link: primary(red), secondary, outline, info, white, text-link', '6+ visual variants, 4 sizes', 'All pages'],
      ['33', 'Blog Post Cards (3-up)', 'Low', 'Blog cards with thumbnail, title, date, "Read more" CTA', 'None', 'Homepage'],
      ['34', 'Featured Education Section', 'Medium', 'Mixed content tiles - interactive tool cards + simple text cards', 'Mixed content types', 'Homepage'],
      ['35', 'Preload Offers Engine', 'High', 'Adobe Target dynamic content injection framework with fallback handling', 'Default / Personalized', 'All pages'],
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 7: PAGE COUNTS BY TEMPLATE
// =====================================================================
children.push(
  heading('7. Page Counts by Template', HeadingLevel.HEADING_1),
  createTable(
    ['#', 'Template', 'Est. Pages', 'Auto-Migrate', 'Manual Migrate', 'Notes'],
    [
      ['1', 'Homepage', '~38', 'No', 'Yes (100%)', '1 per locale, heavy personalization'],
      ['2', 'L1 Category Pages', '~800-1,200', 'Partial (70%)', 'Partial (30%)', 'Standard layout; dynamic offers manual'],
      ['3', 'L2+ Category / Subcategory', '~15,000-25,000', 'Yes (90%)', '~10% manual', 'US-EN industrial alone = 1,031 URLs'],
      ['4', 'Brand Pages', '~300-450', 'Yes (85%)', '~15% manual', '~12 brands x 39 locales'],
      ['5', 'Product Detail (React SPA)', '~47,800', 'Out of Scope', 'Out of Scope', 'Separate React application'],
      ['6', 'Antibody Product Pages', '~14,750', 'Out of Scope', 'Out of Scope', 'Separate custom application'],
      ['7', 'Learning Center Hubs', '~100-200', 'Partial (50%)', 'Yes (50%)', 'Educational content modules'],
      ['8', 'Support Hub', '~50-100', 'No', 'Yes (100%)', 'Dynamic expandable content'],
      ['9', 'Events / Webinars', '~50-100', 'No', 'Yes (100%)', 'JS-heavy dynamic rendering'],
      ['10', 'Promotions', '~50-100', 'No', 'Yes (100%)', 'Adobe Target personalization'],
      ['11', 'Contact / Forms', '~100-200', 'No', 'Yes (100%)', 'React-based forms'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),
  boldPara('Migration Scope Summary:'),
  createTable(
    ['Category', 'Pages', 'Strategy'],
    [
      ['Automatically Migratable', '~18,000-28,000', 'Standard templates, batch processing'],
      ['Manual Migration Required', '~4,000-7,000', 'Dynamic, personalized, custom logic'],
      ['Out of Scope (Separate Apps)', '~97,000+', 'React SPA, WordPress, custom apps'],
      ['Phase 1 Total', '~31,200', 'CMS content pages across 39 locales'],
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 8: WEB FORMS
// =====================================================================
children.push(
  heading('8. Web Forms Analysis', HeadingLevel.HEADING_1),
  para('Analysis of all pages capturing user input via form controls:'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(
    ['#', 'Form Name', 'Location', 'Complexity', 'Reasoning'],
    [
      ['1', 'Quick Order (Multi-Mode)', '/store/v2/quick-order', 'High', '3 input modes (manual/bulk/paste), dynamic autocomplete, conditional fields, dynamic rows, cart API'],
      ['2', 'Return / Report Issue', '/store/order/report/issues', 'High', '15+ fields, 5 sections, cascading dropdowns, drag-drop file upload, conditional validation'],
      ['3', 'Sign-In (Multi-Step Auth)', 'identity.thermofisher.com/signin', 'Medium', 'Multi-step OAuth/OIDC, Gigya integration, JWT tokens'],
      ['4', 'Account Registration', 'identity.thermofisher.com/registration', 'Medium', 'Gigya-managed, password strength meter, country selector, reCAPTCHA'],
      ['5', 'Contact Us Form', '/store/v2/contact-us', 'Medium', 'React SPA, multi-section layout, validation, file attachment'],
      ['6', 'Global Site Search', 'Header (all pages)', 'Medium', 'Advanced autocomplete, category filtering, signals capture'],
      ['7', 'Password Reset', 'identity.thermofisher.com/reset-password', 'Low', 'Single field + reCAPTCHA v3'],
      ['8', 'Feedback (Medallia)', 'Footer "Report a Site Issue"', 'Low', 'Third-party managed overlay (Kampyle SDK)'],
      ['9', 'Add to Cart / Quantity', 'Product detail pages', 'Low', 'Single numeric spinbutton + "Add to Cart" button'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),
  boldPara('Forms Complexity Summary:'),
  createTable(
    ['Complexity', 'Count', 'Forms'],
    [
      ['High', '2', 'Quick Order, Return/Report Issue'],
      ['Medium', '4', 'Sign-In, Registration, Contact Us, Site Search'],
      ['Low', '3', 'Password Reset, Feedback (Medallia), Add to Cart'],
    ]
  ),
  para(''),
  para('Note: Legacy standalone form URLs (/global/forms/inquiry.html, /global/forms/sample-request.html, /global/forms/quote-request.html, /global/forms/newsletter-signup.html) all return 404 — Thermo Fisher has consolidated forms into JavaScript-rendered experiences within the /store/v2/ framework.'),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 9: COMPLEX USE CASES
// =====================================================================
children.push(
  heading('9. Complex Use Cases & Observations', HeadingLevel.HEADING_1),
  para('The following complex behaviors require special attention during migration:'),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(
    ['#', 'Complex Use Case', 'Instances', 'Where Found', 'Why Complex'],
    [
      ['1', 'Adobe Target Personalization', '~31,200+ pages', 'Preload Offers system on every page', 'Dynamic content varies by user segment, geography, behavior. EDS lacks native server-side personalization at this scale.'],
      ['2', 'React SPA Commerce', '~78,000+ pages', '/order/, /store/, /search/', 'Separate React apps with Redux. NOT AEM pages — need independent architecture or continued SPA operation.'],
      ['3', 'Multi-Locale Content (39 locales)', '39 locale variants', 'All CMS pages', 'Content translation, country-specific pricing, regional compliance (GDPR vs CCPA). Robust locale management needed.'],
      ['4', 'Dynamic Cart Integration', 'All pages', 'Cart sidebar, OOB recommendations API', 'Real-time cart state synced across all pages via API. Requires client-side JS integration with custom commerce APIs.'],
      ['5', 'Custom Authentication (OIDC+Gigya)', 'All auth flows', 'identity.thermofisher.com', 'Custom identity provider with OIDC, JWT. Contracted pricing, order history depend on auth state.'],
      ['6', 'AI-Powered Features (Magellan)', 'Product/Search pages', 'Feature-flagged globally', 'Semantic search, AI product Q&A in testing. Rapidly evolving; may change during migration.'],
      ['7', 'Genesys Cloud Chat Bot', '~5,000+ pages', 'Category & product pages', 'AI chat with eligibility API. Async loading, chunk-based JS/CSS, and API integration.'],
      ['8', 'Dynamic Offer System', 'All pages', 'window.preloadOffers', 'Client-side Adobe Target content injection with timeout/fallback. Drives hero banners, offer bars, promotions.'],
      ['9', 'Sub-sites (Separate Templates)', '3 sub-sites', 'Allergy, One Lambda, Binding Site', 'Separate AEM content trees, independent nav/branding. Need separate EDS configs.'],
      ['10', 'E-commerce Pricing & Stock', 'Product pages', 'Pricing & stock APIs', 'Real-time pricing, inventory, contracted pricing, multi-currency. Critical for buyer experience.'],
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 10: ANALYSIS SUMMARY
// =====================================================================
children.push(
  heading('10. Analysis Summary', HeadingLevel.HEADING_1),
  new Paragraph({ spacing: { after: 100 } }),
  createTable(
    ['Category', 'Count', 'Low', 'Medium', 'High'],
    [
      ['Page Templates', '11', '0', '7', '4'],
      ['Blocks / Components', '35', '20', '9', '6'],
      ['Design Variations', '~15', '10', '4', '1'],
      ['Third-Party Integrations', '23', '5', '6', '12'],
      ['Web Forms', '9', '3', '4', '2'],
      ['Complex Use Cases', '10', '0', '3', '7'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),
  boldPara('Site Scale Overview:'),
  createTable(
    ['Metric', 'Value'],
    [
      ['Total Estimated URLs (all sitemaps)', '~138,300+'],
      ['CMS Content Pages (EDS Phase 1 Scope)', '~31,200'],
      ['Microsite Pages (EDS Phase 2 Scope)', '~6,476'],
      ['Product Catalog (React SPA - separate)', '~77,800'],
      ['Antibody Products (Custom app - separate)', '~14,750'],
      ['Blog (WordPress - separate)', '~1,000-3,000'],
      ['Locales', '39'],
      ['Estimated DAM Assets (images)', '~50,000-100,000'],
      ['Estimated PDF Documents', '~10,000-25,000'],
    ]
  ),
  new Paragraph({ children: [new PageBreak()] }),
);

// =====================================================================
// SECTION 11: MIGRATION ESTIMATES
// =====================================================================
children.push(
  heading('11. Migration Estimates', HeadingLevel.HEADING_1),
  heading('Scope Definition', HeadingLevel.HEADING_2),
  para('The EDS migration scope covers AEM CMS content pages only (~31,200 pages in Phase 1). React commerce SPA, WordPress blog, and antibody application remain as separate systems operating independently.'),
  new Paragraph({ spacing: { after: 200 } }),

  heading('Effort Breakdown by Phase', HeadingLevel.HEADING_2),
  createTable(
    ['Phase', 'Activity', 'Person-Days (Range)', 'Calendar Duration'],
    [
      ['Phase 1', 'Foundation & Setup', '', ''],
      ['', '  EDS project setup, CI/CD, environments', '5-10', '1 week'],
      ['', '  Design system extraction & CSS custom properties', '15-20', '2 weeks'],
      ['', '  Global header / mega-navigation', '15-25', '2-3 weeks'],
      ['', '  Global footer', '3-5', '1 week'],
      ['', '  Cookie consent (TrustArc) integration', '3-5', '1 week'],
      ['', 'Phase 1 Subtotal', '41-65', '3-4 weeks'],
      ['Phase 2', 'Block Development', '', ''],
      ['', '  Low-complexity blocks (20 blocks × 2-3 days)', '40-60', ''],
      ['', '  Medium-complexity blocks (9 blocks × 5-8 days)', '45-72', ''],
      ['', '  High-complexity blocks (6 blocks × 10-15 days)', '60-90', ''],
      ['', '  Design variations (15 variants × 1-1.5 days)', '15-22', ''],
      ['', 'Phase 2 Subtotal', '160-244', '8-12 weeks'],
      ['Phase 3', 'Template Implementation', '', ''],
      ['', '  Homepage template', '10-15', ''],
      ['', '  Category templates (L1 + L2)', '10-15', ''],
      ['', '  Brand page template', '5-8', ''],
      ['', '  Learning center, Support, Events, Promos', '15-23', ''],
      ['', '  Contact/Forms template', '5-8', ''],
      ['', 'Phase 3 Subtotal', '48-74', '3-5 weeks'],
      ['Phase 4', 'Integrations', '', ''],
      ['', '  Adobe Analytics / Launch integration', '10-15', ''],
      ['', '  Adobe Target / personalization', '15-25', ''],
      ['', '  Commerce API integration (cart, pricing)', '15-20', ''],
      ['', '  Authentication (OIDC/Gigya)', '10-15', ''],
      ['', '  Search integration', '10-15', ''],
      ['', '  Chat, Medallia, UserWay, reCAPTCHA', '10-16', ''],
      ['', 'Phase 4 Subtotal', '70-106', '4-6 weeks'],
      ['Phase 5', 'Content Migration', '', ''],
      ['', '  Migration script development & testing', '15-20', ''],
      ['', '  Automated migration (~18,000-28,000 pages)', '20-30', ''],
      ['', '  Manual migration (~4,000-7,000 pages)', '40-70', ''],
      ['', '  Multi-locale content (39 locales)', '20-30', ''],
      ['', '  Asset migration (images, documents)', '10-15', ''],
      ['', 'Phase 5 Subtotal', '105-165', '5-8 weeks'],
      ['Phase 6', 'Forms Migration', '', ''],
      ['', '  Low-complexity forms (3)', '3-5', ''],
      ['', '  Medium-complexity forms (4)', '12-20', ''],
      ['', '  High-complexity forms (2)', '10-16', ''],
      ['', 'Phase 6 Subtotal', '25-41', '2-3 weeks'],
      ['Phase 7', 'QA & Testing', '', ''],
      ['', '  Visual regression testing', '15-25', ''],
      ['', '  Functional testing', '15-20', ''],
      ['', '  Performance testing (Lighthouse 100)', '10-15', ''],
      ['', '  Accessibility testing (WCAG 2.1 AA)', '10-15', ''],
      ['', '  UAT support', '10-15', ''],
      ['', 'Phase 7 Subtotal', '60-90', '4-6 weeks'],
      ['Phase 8', 'Deployment & Cutover', '', ''],
      ['', '  Staging environment & validation', '5-8', ''],
      ['', '  Redirect mapping (URL mapping)', '10-15', ''],
      ['', '  DNS / CDN cutover planning', '3-5', ''],
      ['', '  Go-live support & monitoring', '5-8', ''],
      ['', 'Phase 8 Subtotal', '23-36', '2-3 weeks'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),

  heading('Total Estimates Summary', HeadingLevel.HEADING_2),
  createTable(
    ['Category', 'Person-Days (Range)', 'Calendar Duration'],
    [
      ['Phase 1: Foundation & Setup', '41-65', '3-4 weeks'],
      ['Phase 2: Block Development', '160-244', '8-12 weeks'],
      ['Phase 3: Template Implementation', '48-74', '3-5 weeks'],
      ['Phase 4: Integrations', '70-106', '4-6 weeks'],
      ['Phase 5: Content Migration', '105-165', '5-8 weeks'],
      ['Phase 6: Forms Migration', '25-41', '2-3 weeks'],
      ['Phase 7: QA & Testing', '60-90', '4-6 weeks'],
      ['Phase 8: Deployment & Cutover', '23-36', '2-3 weeks'],
      ['TOTAL', '532-821 person-days', '~6-9 months (parallel phases)'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),

  heading('Recommended Team Composition', HeadingLevel.HEADING_2),
  createTable(
    ['Role', 'Count', 'Focus Area'],
    [
      ['Technical Lead / Architect', '1', 'Architecture, integration design, decisions'],
      ['Senior EDS Developer', '2-3', 'Block development, template implementation'],
      ['Frontend Developer', '2-3', 'CSS/design system, responsive, a11y'],
      ['Content Migration Engineer', '1-2', 'Import scripts, batch processing, validation'],
      ['QA Engineer', '1-2', 'Automated testing, visual regression, performance'],
      ['Integration Developer', '1', 'Adobe Target, analytics, commerce APIs, auth'],
    ]
  ),
  para('Recommended team size: 8-12 people'),
  new Paragraph({ spacing: { after: 200 } }),

  heading('Key Risks & Mitigations', HeadingLevel.HEADING_2),
  createTable(
    ['Risk', 'Impact', 'Mitigation'],
    [
      ['Personalization complexity (Adobe Target)', 'High', 'Plan edge-based personalization early; use EDS experimentation features'],
      ['Commerce SPA dependency', 'High', 'Keep React SPA separate; integrate via client-side JS'],
      ['39-locale content volume', 'High', 'Automate batch processing; prioritize top 5-10 locales for initial launch'],
      ['Custom identity system', 'Medium', 'Plan auth integration early; may require token relay proxy'],
      ['AI features rapidly evolving', 'Medium', 'Feature-flag based integration; expect changes during migration'],
      ['Blog (WordPress) separate CMS', 'Low', 'Maintain as-is or plan separate migration project'],
    ]
  ),
  new Paragraph({ spacing: { after: 200 } }),
  para('— End of Report —', { italics: true }),
);

// ========================================================================
// CREATE THE DOCUMENT
// ========================================================================
const doc = new Document({
  creator: 'Adobe EDS Migration Assessment',
  title: 'Thermo Fisher Scientific - AEM to EDS Migration Analysis Report',
  description: 'Comprehensive site assessment for migrating thermofisher.com from AEM AMS to Edge Delivery Services',
  styles: {
    default: {
      document: {
        run: { font: 'Calibri', size: 22 }
      },
      heading1: {
        run: { font: 'Calibri', size: 36, bold: true, color: BRAND_RED },
        paragraph: { spacing: { before: 400, after: 200 } }
      },
      heading2: {
        run: { font: 'Calibri', size: 28, bold: true, color: BRAND_DARK },
        paragraph: { spacing: { before: 300, after: 150 } }
      },
    }
  },
  sections: [{
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: 'Thermo Fisher Scientific — EDS Migration Assessment', size: 16, color: '999999', font: 'Calibri', italics: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Confidential — Page ', size: 16, color: '999999' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '999999' }),
          ]
        })]
      })
    },
    children
  }],
});

// Generate and save
const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('/workspace/ThermoFisher-EDS-Migration-Assessment.docx', buffer);
console.log('Report generated: /workspace/ThermoFisher-EDS-Migration-Assessment.docx');
console.log(`File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
