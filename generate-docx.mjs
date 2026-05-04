import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, BorderStyle, AlignmentType, ShadingType } from 'docx';
import { writeFileSync, readFileSync } from 'fs';

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 }
      }
    }
  },
  sections: [{
    properties: {},
    children: [
      // Title Page
      new Paragraph({ spacing: { before: 2000 }, children: [] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "NovoCare.com", bold: true, size: 56, font: "Calibri" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Migration Analysis Report", bold: true, size: 44, font: "Calibri" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [new TextRun({ text: "Comprehensive Site Inventory & AEM as a Cloud Service Migration Scoping", size: 28, italics: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 800 },
        children: [new TextRun({ text: "Date: May 4, 2026", size: 24 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Primary Site: https://www.novocare.com/", size: 24 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "HCP Subsite: https://www.novocare.com/hcp.html", size: 24 })]
      }),
      new Paragraph({ spacing: { before: 1200 }, children: [] }),

      // Executive Summary
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Executive Summary", bold: true })] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "NovoCare.com is Novo Nordisk's patient and healthcare professional support portal serving 361 indexed pages across 7 therapeutic areas. The site is currently built on Adobe Experience Manager (AEM 6.x) with a traditional/classic UI approach. Migration to AEM as a Cloud Service with Edge Delivery Services represents a significant modernization opportunity, involving deeply integrated pharmacy services, insurance verification tools, and multi-step eligibility workflows." })]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Key Metrics:", bold: true })]
      }),
      new Paragraph({ children: [new TextRun({ text: "  • 361 total pages (265 patient-facing, 96 HCP)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • 89 forms (54 complex, 23 medium, 12 simple)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • 20 third-party integrations" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • 34 unique UI components/blocks" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • 18 page templates" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • ~195 digital assets" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Estimated effort: 535 person-days (~34 weeks, 4 person team)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Estimated cost: ~$789,600" })] }),

      // Section 1: Technology Stack
      new Paragraph({ spacing: { before: 400 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "1. Current Technology Stack", bold: true })] }),
      createTable([
        ["Layer", "Technology", "Evidence"],
        ["CMS", "Adobe Experience Manager (AEM 6.x Classic)", "Asset paths: /content/dam/novonordisk/novocare/"],
        ["Frontend", "Vanilla HTML/CSS/JS (server-rendered)", "No SPA framework detected"],
        ["Privacy/Consent", "OneTrust", "Privacy portal integration confirmed"],
        ["Analytics", "Adobe Analytics (implied)", "Adobe ecosystem, cookie consent categories"],
        ["Personalization", "Limited/None detected", "No Adobe Target evidence found"],
        ["CDN/Hosting", "Akamai (likely)", "Enterprise pharma standard"],
        ["Forms", "Custom AEM Forms + Third-party", "Multi-step eligibility forms, CoverMyMeds"],
        ["Pharmacy Platform", "AssistRx + CoAssist + CenterWell", "Three-vendor pharmacy fulfillment"],
        ["Insurance Verification", "Custom + CoverMyMeds", "Real-time payer system integration"],
        ["Email/SMS", "Custom + ConnectiveRx", "Text savings programs (shortcode 21848)"],
        ["i18n", "Path-based (/es/)", "Spanish content for Bleeding Disorders"],
      ]),

      // Section 1.2: Pages by Theme
      new Paragraph({ spacing: { before: 400 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1.1 Pages by Thematic Breakdown", bold: true })] }),
      createTable([
        ["Therapeutic Area", "Patient Pages", "HCP Pages", "Total"],
        ["Diabetes", "94", "15", "109"],
        ["Obesity (Saxenda + Wegovy)", "19", "6", "25"],
        ["Growth-Related Disorders", "30", "8", "38"],
        ["Bleeding Disorders", "38", "6", "44"],
        ["PH1 (Primary Hyperoxaluria)", "17", "1", "18"],
        ["MASH", "10", "6", "16"],
        ["Women's Health", "1", "0", "1"],
        ["General/Cross-Product", "56", "54", "110"],
        ["TOTAL", "265", "96", "361"],
      ]),

      // Pages by data design
      new Paragraph({ spacing: { before: 400 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1.2 Pages by Data Design (Static vs Dynamic)", bold: true })] }),
      createTable([
        ["Category", "Count", "%", "Description"],
        ["Static Content", "185", "51%", "Educational, product info, insurance education, resources"],
        ["Dynamic/Tool-Based", "92", "26%", "Coverage checkers, eligibility forms, savings enrollment"],
        ["Semi-Dynamic", "84", "23%", "Product pages with conditional content, pharmacy pages"],
      ]),

      // eCommerce pages
      new Paragraph({ spacing: { before: 400 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1.3 Pages Integrated with eCommerce/Pharmacy", bold: true })] }),
      createTable([
        ["Type", "Count", "Examples"],
        ["Pharmacy ordering/fulfillment", "13", "Ozempic pharmacy, MASH pharmacy, general pharmacy"],
        ["Savings card enrollment (transactional)", "44", "Eligibility pages with multi-step forms"],
        ["Coverage verification tools", "32", "Check-coverage pages with real-time payer lookups"],
        ["Total eCommerce-adjacent", "89", ""],
      ]),

      // External systems
      new Paragraph({ spacing: { before: 400 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1.4 Pages Fed from External Systems", bold: true })] }),
      createTable([
        ["Source System", "Page Count", "Description"],
        ["Insurance/Payer verification APIs", "32", "Real-time coverage check results"],
        ["CoverMyMeds (PA system)", "5", "Prior Authorization workflow"],
        ["NPI Registry (CMS database)", "8", "HCP verification lookups"],
        ["CoAssist/AssistRx (Pharmacy)", "13", "Prescription routing, fulfillment"],
        ["ConnectiveRx (Savings processing)", "44", "Savings card adjudication"],
        ["Total externally-fed", "~102", ""],
      ]),

      // Design System
      new Paragraph({ spacing: { before: 400 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1.5 Design System Analysis", bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "Current State: No formal design system detected. The site uses:", bold: false })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Custom CSS with no framework (no Tailwind, Bootstrap, or Material)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Inconsistent component patterns between therapeutic areas" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • SVG icon library (custom, non-standardized)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Brand-specific color schemes per product" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Responsive design via custom media queries" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Character-based educational modules (Gabby, Max, Beth, Tom, Chris)" })] }),

      // Section 2: Templates Inventory
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "2. Templates Inventory", bold: true })] }),
      createTable([
        ["#", "Template Name", "Complexity", "Reasoning", "Example URL"],
        ["1", "Homepage", "High", "Multiple interactive modules, guided wizard, conditional content", "novocare.com/"],
        ["2", "HCP Homepage", "Medium", "Card-based layout, simpler than patient homepage", "novocare.com/hcp.html"],
        ["3", "Disease Area Landing", "Medium", "Card grid, enrollment steps, multi-product nav", "novocare.com/diabetes/home.html"],
        ["4", "Product Detail", "Medium", "Product-specific content, savings/coverage CTAs, ISI", "novocare.com/diabetes/products/ozempic.html"],
        ["5", "Savings Offer Listing", "Medium", "Product card grid, category separation", "novocare.com/diabetes/help-with-costs/savings-offers.html"],
        ["6", "Coverage Check - Patient", "High", "Multi-step form wizard, real-time API, provider search", "novocare.com/diabetes/products/ozempic/check-coverage.html"],
        ["7", "Coverage Check - HCP", "High", "NPI lookup, payer integration, PA workflow linkage", "novocare.com/hcp/growth-related-disorders/check-coverage/echeck.html"],
        ["8", "Eligibility/Enrollment Form", "High", "Multi-step registration, government screening", "novocare.com/diabetes/products/ozempic/savings-offer.html"],
        ["9", "Insurance Education", "Medium", "Quiz module, character personas, interactive FAQ", "novocare.com/diabetes/insurance-information/exploring-insurance/about.html"],
        ["10", "Insurance Type", "Low", "Static educational content, consistent template", "novocare.com/diabetes/insurance-information/insurance-types/commercial.html"],
        ["11", "Pharmacy/eCommerce", "High", "Pricing, payment routing, delivery scheduling", "novocare.com/diabetes/products/ozempic/pharmacy.html"],
        ["12", "Resource/Education Page", "Low", "Static content, safe disposal, needle options", "novocare.com/ph1/resources/safe-disposal.html"],
        ["13", "Find a Doctor/Provider", "Medium", "Third-party provider cards, telehealth links", "novocare.com/patient/treatment/find-doctor.html"],
        ["14", "App Promotion", "Low", "App store links, QR code, feature highlights", "novocare.com/patient/support/wgt-app.html"],
        ["15", "HCP Disease Area Landing", "Medium", "Professional tools, PA/coverage CTAs", "novocare.com/hcp/diabetes/home.html"],
        ["16", "Prior Authorization", "Medium", "CoverMyMeds integration, workflow guidance", "novocare.com/hcp/diabetes/start-a-pa.html"],
        ["17", "Spanish Language Pages", "Low", "Translation overlay on existing templates", "novocare.com/content/novocare/es/bleeding-disorders/home.html"],
        ["18", "Contact/Support", "Low", "Static informational page", "novocare.com/contact-us.html"],
      ]),

      // Section 3: Blocks Catalog
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "3. Blocks/Components Catalog", bold: true })] }),
      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.1 Navigation & Layout Components", bold: true })] }),
      createTable([
        ["#", "Component", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Extension"],
        ["1", "Global Header/Nav", "High", "Mega-menu with therapeutic taxonomy, responsive", "Custom variant", "No", "No", "No"],
        ["2", "Sidebar Navigation", "Medium", "Collapsible left-nav with expandable sections", "Custom block", "No", "No", "No"],
        ["3", "Footer", "Medium", "Multi-column legal, privacy, language switcher", "Standard variant", "No", "No", "No"],
        ["4", "Breadcrumb", "Low", "Hierarchical path navigation", "Standard EDS", "No", "No", "No"],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.2 Hero & Banner Components", bold: true })] }),
      createTable([
        ["#", "Component", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Extension"],
        ["5", "Hero Banner", "Medium", "Full-width with headline, subhead, CTA, responsive images", "Standard variant", "No", "No", "No"],
        ["6", "Product Hero", "Medium", "Brand-specific hero with product imagery", "Hero variant", "No", "No", "No"],
        ["7", "Alert/Notice Banner", "Low", "Supply disruption notices, time-limited offers", "Standard banner", "No", "No", "No"],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.3 Card & Grid Components", bold: true })] }),
      createTable([
        ["#", "Component", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Extension"],
        ["8", "Action Card Grid", "Medium", "3-4 column icon+text cards with CTAs", "Cards variant", "No", "No", "No"],
        ["9", "Therapeutic Area Cards", "Medium", "6 branded cards with explore CTAs", "Cards variant", "No", "No", "No"],
        ["10", "Product Selection Cards", "Medium", "Medication logo cards for check entry", "Cards variant", "No", "No", "No"],
        ["11", "Provider/Telehealth Cards", "Medium", "Partner cards with method icons", "Cards variant", "No", "No", "No"],
        ["12", "Savings Product Cards", "Medium", "Brand logo + dosage + Save CTA", "Cards variant", "No", "No", "No"],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.4 Interactive/Tool Components", bold: true })] }),
      createTable([
        ["#", "Component", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Extension"],
        ["13", "Coverage Check Wizard", "High", "Multi-step form, real-time insurance verification", "Custom block", "Yes - Payer APIs", "Yes", "High"],
        ["14", "Eligibility Enrollment", "High", "Multi-step registration, govt screening", "Custom block", "Yes - ConnectiveRx", "Yes", "High"],
        ["15", "NPI Lookup Tool", "High", "Provider search with CMS registry", "Custom block", "Yes - CMS NPI", "No", "Medium"],
        ["16", "Insurance Quiz", "Medium", "4-question interactive quiz", "Custom block", "No", "No", "Low"],
        ["17", "Guided Help Wizard", "High", "Multi-step questionnaire routing", "Custom block", "No", "Possible", "Medium"],
        ["18", "Pharmacy Ordering", "High", "Payment, delivery, pricing", "Custom block", "Yes - 3 vendors", "Yes", "High"],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.5 Content & Educational Components", bold: true })] }),
      createTable([
        ["#", "Component", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Extension"],
        ["19", "ISI (Safety Info)", "Medium", "Expandable/collapsible warnings", "Accordion variant", "No", "No", "No"],
        ["20", "Character Dialogue", "Medium", "Persona speech bubbles (Gabby etc)", "Custom block", "No", "No", "Low"],
        ["21", "Step-by-Step Process", "Low", "Numbered sequential steps with icons", "Columns/steps", "No", "No", "No"],
        ["22", "Enrollment Workflow", "Medium", "6-7 step visual process", "Custom block", "No", "No", "No"],
        ["23", "FAQ/Accordion", "Low", "Expandable Q&A sections", "Standard accordion", "No", "No", "No"],
        ["24", "Callout Box", "Low", "Highlighted educational content", "Standard callout", "No", "No", "No"],
        ["25", "Pricing Table", "Medium", "Conditional pricing display", "Table variant", "Possible", "Yes", "Low"],
        ["26", "Social Sharing", "Low", "Facebook, Twitter, LinkedIn, email", "Standard embed", "No", "No", "No"],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.6 Modal & Utility Components", bold: true })] }),
      createTable([
        ["#", "Component", "Complexity", "Description", "EDS Standard", "Backend", "Edge Worker", "UI Extension"],
        ["27", "Exit Warning Modal", "Low", "Leaving NovoCare.com dialog", "Custom JS", "No", "No", "No"],
        ["28", "Definition Popup", "Low", "Inline term definitions", "Custom tooltip", "No", "No", "No"],
        ["29", "Cookie Consent", "Low", "OneTrust banner", "Third-party", "No", "No", "No"],
        ["30", "Language Switcher", "Low", "EN/ES toggle", "Custom nav", "No", "No", "No"],
        ["31", "PDF Download Link", "Low", "PI and Med Guide links", "Standard link", "No", "No", "No"],
        ["32", "App Store Badges", "Low", "iOS/Android + QR code", "Standard embed", "No", "No", "No"],
        ["33", "Click-to-Call", "Low", "Phone with tel: protocol", "Standard link", "No", "No", "No"],
        ["34", "SMS Enrollment CTA", "Medium", "Shortcode savings activation", "Custom CTA", "Yes - SMS", "No", "No"],
      ]),

      // Section 4: Page Counts by Template
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "4. Page Counts by Template", bold: true })] }),
      createTable([
        ["Template", "Total Pages", "Auto-Migratable", "Manual Migration", "Reasoning"],
        ["Homepage", "1", "0", "1", "Complex interactive wizard"],
        ["HCP Homepage", "1", "0", "1", "Custom card layout"],
        ["Disease Area Landing", "7", "0", "7", "Enrollment workflows vary"],
        ["Product Detail", "15", "10", "5", "Mostly standardized"],
        ["Savings Offer Listing", "8", "6", "2", "Standardized cards"],
        ["Coverage Check - Patient", "20", "0", "20", "Complex API forms"],
        ["Coverage Check - HCP", "12", "0", "12", "NPI + payer integration"],
        ["Eligibility/Enrollment", "44", "0", "44", "Multi-step, third-party"],
        ["Insurance Education", "42", "35", "7", "Mostly static; quiz pages custom"],
        ["Insurance Type", "40", "38", "2", "Highly standardized"],
        ["Pharmacy/eCommerce", "13", "0", "13", "Complex ordering"],
        ["Resource/Education", "25", "22", "3", "Mostly static"],
        ["Find a Doctor", "2", "0", "2", "Third-party integrations"],
        ["App Promotion", "2", "1", "1", "Deep linking"],
        ["HCP Disease Landing", "8", "5", "3", "Standardized with variations"],
        ["Prior Authorization", "5", "0", "5", "CoverMyMeds integration"],
        ["Spanish Language", "8", "6", "2", "Translation overlay"],
        ["Contact/Support", "3", "3", "0", "Simple static"],
        ["SMS Terms/Legal", "6", "6", "0", "Static legal"],
        ["Other/Archive", "6", "4", "2", "Mixed"],
        ["TOTALS", "361", "~131 (36%)", "~230 (64%)", ""],
      ]),

      // Section 5: Integrations
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "5. Integrations Analysis", bold: true })] }),
      createTable([
        ["#", "Integration", "Type", "Complexity", "Client/Server", "Active/Legacy", "Pages Affected"],
        ["1", "OneTrust", "Embed/Plugin", "Low", "Client-side", "Active", "All pages"],
        ["2", "Adobe Analytics", "Tag/Script", "Medium", "Client-side", "Active", "All pages"],
        ["3", "CoverMyMeds", "API/Redirect", "High", "Server-side", "Active", "5 PA pages"],
        ["4", "CMS NPI Registry", "API", "Medium", "Server-side", "Active", "12 HCP pages"],
        ["5", "Insurance Payer APIs", "API", "High", "Server-side", "Active", "32 coverage pages"],
        ["6", "ConnectiveRx", "API/Service", "High", "Server-side", "Active", "44 savings pages"],
        ["7", "SS&C Health", "API/Service", "High", "Server-side", "Active", "Claims adjudication"],
        ["8", "AssistRx", "API/Service", "High", "Server-side", "Active", "Patient registration"],
        ["9", "CoAssist Pharmacy", "API/Service", "High", "Server-side", "Active", "Rx dispensing"],
        ["10", "CenterWell Pharmacy", "API/Service", "Medium", "Server-side", "Active", "Fulfillment"],
        ["11", "SMS Gateway", "API", "Medium", "Server-side", "Active", "Text savings (21848)"],
        ["12", "Email Service", "API", "Low", "Server-side", "Active", "Coverage results"],
        ["13", "AEM DAM", "Platform", "Medium", "Server-side", "Active", "All assets"],
        ["14", "novo-pi.com", "External Link", "Low", "Client-side", "Active", "All product pages"],
        ["15", "NovoReimburse.com", "External Svc", "Medium", "Client-side", "Active", "Reimbursement"],
        ["16", "WeGo_Together App", "Deep Link", "Medium", "Client-side", "Active", "2 pages"],
        ["17", "Telehealth Partners (8)", "External Link", "Low", "Client-side", "Active", "Find doctor"],
        ["18", "FDA MedWatch", "External Link", "Low", "Client-side", "Active", "Product pages"],
        ["19", "Healthgrades", "External Link", "Low", "Client-side", "Active", "Find doctor"],
        ["20", "App Store/Google Play", "Deep Link", "Low", "Client-side", "Active", "App pages"],
      ]),

      // Section 6: Forms
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "6. Forms Analysis", bold: true })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "6.1 Form Inventory", bold: true })] }),
      createTable([
        ["Category", "Count", "Sample URL", "Complexity", "Backend Required"],
        ["Coverage Check (Patient)", "20", "/diabetes/products/ozempic/check-coverage.html", "High", "Yes - Payer APIs"],
        ["Coverage Check (HCP eCheck)", "8", "/hcp/growth-related-disorders/check-coverage/echeck.html", "High", "Yes - Payer + NPI"],
        ["Coverage Check (QuickCheck)", "4", "/hcp/bleeding-disorders/quickcheck.html", "Medium", "Yes - Simplified payer"],
        ["Savings Card Enrollment", "20", "/diabetes/products/ozempic/savings-offer.html", "High", "Yes - ConnectiveRx"],
        ["Eligibility Verification", "15", "/eligibility/diabetes-savings-card.html", "Medium", "Yes - SS&C Health"],
        ["Coverage Request", "4", "/mash/check-coverage/coverage-request.html", "Medium", "Yes - Payer systems"],
        ["Patient Sign-Up", "5", "/diabetes/sign-up-for-support.html", "Low", "Yes - CRM/email"],
        ["Pharmacy Enrollment", "6", "/eligibility/pharmacy.html", "High", "Yes - AssistRx"],
        ["Guided Help Wizard", "1", "/ (homepage)", "High", "No (client-side)"],
        ["Insurance Quiz", "6", "/insurance-information/exploring-insurance/about.html", "Low", "No"],
        ["TOTAL", "89", "", "", ""],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "6.2 Complexity Breakdown", bold: true })] }),
      createTable([
        ["Complexity", "Count", "Rationale"],
        ["Simple (1-2 steps, no API)", "12", "Sign-up forms, quiz modules, contact forms"],
        ["Medium (2-3 steps, basic API)", "23", "Eligibility verification, coverage requests"],
        ["Complex (4+ steps, real-time API)", "54", "Coverage wizards, savings enrollment, pharmacy"],
        ["TOTAL", "89", ""],
      ]),

      // Section 7: Offers & Personalization
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "7. Offers & Personalization Analysis", bold: true })] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "No Adobe Target or equivalent personalization engine detected. Content personalization is achieved through URL-based routing, form-based eligibility determination, and date-based promotional content. No complex personalization migration required.", italics: true })]
      }),
      createTable([
        ["Category", "Count", "Complexity", "Backend Required"],
        ["Conditional Pricing Display", "13", "Medium", "Yes - dynamic pricing"],
        ["Eligibility-Based Content", "44", "Medium", "Yes - program rules engine"],
        ["Insurance-Type Routing", "32", "Medium", "Yes - payer lookup"],
        ["Product-Specific Messaging", "15", "Low", "No"],
        ["Time-Limited Offers", "8", "Low", "No - date-based"],
        ["Supply/Availability Notices", "2", "Low", "Possible"],
      ]),

      // Section 8: Complex Use Cases
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "8. Complex Use Cases & Observations", bold: true })] }),
      createTable([
        ["#", "Use Case", "Instances", "Location", "Why Complex"],
        ["1", "Real-time Insurance Verification", "32 pages", "All coverage check pages", "Live API to multiple payer systems, NPI, timeout handling, email fallback"],
        ["2", "Multi-Vendor Pharmacy Platform", "13 pages", "Pharmacy pages", "3 vendors (AssistRx, CoAssist, CenterWell), e-prescribing, payment, delivery"],
        ["3", "Savings Card Adjudication", "44 pages", "Eligibility/savings", "ConnectiveRx + SS&C Health, BIN/PCN/GRP codes, govt exclusion logic"],
        ["4", "CoverMyMeds PA Workflow", "5 pages", "HCP PA pages", "Cross-platform SSO, pre-populated forms, external registration"],
        ["5", "Multi-Step Eligibility Screening", "20 pages", "Savings enrollment", "Sequential validation, branching disqualification paths"],
        ["6", "NPI Provider Registry Lookup", "12 pages", "HCP tools", "Real-time CMS database, auto-complete, verification"],
        ["7", "Spanish Language Content", "8 pages", "/content/novocare/es/", "Path-based i18n, partial coverage, URL differences"],
        ["8", "Character Education System", "6 pages", "Insurance exploration", "5 personas, speech bubble UI, quiz, progressive disclosure"],
        ["9", "WeGo_Together App Integration", "2 pages", "Patient/support", "Deep linking, QR codes, cross-platform tracking"],
        ["10", "Conditional Pharmacy Pricing", "6 pages", "Pharmacy pages", "Dynamic by insurance, dosage form, promo period"],
      ]),

      // Section 9: Outlier Scenarios
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "9. Outlier Scenarios", bold: true })] }),
      createTable([
        ["#", "Scenario", "Implementation", "Complexity", "EDS Approach", "Effort (days)"],
        ["1", "Coverage Check Tool", "AEM component + payer API proxy", "Very High", "Edge worker + custom form block", "35"],
        ["2", "NovoCare Pharmacy Ordering", "3 vendor APIs integration", "Very High", "Microservice + Edge worker + checkout block", "53"],
        ["3", "Savings Card Activation", "ConnectiveRx integration", "High", "Edge worker + custom form + PDF gen", "26"],
        ["4", "PA Pre-Population", "Session data to CoverMyMeds", "High", "API layer + secure token passing", "21"],
        ["5", "Interactive Insurance Quiz", "Client-side JS + AEM component", "Medium", "Custom EDS block + client-side logic", "10"],
        ["", "TOTAL OUTLIER EFFORT", "", "", "", "145"],
      ]),

      // Section 10: Migration Estimates
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "10. Migration Estimates", bold: true })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "10.1 Effort Breakdown", bold: true })] }),
      createTable([
        ["Work Stream", "Items", "Effort (Days)", "Notes"],
        ["Design System Creation", "34 components", "40", "New tokens, component library, responsive framework"],
        ["Template Development", "18 templates", "45", "EDS page templates with block definitions"],
        ["Standard Block Development", "20 blocks (Low-Med)", "30", "Cards, heroes, accordions, navigation"],
        ["Complex Block Development", "14 blocks (High)", "70", "Forms, wizards, tools, pharmacy flows"],
        ["Integration Layer", "20 integrations", "60", "Edge workers, API proxies, third-party connections"],
        ["Content Migration - Automated", "131 pages", "15", "Scripted migration with validation"],
        ["Content Migration - Manual", "230 pages", "80", "Manual creation and QA"],
        ["Localization (Spanish)", "8 pages + framework", "10", "i18n framework + content"],
        ["QA & Testing", "All", "50", "Cross-browser, accessibility, integration testing"],
        ["Performance Optimization", "All", "10", "Lighthouse 100, CWV optimization"],
        ["UAT & Stakeholder Review", "All", "15", "Business validation cycles"],
        ["Documentation & Training", "-", "10", "Author guides, developer docs"],
        ["TOTAL", "", "535", ""],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "10.2 Phase Summary", bold: true })] }),
      createTable([
        ["Phase", "Effort (Person-Days)", "Duration (Weeks)", "Team Size"],
        ["Phase 1: Design & Architecture", "85", "6", "3"],
        ["Phase 2: Core Development", "170", "10", "4"],
        ["Phase 3: Integration & Complex Features", "130", "8", "4"],
        ["Phase 4: Content Migration", "95", "6", "3"],
        ["Phase 5: QA, UAT & Launch", "55", "4", "3"],
        ["TOTAL", "535 person-days", "~34 weeks", "4 avg"],
      ]),

      new Paragraph({ spacing: { before: 200 }, heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "10.3 Cost Estimate (Blended Rate)", bold: true })] }),
      createTable([
        ["Resource", "Rate/Day", "Days", "Cost"],
        ["Solution Architect", "$1,800", "40", "$72,000"],
        ["Senior Frontend Developer (x2)", "$1,500", "200", "$300,000"],
        ["Integration Developer", "$1,600", "100", "$160,000"],
        ["UX/Design Lead", "$1,400", "50", "$70,000"],
        ["Content Migration Specialist", "$1,000", "80", "$80,000"],
        ["QA Engineer", "$1,200", "50", "$60,000"],
        ["Project Management", "$1,400", "34 weeks", "$47,600"],
        ["TOTAL ESTIMATED COST", "", "", "~$789,600"],
      ]),

      // Recommendations
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "11. Recommendations", bold: true })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Migration Strategy:", bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "1. Phased approach - Start with static content to establish patterns, then tackle interactive tools" })] }),
      new Paragraph({ children: [new TextRun({ text: "2. Edge Worker architecture - Critical for Coverage Check, Pharmacy, and Savings Card workflows" })] }),
      new Paragraph({ children: [new TextRun({ text: "3. Microservice layer - Required for pharmacy platform (3-vendor integration) and insurance verification" })] }),
      new Paragraph({ children: [new TextRun({ text: "4. Design system first - Establish component library before content migration" })] }),
      new Paragraph({ children: [new TextRun({ text: "5. HCP site separation - Treat as distinct workstream with shared design tokens" })] }),
      new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Critical Path Items:", bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "  • Insurance payer API access and documentation (blocking 32 pages)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • ConnectiveRx/SS&C Health integration docs (blocking 44 pages)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • CoAssist/AssistRx pharmacy API access (blocking 13 pages)" })] }),
      new Paragraph({ children: [new TextRun({ text: "  • CoverMyMeds partnership agreement for EDS (blocking 5 pages)" })] }),

      // Asset Inventory
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Appendix A: Asset Inventory", bold: true })] }),
      createTable([
        ["Asset Type", "Estimated Count", "Source"],
        ["Product logos/brand assets", "~30", "/content/dam/novonordisk/novocare/Logos/"],
        ["Icon library (SVG)", "~50", "/content/dam/novonordisk/novocare/icons/"],
        ["Hero/banner images", "~40", "/content/dam/novonordisk/novocare/slabs/"],
        ["Character illustrations", "~20", "Educational section assets"],
        ["PDF documents (PI, Med Guides)", "~30", "novo-pi.com (external)"],
        ["Product photography", "~25", "Product pages"],
        ["Total Digital Assets", "~195", ""],
      ]),

      // Risk Factors
      new Paragraph({ spacing: { before: 600 }, heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "Appendix B: Risk Factors", bold: true })] }),
      createTable([
        ["Risk", "Impact", "Probability", "Mitigation"],
        ["Payer API documentation delays", "+4 weeks", "High", "Early vendor engagement"],
        ["Pharmacy vendor API changes", "+3 weeks", "Medium", "Contract API versioning"],
        ["Regulatory content review cycles", "+2 weeks", "High", "Parallel legal review"],
        ["Spanish content expansion", "+2 weeks", "Medium", "Modular i18n framework"],
        ["Design iterations beyond scope", "+3 weeks", "Medium", "Design sprints, early sign-off"],
      ]),
    ]
  }]
});

function createTable(data) {
  const rows = data.map((row, rowIndex) => {
    const cells = row.map(cell => {
      return new TableCell({
        children: [new Paragraph({
          children: [new TextRun({
            text: cell,
            bold: rowIndex === 0,
            size: 20,
          })]
        })],
        shading: rowIndex === 0 ? { type: ShadingType.SOLID, color: "2B579A", fill: "2B579A" } : undefined,
        width: { size: Math.floor(10000 / row.length), type: WidthType.DXA },
      });
    });
    return new TableRow({ children: cells });
  });

  return new Table({
    rows,
    width: { size: 10000, type: WidthType.DXA },
  });
}

const buffer = await Packer.toBuffer(doc);
writeFileSync('/workspace/NovoCare-Migration-Analysis-Report.docx', buffer);
console.log('DOCX report generated: /workspace/NovoCare-Migration-Analysis-Report.docx');
