import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, BorderStyle, AlignmentType, ShadingType } from 'docx';
import { writeFileSync } from 'fs';

function createTable(data) {
  const rows = data.map((row, rowIndex) => {
    const cells = row.map(cell => {
      return new TableCell({
        children: [new Paragraph({
          children: [new TextRun({
            text: String(cell),
            bold: rowIndex === 0,
            size: 20,
            color: rowIndex === 0 ? "FFFFFF" : "000000",
          })]
        })],
        shading: rowIndex === 0 ? { type: ShadingType.SOLID, color: "232F3E", fill: "232F3E" } : undefined,
      });
    });
    return new TableRow({ children: cells });
  });
  return new Table({ rows, width: { size: 10000, type: WidthType.DXA } });
}

function heading1(text) {
  return new Paragraph({ spacing: { before: 500 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text, bold: true })] });
}
function heading2(text) {
  return new Paragraph({ spacing: { before: 300 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text, bold: true })] });
}
function para(text, opts = {}) {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text, ...opts })] });
}
function bullet(text) {
  return new Paragraph({ children: [new TextRun({ text: `  • ${text}` })] });
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
  sections: [{
    children: [
      // Title
      new Paragraph({ spacing: { before: 2000 }, children: [] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Amazon Alexa", bold: true, size: 56 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "EDS Migration Analysis Report", bold: true, size: 44 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: "Comprehensive Site Inventory & Edge Delivery Services Migration Scoping", size: 28, italics: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 800 }, children: [new TextRun({ text: "Date: May 4, 2026", size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Consumer: https://alexa.amazon.com", size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Developer: https://developer.amazon.com/en-US/alexa", size: 24 })] }),

      // Executive Summary
      heading1("Executive Summary"),
      para("The Amazon Alexa web presence spans three distinct domains: the consumer portal (alexa.amazon.com), the developer portal (developer.amazon.com/en-US/alexa), and Amazon.com product pages. The consumer portal is a lightweight marketing/sign-in gateway (~5-8 pages). The developer portal is a comprehensive developer documentation and community hub (~120+ pages). Amazon.com commerce pages are NOT viable for EDS migration."),
      para("Key Metrics:", { bold: true }),
      bullet("~120-144 total migratable pages"),
      bullet("38 unique UI blocks/components"),
      bullet("15 page templates"),
      bullet("18 third-party integrations"),
      bullet("16-24 forms"),
      bullet("~170-235 digital assets"),
      bullet("9+ language versions"),
      bullet("Estimated effort: 273 person-days (~20 weeks, 3-person team)"),
      bullet("Estimated cost: ~$455,000"),

      // Section 1: Tech Stack
      heading1("1. Current Technology Stack"),
      createTable([
        ["Layer", "Technology", "Evidence"],
        ["Platform (Consumer)", "Amazon proprietary (server-rendered)", "m.media-amazon.com CDN, fls-na tracking"],
        ["Platform (Developer)", "AWS-based CMS/Portal Framework", "CloudFront CDN (ds6yc8t7pnx74.cloudfront.net)"],
        ["Frontend", "Vanilla HTML/CSS/JS + proprietary framework", "No React/Vue/Angular detected"],
        ["CDN", "Amazon CloudFront", "CloudFront distribution domains"],
        ["Media", "Amazon Media Services", "m.media-amazon.com"],
        ["Video", "Embedded proprietary player", "Video carousel on consumer pages"],
        ["Search", "Custom CloudFront-indexed search", "Search data endpoint on CloudFront"],
        ["Forms", "Qualtrics (surveys/newsletter)", "Newsletter and feedback forms"],
        ["Auth", "Amazon SSO / OpenID", "signin gateway, OpenID parameters"],
        ["Analytics", "Amazon internal (fls-na pixel)", "Batch pixel processing"],
        ["i18n", "URL path-based + selector", "9+ languages"],
        ["Code Hosting", "GitHub", "github.com/alexa"],
        ["Learning", "Sana LMS (external)", "alexa.sana.ai"],
      ]),

      // Section 1.2: Pages by Theme
      heading2("1.1 Pages by Thematic Breakdown"),
      createTable([
        ["Theme/Section", "Pages (Est.)", "Type"],
        ["Consumer Landing (Alexa+)", "5-8", "Marketing"],
        ["Developer Hub/Homepage", "3-5", "Marketing/Portal"],
        ["Alexa Skills Kit", "15-20", "Product/Documentation"],
        ["Device Makers", "10-12", "Product/Documentation"],
        ["Solution Providers", "8-10", "Directory/Marketing"],
        ["Alexa AI / SDKs", "5-8", "Product/Technical"],
        ["Alexa Smart Properties", "8-10", "Vertical Marketing"],
        ["Programs (Startups/Fund/Prize)", "12-15", "Program/Community"],
        ["Branding Guidelines", "6-8", "Asset/Guidelines"],
        ["Training & Workshops", "5-8", "Educational"],
        ["Blog Hub/Categories", "8-10", "Content/Blog"],
        ["Champions/Community", "3-5", "Community"],
        ["Voice Interoperability", "3-5", "Technical/Standards"],
        ["Documentation Hubs", "10-12", "Documentation"],
        ["Legal/Support", "5-8", "Administrative"],
        ["TOTAL (Migratable)", "~108-144", ""],
      ]),

      heading2("1.2 Static vs Dynamic Data Design"),
      createTable([
        ["Category", "Pages", "%", "Description"],
        ["Static/Marketing", "75-85", "60%", "Product, landing, program, guidelines pages"],
        ["Semi-Dynamic", "25-35", "25%", "Blog, champions, partner directories"],
        ["Dynamic/Tool-Based", "15-20", "15%", "Console, search, training, forums"],
        ["TOTAL", "~120", "100%", ""],
      ]),

      heading2("1.3 Design System Analysis"),
      para("Developer Portal uses a consistent proprietary design system:"),
      bullet("Modular card-based layouts with consistent spacing"),
      bullet("Global navigation with multi-level dropdowns"),
      bullet("CloudFront-hosted static assets and shared icon library"),
      bullet("Consistent footer pattern (Resources, Support, Legal, Social, Language)"),
      bullet("Blue/dark (Amazon #232F3E) palette with orange accents"),
      bullet("Newsletter signup component ('Voice Mail') across pages"),
      para("Consumer Portal: Minimal design system with progressive disclosure, alternating layouts, and video carousel."),
      para("Gap: No formal documented web UI design system exists (only Alexa product branding guidelines)."),

      // Section 2: Templates
      heading1("2. Templates Inventory"),
      createTable([
        ["#", "Template Name", "Complexity", "Reasoning", "Example URL"],
        ["1", "Consumer Landing", "Medium", "Hero + feature grid + video carousel + auth", "alexa.amazon.com"],
        ["2", "Developer Portal Hub", "Medium", "Multi-level nav, hero, action cards, newsletter", "developer.amazon.com/en-US/alexa"],
        ["3", "Product/SKU Marketing", "Medium", "Hero, value props, case studies, testimonials", "developer.amazon.com/en-US/alexa/alexa-skills-kit"],
        ["4", "Technical Product Detail", "Medium", "Breadcrumb, diagram, features, changelog", ".../alexa-skills-kit/get-deeper/custom-skills"],
        ["5", "Vertical Marketing", "Medium", "Vertical cards, customer success carousel", ".../alexa-smart-properties"],
        ["6", "Program/Community", "Medium", "Vision, portfolio grid, news cards", ".../alexa-startups"],
        ["7", "Getting Started/Tutorial", "Medium", "Learning paths, course cards, video embeds", ".../alexa-skills-kit/start"],
        ["8", "Training Catalog", "Low", "Course cards with duration, launch buttons", ".../trainings_and_workshops"],
        ["9", "People/Champions", "Medium", "Geographic tabs, profile grid", ".../alexa/champions"],
        ["10", "Blog Hub", "Low", "Category cards, 4-column grid", ".../blogs/alexa"],
        ["11", "Brand Guidelines", "Medium", "Left sidebar, expandable sections", ".../branding/alexa-guidelines"],
        ["12", "Solution Provider Directory", "Medium", "Category overview, provider cards", ".../solution-providers"],
        ["13", "Feature Updates/Changelog", "Low", "Release types, locale table", ".../new/feature-updates"],
        ["14", "AI/SDK Showcase", "High", "Hero, SDK cards, video cases, testimonials", ".../alexa-ai"],
        ["15", "Standards/Initiative", "Medium", "Video hero, mission pillars, resources", ".../voice-interoperability"],
      ]),

      // Section 3: Blocks
      heading1("3. Blocks/Components Catalog"),
      heading2("3.1 Navigation & Layout"),
      createTable([
        ["#", "Block", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Ext"],
        ["1", "Global Dev Nav", "High", "Multi-level dropdown, 60+ links, lang selector", "Custom nav", "No", "No", "Medium"],
        ["2", "Consumer Nav", "Low", "Simple header with logo, sign-in", "Standard header", "No", "No", "No"],
        ["3", "Multi-Column Footer", "Medium", "5-section footer, social, language", "Footer variant", "No", "No", "No"],
        ["4", "Breadcrumb", "Low", "Hierarchical path navigation", "Standard EDS", "No", "No", "No"],
        ["5", "Left Sidebar Nav", "Medium", "Expandable sections, active states", "Custom block", "No", "No", "Low"],
      ]),

      heading2("3.2 Hero & Banner"),
      createTable([
        ["#", "Block", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Ext"],
        ["6", "Marketing Hero", "Medium", "Full-width headline + CTA + image", "Hero variant", "No", "No", "No"],
        ["7", "Consumer Hero", "Medium", "Headline + sign-in CTA, minimal", "Hero variant", "No", "No", "No"],
        ["8", "Video Hero", "Medium", "Hero with embedded video player", "Hero variant", "No", "No", "Low"],
        ["9", "Feature Announcement", "Low", "Highlighted news/feature banner", "Standard banner", "No", "No", "No"],
      ]),

      heading2("3.3 Card Components"),
      createTable([
        ["#", "Block", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Ext"],
        ["10", "Action Card (4-col)", "Medium", "Icon + title + desc + CTA grid", "Cards variant", "No", "No", "No"],
        ["11", "Feature Card (3-col)", "Low", "Icon + heading + text pillars", "Columns variant", "No", "No", "No"],
        ["12", "Course Card", "Low", "Title + duration + Launch CTA", "Cards variant", "No", "No", "No"],
        ["13", "Skill Type Card", "Medium", "9 category cards with learn-more", "Cards variant", "No", "No", "No"],
        ["14", "Case Study Card", "Medium", "Video + partner + description", "Cards variant", "No", "No", "Low"],
        ["15", "Partner Logo Grid", "Low", "12+ brand logos in grid", "Logo grid", "No", "No", "No"],
        ["16", "Profile Card", "Low", "Name + location + link", "Cards variant", "Possible", "No", "No"],
        ["17", "Blog Category Card", "Low", "Icon + title + desc + CTA", "Cards variant", "No", "No", "No"],
        ["18", "News/Press Card", "Low", "Headline + source + link", "Cards variant", "No", "No", "No"],
        ["19", "Vertical Industry Card", "Medium", "Image + vertical + desc + CTA", "Cards variant", "No", "No", "No"],
        ["20", "Resource Card", "Low", "Icon/image + title + link", "Cards variant", "No", "No", "No"],
      ]),

      heading2("3.4 Content & Educational"),
      createTable([
        ["#", "Block", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Ext"],
        ["21", "Value Proposition", "Low", "Heading + paragraph + CTA, alternating", "Columns", "No", "No", "No"],
        ["22", "Statistics/Social Proof", "Low", "Large numbers + context text", "Custom", "No", "No", "No"],
        ["23", "Executive Quote", "Low", "Photo + quote + attribution", "Quote block", "No", "No", "No"],
        ["24", "Step-by-Step Process", "Low", "Numbered progressive steps", "Steps variant", "No", "No", "No"],
        ["25", "Feature/Comparison Table", "Medium", "Multi-column with categories", "Table block", "No", "No", "No"],
        ["26", "Mission Pillars", "Low", "4-column icon + title + text", "Columns variant", "No", "No", "No"],
        ["27", "SDK Integration Block", "Medium", "SDK name + desc + technical CTA", "Custom", "No", "No", "No"],
      ]),

      heading2("3.5 Interactive Components"),
      createTable([
        ["#", "Block", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Ext"],
        ["28", "Video Carousel", "High", "4-slot rotating video with player", "Custom block", "No", "No", "Medium"],
        ["29", "Customer Success Carousel", "Medium", "Rotating case study cards", "Carousel block", "Possible", "No", "Low"],
        ["30", "Newsletter Signup", "Low", "Email + subscribe CTA", "Form block", "Yes-Qualtrics", "No", "No"],
        ["31", "Language Selector", "Low", "9+ language dropdown", "Custom nav", "No", "No", "No"],
        ["32", "Search", "High", "Full-text developer portal search", "Custom block", "Yes-search API", "Yes", "Medium"],
        ["33", "Geographic Tabs", "Medium", "Tab switching for regions", "Tabs block", "No", "No", "Low"],
        ["34", "Sign-In Button", "Medium", "Amazon SSO redirect + tracking", "Custom CTA", "Yes-Amazon auth", "No", "No"],
        ["35", "Social Media Links", "Low", "Platform icons + links", "Standard embed", "No", "No", "No"],
        ["36", "Callout/Alert Box", "Low", "Dismissible notification banner", "Banner block", "No", "No", "No"],
        ["37", "PDF/Resource Download", "Low", "Document link with type indicator", "Standard link", "No", "No", "No"],
        ["38", "Line Break/Divider", "Low", "Visual section separator", "Default content", "No", "No", "No"],
      ]),

      // Section 4: Page Counts
      heading1("4. Page Counts by Template"),
      createTable([
        ["Template", "Pages (Est.)", "Auto-Migratable", "Manual Migration", "Reasoning"],
        ["Consumer Landing", "5-8", "3-5", "2-3", "Video carousel + auth needs custom work"],
        ["Developer Portal Hub", "3-5", "2-3", "1-2", "Complex nav, search integration"],
        ["Product/SKU Marketing", "15-20", "12-15", "3-5", "Mostly static, some video cases"],
        ["Technical Product Detail", "10-12", "8-10", "2-3", "Diagrams, changelogs vary"],
        ["Vertical Marketing", "8-10", "6-8", "2-3", "Carousels may be dynamic"],
        ["Program/Community", "12-15", "10-12", "2-3", "Portfolio grids possibly DB-driven"],
        ["Getting Started/Tutorial", "5-8", "3-5", "2-3", "Video embeds, LMS links"],
        ["Training Catalog", "5-8", "4-6", "1-2", "Courses may be CMS-fed"],
        ["People/Champions", "3-5", "0", "3-5", "Profile data from database"],
        ["Blog Hub", "8-10", "5-7", "3-4", "Dynamic listings, categories"],
        ["Brand Guidelines", "6-8", "5-7", "1-2", "Static with sidebar nav"],
        ["Solution Provider Directory", "8-10", "5-7", "3-4", "Listings possibly dynamic"],
        ["Feature Updates/Changelog", "3-5", "2-3", "1-2", "Table data may be API-fed"],
        ["AI/SDK Showcase", "5-8", "3-5", "2-3", "Video cases, testimonials"],
        ["Standards/Initiative", "3-5", "2-3", "1-2", "GitHub integration, video"],
        ["TOTALS", "~108-144", "~70-90 (62%)", "~38-54 (38%)", ""],
      ]),

      // Section 5: Integrations
      heading1("5. Integrations Analysis"),
      createTable([
        ["#", "Integration", "Type", "Complexity", "Client/Server", "Active/Legacy"],
        ["1", "Amazon CloudFront CDN", "Infrastructure", "Medium", "Server-side", "Active"],
        ["2", "Amazon SSO/OpenID", "Authentication", "High", "Both", "Active"],
        ["3", "Qualtrics", "Embed/Plugin", "Low", "Client-side", "Active"],
        ["4", "Developer Console (ASK)", "API/Redirect", "High", "Server-side", "Active"],
        ["5", "GitHub", "External Link", "Low", "Client-side", "Active"],
        ["6", "YouTube", "Embed", "Low", "Client-side", "Active"],
        ["7", "Slack Community", "External Link", "Low", "Client-side", "Active"],
        ["8", "Stack Overflow", "External Link", "Low", "Client-side", "Active"],
        ["9", "Sana LMS", "Redirect", "Medium", "Client-side", "Active"],
        ["10", "Amazon Media Services", "CDN/Asset", "Low", "Server-side", "Active"],
        ["11", "fls-na.amazon.com", "Analytics", "Medium", "Client-side", "Active"],
        ["12", "CloudFront Search Index", "API", "Medium", "Client-side", "Active"],
        ["13", "Amazon Science", "External Link", "Low", "Client-side", "Active"],
        ["14", "Developer Forums", "External Platform", "Medium", "Server-side", "Active"],
        ["15", "Social Media APIs", "External Links", "Low", "Client-side", "Active"],
        ["16", "Amazon.com Store", "eCommerce Link", "Low", "Client-side", "Active"],
        ["17", "Alexa+ Subscription", "eCommerce", "High", "Server-side", "Active"],
        ["18", "Video Player (Proprietary)", "Embed", "Medium", "Client-side", "Active"],
      ]),

      // Section 6: Forms
      heading1("6. Forms Analysis"),
      createTable([
        ["Category", "Count", "Complexity", "Backend Required"],
        ["Newsletter Signup ('Voice Mail')", "5-8", "Simple", "Yes - Qualtrics"],
        ["Developer Account Registration", "1", "High", "Yes - Amazon SSO"],
        ["Pitch/Application Form", "2-3", "Medium", "Yes - CRM"],
        ["Feedback Survey", "2-3", "Simple", "Yes - Qualtrics"],
        ["Contact Us", "1", "Medium", "Yes - Ticketing"],
        ["Training Enrollment (external)", "5-8", "N/A", "External LMS"],
        ["TOTAL", "~16-24", "", ""],
      ]),

      heading2("6.1 Complexity Breakdown"),
      createTable([
        ["Complexity", "Count", "Rationale"],
        ["Simple (1-2 fields)", "10-14", "Newsletter, feedback surveys"],
        ["Medium (multi-field)", "3-5", "Contact, pitch applications"],
        ["Complex (multi-step, auth)", "2-3", "Developer registration, console access"],
        ["External (not migratable)", "5-8", "LMS enrollment, forums"],
      ]),

      // Section 7: Offers & Personalization
      heading1("7. Offers & Personalization Analysis"),
      para("No Adobe Target or equivalent third-party personalization engine detected. Personalization handled by Amazon's internal systems.", { italics: true }),
      createTable([
        ["Category", "Instances", "Complexity", "Backend Required"],
        ["Authenticated state (sign-in/out)", "All pages", "Medium", "Yes - Session"],
        ["Locale-based content", "All pages", "Medium", "No - URL routing"],
        ["New feature callout banners", "3-5", "Low", "No - static"],
        ["Context-aware device sync (consumer)", "2-3", "High", "Yes - Amazon ecosystem"],
        ["Alexa+ subscription upsell", "2-3", "Medium", "Yes - subscription API"],
      ]),

      // Section 8: Complex Use Cases
      heading1("8. Complex Use Cases & Observations"),
      createTable([
        ["#", "Use Case", "Instances", "Location", "Why Complex"],
        ["1", "Developer Console SSO", "All dev pages", "Sign-in CTAs", "Amazon SSO federation; cannot replicate in EDS"],
        ["2", "Multi-language (9+ locales)", "All pages", "Language selector", "Full i18n framework with translated nav"],
        ["3", "Developer Portal Search", "All dev pages", "Header search", "CloudFront-indexed; needs edge worker or search service"],
        ["4", "Video Carousel + Player", "2-3 pages", "Consumer pages", "Proprietary player, lazy loading, state mgmt"],
        ["5", "Champions Database", "1 + profiles", "Champions page", "DB-driven profiles, geographic filtering"],
        ["6", "Blog/Content Feed", "4+ sections", "Blog hub", "CMS-driven listings, categories, pagination"],
        ["7", "External LMS Integration", "5-8 pages", "Training section", "Course data from Sana, progress external"],
        ["8", "Partner/Provider Directory", "3-5 pages", "Solution providers", "Potentially DB-driven listings"],
        ["9", "Amazon Store Cross-Links", "5-8 pages", "Shop Echo links", "Deep linking with referral tracking"],
        ["10", "Subscription/Purchase Flow", "1-2 pages", "Alexa+ upsell", "Amazon subscription infrastructure"],
      ]),

      // Section 9: Outlier Scenarios
      heading1("9. Outlier Scenarios"),
      createTable([
        ["#", "Scenario", "Implementation", "Complexity", "EDS Approach", "Effort (days)"],
        ["1", "Developer Console SSO", "Amazon OpenID Connect, session cookies", "Very High", "Federated auth via edge worker", "15-20"],
        ["2", "CloudFront Search", "Pre-built index on CloudFront CDN", "High", "Algolia/Coveo or AEM search", "10-15"],
        ["3", "Video Player Integration", "Custom player, m.media-amazon.com", "Medium", "YouTube embeds or HTML5 video block", "5-8"],
        ["4", "Champions Profile System", "Backend DB, geographic tabs, profiles", "Medium", "Spreadsheet-driven or edge worker + DB", "8-12"],
        ["5", "Blog CMS Integration", "Separate CMS feeding blog content", "High", "AEM doc-based authoring or headless CMS", "12-18"],
        ["6", "Training/LMS Redirect", "External Sana platform", "Low", "Simple link cards; LMS stays external", "2-3"],
        ["7", "Locale-Based Routing", "9+ languages, translated nav/content", "High", "AEM multi-language; edge worker locale", "15-20"],
        ["", "TOTAL", "", "", "", "67-96"],
      ]),

      // Section 10: Migration Estimates
      heading1("10. Migration Estimates"),
      heading2("10.1 Effort Breakdown"),
      createTable([
        ["Work Stream", "Items", "Effort (Days)", "Notes"],
        ["Design System Creation", "38 components", "25", "Tokens, typography, color, grid"],
        ["Template Development", "15 templates", "30", "EDS page templates + block definitions"],
        ["Standard Block Development", "25 blocks", "20", "Cards, heroes, columns, footers, nav"],
        ["Complex Block Development", "8 blocks", "25", "Video carousel, search, nav, carousels"],
        ["Integration Layer", "18 integrations", "35", "Auth, search, video, LMS, analytics, i18n"],
        ["Content Migration - Automated", "70-90 pages", "10", "Scripted import for static pages"],
        ["Content Migration - Manual", "38-54 pages", "25", "Dynamic pages, profiles, blog"],
        ["Localization Framework", "9 languages", "15", "i18n structure, translated nav, locale routing"],
        ["QA & Testing", "All", "20", "Cross-browser, a11y, responsive, integration"],
        ["Performance Optimization", "All", "5", "Lighthouse 100, CWV, images"],
        ["UAT & Stakeholder Review", "All", "8", "Business validation"],
        ["Documentation", "-", "5", "Author guides"],
        ["TOTAL", "", "273", ""],
      ]),

      heading2("10.2 Phase Summary"),
      createTable([
        ["Phase", "Person-Days", "Duration (Weeks)", "Team Size"],
        ["Phase 1: Design & Architecture", "55", "4", "3"],
        ["Phase 2: Core Development", "75", "5", "3"],
        ["Phase 3: Integration & Complex Features", "60", "4", "3"],
        ["Phase 4: Content Migration & i18n", "50", "4", "3"],
        ["Phase 5: QA, UAT & Launch", "33", "3", "2"],
        ["TOTAL", "273 person-days", "~20 weeks", "3 avg"],
      ]),

      heading2("10.3 Cost Estimate"),
      createTable([
        ["Resource", "Rate/Day", "Days", "Cost"],
        ["Solution Architect", "$1,800", "25", "$45,000"],
        ["Senior Frontend Developer (x2)", "$1,500", "130", "$195,000"],
        ["Integration Developer", "$1,600", "50", "$80,000"],
        ["UX/Design Lead", "$1,400", "30", "$42,000"],
        ["Content Migration Specialist", "$1,000", "35", "$35,000"],
        ["QA Engineer", "$1,200", "25", "$30,000"],
        ["Project Management", "$1,400", "20 wks", "$28,000"],
        ["TOTAL", "", "", "~$455,000"],
      ]),

      heading2("10.4 Risk Factors"),
      createTable([
        ["Risk", "Impact", "Probability", "Mitigation"],
        ["Amazon SSO integration complexity", "+3 weeks", "High", "Early auth architecture spike"],
        ["Search implementation challenges", "+2 weeks", "Medium", "Evaluate Algolia/Coveo early"],
        ["Video player replacement quality", "+1 week", "Low", "Use standard HTML5/YouTube"],
        ["Blog content volume exceeds estimate", "+2 weeks", "Medium", "Prioritize recent content only"],
        ["Localization scope growth", "+3 weeks", "High", "Phase languages incrementally"],
        ["Amazon internal stakeholder alignment", "+2 weeks", "High", "Early governance agreement"],
      ]),

      // Recommendations
      heading1("11. Recommendations"),
      para("Migration Strategy:", { bold: true }),
      bullet("Exclude Amazon.com commerce pages - embedded in Amazon retail platform"),
      bullet("Developer Portal first - most content, best suited to EDS"),
      bullet("Consumer landing as showcase - high design quality proof-of-concept"),
      bullet("Auth via redirect - don't replicate SSO; redirect and handle tokens"),
      bullet("Search via third-party - Algolia/Coveo instead of CloudFront index"),
      bullet("Blog as doc-based - AEM document authoring for blog content"),
      bullet("Localization phased - Start English, add JP/DE/FR based on traffic"),
      para(""),
      para("Out-of-Scope Items:", { bold: true }),
      bullet("Amazon.com product/commerce pages (deep retail integration)"),
      bullet("Developer Console applications (ASK, AVS, ACK)"),
      bullet("Sana LMS training platform content (keep as redirect)"),
      bullet("Developer Forums (separate platform)"),
      bullet("Amazon Science blog (separate domain/CMS)"),
      para(""),
      para("Quick Wins (Weeks 1-4):", { bold: true }),
      bullet("Establish design tokens from existing patterns"),
      bullet("Migrate 15-20 static marketing pages (Programs, Branding)"),
      bullet("Set up EDS infrastructure with CI/CD"),
      bullet("Build global nav component and footer"),

      // Asset Inventory
      heading1("Appendix A: Asset Inventory"),
      createTable([
        ["Asset Type", "Estimated Count", "Source"],
        ["Hero/banner images", "~25-30", "CloudFront CDN"],
        ["Product/SDK icons", "~40-50", "CloudFront CDN"],
        ["Partner/brand logos", "~30-40", "Logo grids"],
        ["Champion profile photos", "~50-80", "Champions section"],
        ["Video content", "~15-20", "Embedded players"],
        ["PDF/documentation files", "~10-15", "Brand guidelines"],
        ["Total Digital Assets", "~170-235", ""],
      ]),
    ]
  }]
});

const buffer = await Packer.toBuffer(doc);
writeFileSync('/workspace/Alexa-EDS-Migration-Analysis-Report.docx', buffer);
console.log('DOCX generated: /workspace/Alexa-EDS-Migration-Analysis-Report.docx');
