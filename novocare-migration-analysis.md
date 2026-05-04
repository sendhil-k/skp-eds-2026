# NovoCare.com Migration Analysis Report
## Comprehensive Site Inventory & AEM as a Cloud Service Migration Scoping

**Date:** May 4, 2026  
**Subject Sites:**  
- Primary: https://www.novocare.com/ (Patient-facing)  
- Subsite: https://www.novocare.com/hcp.html (Healthcare Professional)

---

## Executive Summary

NovoCare.com is Novo Nordisk's patient and healthcare professional support portal serving 361 indexed pages across 7 therapeutic areas. The site is currently built on **Adobe Experience Manager (AEM) 6.x** with a traditional/classic UI approach. Migration to AEM as a Cloud Service with Edge Delivery Services represents a modernization opportunity, but involves significant complexity due to deeply integrated pharmacy services, insurance verification tools, and multi-step eligibility workflows.

---

## 1. High-Level Summary

### 1.1 Current Technology Stack

| Layer | Technology | Evidence |
|-------|-----------|----------|
| **CMS** | Adobe Experience Manager (AEM 6.x Classic) | Asset paths: `/content/dam/novonordisk/novocare/`, component structure |
| **Frontend** | Vanilla HTML/CSS/JS (server-rendered) | No SPA framework detected (no React/Vue/Angular) |
| **Privacy/Consent** | OneTrust | Privacy portal integration confirmed |
| **Analytics** | Adobe Analytics (implied) | Adobe ecosystem, cookie consent categories |
| **Personalization** | Limited/None detected | No Adobe Target evidence found |
| **CDN/Hosting** | Akamai (likely) | Enterprise pharma standard |
| **Forms** | Custom AEM Forms + Third-party | Multi-step eligibility forms, CoverMyMeds integration |
| **Pharmacy Platform** | AssistRx + CoAssist + CenterWell | Three-vendor pharmacy fulfillment stack |
| **Insurance Verification** | Custom + CoverMyMeds | Real-time payer system integration |
| **Email/SMS** | Custom + ConnectiveRx | Text savings programs (shortcode 21848) |
| **i18n** | Path-based (`/es/`) | Spanish content for Bleeding Disorders section |

### 1.2 Pages by Thematic Breakdown

| Theme/Therapeutic Area | Patient Pages | HCP Pages | Total |
|----------------------|--------------|-----------|-------|
| **Diabetes** | 94 | 15 | 109 |
| **Obesity (Saxenda + Wegovy)** | 19 | 6 | 25 |
| **Growth-Related Disorders** | 30 | 8 | 38 |
| **Bleeding Disorders** | 38 | 6 | 44 |
| **PH1 (Primary Hyperoxaluria)** | 17 | 1 | 18 |
| **MASH** | 10 | 6 | 16 |
| **Women's Health** | 1 | 0 | 1 |
| **General/Cross-Product** | 56 | 54 | 110 |
| **TOTAL** | **265** | **96** | **361** |

### 1.3 Pages by Data Design (Static vs. Dynamic)

| Category | Count | % | Description |
|----------|-------|---|-------------|
| **Static Content** | 185 | 51% | Educational, product info, insurance education, resources |
| **Dynamic/Tool-Based** | 92 | 26% | Coverage checkers, eligibility forms, savings enrollment |
| **Semi-Dynamic** | 84 | 23% | Product pages with conditional content, pharmacy pages |
| **TOTAL** | **361** | 100% | |

### 1.4 Pages Integrated with eCommerce/Pharmacy

| Type | Count | Examples |
|------|-------|---------|
| Pharmacy ordering/fulfillment | 13 | Ozempic pharmacy, MASH pharmacy, general pharmacy |
| Savings card enrollment (transactional) | 44 | Eligibility pages with multi-step forms |
| Coverage verification tools | 32 | Check-coverage pages with real-time payer lookups |
| **Total eCommerce-adjacent** | **89** | |

### 1.5 Pages Fed from External Systems

| Source System | Page Count | Description |
|--------------|-----------|-------------|
| Insurance/Payer verification APIs | 32 | Real-time coverage check results |
| CoverMyMeds (PA system) | 5 | Prior Authorization workflow |
| NPI Registry (CMS database) | 8 | HCP verification lookups |
| CoAssist/AssistRx (Pharmacy) | 13 | Prescription routing, fulfillment |
| ConnectiveRx (Savings processing) | 44 | Savings card adjudication |
| **Total externally-fed** | **~102** | |

### 1.6 Design System Analysis

**Current State:** No formal design system detected. The site uses:
- Custom CSS with no framework (no Tailwind, Bootstrap, or Material)
- Inconsistent component patterns between therapeutic areas
- SVG icon library (custom, non-standardized)
- Brand-specific color schemes per product (Ozempic blue, Wegovy green, etc.)
- Responsive design via custom media queries
- Character-based educational modules (Gabby, Max, Beth, Tom, Chris)

**Key Observation:** The lack of a design system means the migration to EDS provides an opportunity to establish a component-based design system from scratch, potentially reducing long-term maintenance.

---

## 2. Templates Inventory

| # | Template Name | Complexity | Reasoning | Example URLs |
|---|--------------|-----------|-----------|--------------|
| 1 | **Homepage** | High | Multiple interactive modules, guided wizard, conditional content, hero carousel | https://www.novocare.com/ |
| 2 | **HCP Homepage** | Medium | Card-based layout, simpler structure than patient homepage | https://www.novocare.com/hcp.html |
| 3 | **Disease Area Landing** | Medium | Card grid, enrollment steps, multi-product navigation, ISI sections | https://www.novocare.com/diabetes/home.html, https://www.novocare.com/bleeding-disorders/home.html, https://www.novocare.com/mash/home.html |
| 4 | **Product Detail** | Medium | Product-specific content, savings/coverage CTAs, expandable ISI, sidebar nav | https://www.novocare.com/diabetes/products/ozempic.html, https://www.novocare.com/diabetes/products/tresiba.html |
| 5 | **Savings Offer Listing** | Medium | Product card grid, category separation, multiple CTAs | https://www.novocare.com/diabetes/help-with-costs/savings-offers.html |
| 6 | **Coverage Check - Patient** | High | Multi-step form wizard, real-time API integration, provider search, conditional routing | https://www.novocare.com/diabetes/products/ozempic/check-coverage.html |
| 7 | **Coverage Check - HCP (eCheck)** | High | NPI lookup, payer integration, multi-step with pre-population, PA workflow linkage | https://www.novocare.com/hcp/growth-related-disorders/check-coverage/echeck.html |
| 8 | **Eligibility/Enrollment Form** | High | Multi-step registration, eligibility checking, government program screening, savings activation | https://www.novocare.com/diabetes/products/ozempic/savings-offer.html |
| 9 | **Insurance Education** | Medium | Quiz module, character personas, interactive FAQ, social sharing | https://www.novocare.com/diabetes/insurance-information/exploring-insurance/about.html |
| 10 | **Insurance Type** | Low | Static educational content with consistent template | https://www.novocare.com/diabetes/insurance-information/insurance-types/commercial.html |
| 11 | **Pharmacy/eCommerce** | High | Pricing display, payment routing, delivery scheduling, multi-vendor integration | https://www.novocare.com/diabetes/products/ozempic/pharmacy.html |
| 12 | **Resource/Education Page** | Low | Static content, safe disposal info, needle options | https://www.novocare.com/ph1/resources/safe-disposal.html |
| 13 | **Find a Doctor/Provider** | Medium | Third-party provider cards, telehealth links, external routing | https://www.novocare.com/patient/treatment/find-doctor.html |
| 14 | **App Promotion** | Low | App store links, QR code, feature highlights | https://www.novocare.com/patient/support/wgt-app.html |
| 15 | **HCP Disease Area Landing** | Medium | Professional tools emphasis, PA/coverage workflow CTAs | https://www.novocare.com/hcp/diabetes/home.html, https://www.novocare.com/hcp/mash/home.html |
| 16 | **Prior Authorization** | Medium | CoverMyMeds integration, workflow guidance | https://www.novocare.com/hcp/diabetes/start-a-pa.html |
| 17 | **Spanish Language Pages** | Low | Translation overlay on existing templates | https://www.novocare.com/content/novocare/es/bleeding-disorders/home.html |
| 18 | **Contact/Support** | Low | Static informational page | https://www.novocare.com/contact-us.html |

---

## 3. Blocks/Components Catalog

### 3.1 Navigation & Layout Components

| # | Component | Complexity | Description | EDS Block Library | Backend Service | LLM/Edge Worker | UI Extension |
|---|-----------|-----------|-------------|-------------------|----------------|-----------------|--------------|
| 1 | **Global Header/Nav** | High | Mega-menu with therapeutic area taxonomy, responsive hamburger, product sub-nav | Custom (variant of nav block) | No | No | No |
| 2 | **Sidebar Navigation** | Medium | Collapsible left-nav with expandable sections, breadcrumb-like hierarchy | Custom block | No | No | No |
| 3 | **Footer** | Medium | Multi-column legal links, privacy portal, language switcher | Standard footer block (variant) | No | No | No |
| 4 | **Breadcrumb** | Low | Hierarchical path navigation | Standard EDS pattern | No | No | No |

### 3.2 Hero & Banner Components

| # | Component | Complexity | Description | Reference URL | EDS Block Library | Backend Service | LLM/Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|-------------------|----------------|-----------------|--------------|
| 5 | **Hero Banner** | Medium | Full-width hero with headline, subhead, CTA, responsive images (LG/SM variants) | Homepage | Standard hero block (variant) | No | No | No |
| 6 | **Product Hero** | Medium | Brand-specific hero with product imagery and savings messaging | Product pages | Hero variant | No | No | No |
| 7 | **Alert/Notice Banner** | Low | Supply disruption notices, time-limited offer banners | Saxenda page | Standard banner/alert | No | No | No |

### 3.3 Card & Grid Components

| # | Component | Complexity | Description | Reference URL | EDS Block Library | Backend Service | LLM/Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|-------------------|----------------|-----------------|--------------|
| 8 | **Action Card Grid** | Medium | 3-4 column icon+text cards with CTAs (coverage, savings, pharmacy, PAP) | Ozempic product page | Cards block (variant) | No | No | No |
| 9 | **Therapeutic Area Cards** | Medium | 6 branded cards with explore CTAs for disease areas | HCP homepage | Cards block (variant) | No | No | No |
| 10 | **Product Selection Cards** | Medium | Medication logo cards for coverage check entry points | Check-coverage landing | Cards block (variant) | No | No | No |
| 11 | **Provider/Telehealth Cards** | Medium | Branded partner cards with communication method icons | Find a doctor page | Cards block (variant) | No | No | No |
| 12 | **Savings Product Cards** | Medium | Brand logo + dosage + "Save now" CTA + eligibility link | Savings offers page | Cards block (variant) | No | No | No |

### 3.4 Interactive/Tool Components

| # | Component | Complexity | Description | Reference URL | EDS Block Library | Backend Service | LLM/Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|-------------------|----------------|-----------------|--------------|
| 13 | **Coverage Check Wizard** | High | Multi-step form with real-time insurance verification, provider search, conditional routing | Coverage check pages | Custom block | Yes - Payer APIs | Yes - data hydration for results | High - custom form UX |
| 14 | **Eligibility Enrollment Form** | High | Multi-step registration with government program screening, savings card activation | Savings offer pages | Custom block | Yes - ConnectiveRx/SS&C | Yes - eligibility validation | High - multi-step form |
| 15 | **NPI Lookup Tool** | High | Provider search with CMS NPI registry integration, auto-complete | HCP coverage pages | Custom block | Yes - CMS NPI API | No | Medium - search UI |
| 16 | **Insurance Quiz Module** | Medium | 4-question interactive quiz with progress tracking | Insurance education | Custom block | No | No | Low - quiz logic |
| 17 | **Guided Help Wizard** | High | Multi-step questionnaire routing patients to appropriate resources | Homepage | Custom block | No | Possible - intent routing | Medium - wizard logic |
| 18 | **Pharmacy Ordering Flow** | High | Payment selection, delivery scheduling, pricing display | Pharmacy pages | Custom block | Yes - CoAssist/AssistRx | Yes - pricing/availability | High - checkout UX |

### 3.5 Content & Educational Components

| # | Component | Complexity | Description | Reference URL | EDS Block Library | Backend Service | LLM/Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|-------------------|----------------|-----------------|--------------|
| 19 | **ISI (Important Safety Info)** | Medium | Expandable/collapsible safety information with structured warnings | All product pages | Accordion block (variant) | No | No | No |
| 20 | **Character Dialogue** | Medium | Persona-based educational content with speech bubbles (Gabby, Max, etc.) | Insurance education | Custom block | No | No | Low - persona display |
| 21 | **Step-by-Step Process** | Low | Numbered sequential steps with icons (enrollment workflows) | MASH home, Bleeding disorders | Columns/steps block | No | No | No |
| 22 | **Enrollment Workflow Steps** | Medium | 6-7 step visual process with icons and descriptions | Norditropin, Bleeding disorders | Custom block | No | No | No |
| 23 | **FAQ/Accordion** | Low | Expandable question/answer sections | Insurance pages | Standard accordion | No | No | No |
| 24 | **Callout Box** | Low | Highlighted educational content with icon | Product pages | Standard callout/highlight | No | No | No |
| 25 | **Pricing Table** | Medium | Conditional pricing display (self-pay vs insured, pen vs pill) | Pharmacy pages | Table block (variant) | Possible - dynamic pricing | Yes - price updates | Low |
| 26 | **Social Sharing** | Low | Facebook, Twitter, LinkedIn, email share buttons | Insurance education | Standard embed/social | No | No | No |

### 3.6 Modal & Overlay Components

| # | Component | Complexity | Description | Reference URL | EDS Block Library | Backend Service | LLM/Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|-------------------|----------------|-----------------|--------------|
| 27 | **Exit Warning Modal** | Low | "You are now leaving NovoCare.com" confirmation dialog | All pages with external links | Custom modal (JS) | No | No | No |
| 28 | **Definition Popup** | Low | Inline term definitions (formulary, PBM, deductible) | Insurance education | Custom tooltip/modal | No | No | No |
| 29 | **Cookie Consent Banner** | Low | OneTrust privacy consent management | All pages | Third-party embed | No | No | No |

### 3.7 Specialized Components

| # | Component | Complexity | Description | Reference URL | EDS Block Library | Backend Service | LLM/Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|-------------------|----------------|-----------------|--------------|
| 30 | **Language Switcher** | Low | EN/ES toggle with path-based routing | Bleeding disorders pages | Custom nav element | No | No | No |
| 31 | **PDF Download Link** | Low | Prescribing information and medication guide links | All product pages | Standard link pattern | No | No | No |
| 32 | **App Store Badges** | Low | iOS/Android app download with QR code | WeGo_Together app page | Standard embed | No | No | No |
| 33 | **Click-to-Call** | Low | Phone number with tel: protocol | Support pages | Standard link | No | No | No |
| 34 | **Text/SMS Enrollment** | Medium | Shortcode-based savings activation (text BEGIN to 21848) | Savings pages | Custom CTA | Yes - SMS gateway | No | No |

---

## 4. Page Counts by Template

| Template | Total Pages | Auto-Migratable | Manual Migration | Reasoning |
|----------|------------|----------------|-----------------|-----------|
| Homepage | 1 | 0 | 1 | Complex interactive wizard, custom layout |
| HCP Homepage | 1 | 0 | 1 | Custom card layout with professional tools |
| Disease Area Landing | 7 | 0 | 7 | Medium complexity, enrollment workflows vary |
| Product Detail | 15 | 10 | 5 | Standardized structure, but some have unique elements |
| Savings Offer Listing | 8 | 6 | 2 | Mostly standardized card layouts |
| Coverage Check - Patient | 20 | 0 | 20 | Complex forms with API integration |
| Coverage Check - HCP | 12 | 0 | 12 | NPI lookup + payer integration |
| Eligibility/Enrollment Form | 44 | 0 | 44 | Multi-step forms, third-party services |
| Insurance Education | 42 | 35 | 7 | Mostly static; quiz pages need custom work |
| Insurance Type | 40 | 38 | 2 | Highly standardized template |
| Pharmacy/eCommerce | 13 | 0 | 13 | Complex ordering/fulfillment integration |
| Resource/Education Page | 25 | 22 | 3 | Mostly static content |
| Find a Doctor/Provider | 2 | 0 | 2 | Third-party integrations |
| App Promotion | 2 | 1 | 1 | Deep linking complexity |
| HCP Disease Area Landing | 8 | 5 | 3 | Standardized with some variations |
| Prior Authorization | 5 | 0 | 5 | CoverMyMeds integration |
| Spanish Language Pages | 8 | 6 | 2 | Translation of existing templates |
| Contact/Support | 3 | 3 | 0 | Simple static pages |
| SMS Terms/Legal | 6 | 6 | 0 | Static legal content |
| Other/Archive | 6 | 4 | 2 | Mixed complexity |
| **TOTALS** | **~361** | **~131 (36%)** | **~230 (64%)** | |

---

## 5. Integrations Analysis

| # | Integration | Type | Complexity | Client/Server | Active/Legacy | Reference URLs |
|---|-------------|------|-----------|---------------|---------------|----------------|
| 1 | **OneTrust** | Embed/Plugin | Low | Client-side | Active | All pages (cookie consent) |
| 2 | **Adobe Analytics** | Tag/Script | Medium | Client-side | Active (implied) | All pages |
| 3 | **CoverMyMeds** | API/Redirect | High | Server-side | Active | /hcp/diabetes/start-a-pa.html |
| 4 | **CMS NPI Registry** | API | Medium | Server-side | Active | HCP coverage check pages |
| 5 | **Insurance Payer APIs** | API | High | Server-side | Active | All coverage check pages (~32) |
| 6 | **ConnectiveRx** | API/Service | High | Server-side | Active | Savings card pages (~44) |
| 7 | **SS&C Health** | API/Service | High | Server-side | Active | Pharmacy claims adjudication |
| 8 | **AssistRx** | API/Service | High | Server-side | Active | Pharmacy patient registration |
| 9 | **CoAssist Pharmacy** | API/Service | High | Server-side | Active | Prescription dispensing |
| 10 | **CenterWell Pharmacy** | API/Service | Medium | Server-side | Active | Fulfillment and shipping |
| 11 | **SMS Gateway** | API | Medium | Server-side | Active | Text savings programs (21848) |
| 12 | **Email Service** | API | Low | Server-side | Active | Coverage results delivery |
| 13 | **Adobe Experience Manager DAM** | Platform | Medium | Server-side | Active | /content/dam/ asset paths |
| 14 | **novo-pi.com** (PI hosting) | External Link | Low | Client-side | Active | All product pages |
| 15 | **NovoReimburse.com** | External Service | Medium | Client-side | Active | Mail-in reimbursement |
| 16 | **WeGo_Together App** | Deep Link/API | Medium | Client-side | Active | /patient/support/wgt-app.html |
| 17 | **Telehealth Partners (8)** | External Links | Low | Client-side | Active | /patient/treatment/find-doctor.html |
| 18 | **FDA MedWatch** | External Link | Low | Client-side | Active | Product pages (adverse event reporting) |
| 19 | **Healthgrades** | External Link | Low | Client-side | Active | Find a doctor page |
| 20 | **App Store / Google Play** | Deep Link | Low | Client-side | Active | App promotion pages |

---

## 6. Forms Analysis

### 6.1 Form Inventory Summary

| Category | Count | Sample URL | Complexity | Backend Required |
|----------|-------|-----------|-----------|-----------------|
| **Coverage Check (Patient)** | 20 | /diabetes/products/ozempic/check-coverage.html | High | Yes - Payer APIs |
| **Coverage Check (HCP - eCheck)** | 8 | /hcp/growth-related-disorders/check-coverage/echeck.html | High | Yes - Payer APIs + NPI |
| **Coverage Check (HCP - QuickCheck)** | 4 | /hcp/bleeding-disorders/quickcheck.html | Medium | Yes - Simplified payer lookup |
| **Savings Card Enrollment** | 20 | /diabetes/products/ozempic/savings-offer.html | High | Yes - ConnectiveRx |
| **Eligibility Verification** | 15 | /eligibility/diabetes-savings-card.html | Medium | Yes - SS&C Health |
| **Coverage Request** | 4 | /mash/check-coverage/coverage-request.html | Medium | Yes - Payer systems |
| **Patient Sign-Up** | 5 | /diabetes/sign-up-for-support.html | Low | Yes - CRM/email |
| **Pharmacy Enrollment** | 6 | /eligibility/pharmacy.html | High | Yes - AssistRx |
| **Guided Help Wizard** | 1 | / (homepage) | High | No (client-side routing) |
| **Insurance Quiz** | 6 | /diabetes/insurance-information/exploring-insurance/about.html | Low | No |
| **TOTAL FORMS** | **~89** | | | |

### 6.2 Form Complexity Breakdown

| Complexity | Count | Rationale |
|-----------|-------|-----------|
| **Simple** (1-2 steps, no API) | 12 | Sign-up forms, quiz modules, contact forms |
| **Medium** (2-3 steps, basic API) | 23 | Eligibility verification, coverage requests, QuickCheck |
| **Complex** (4+ steps, real-time API, conditional logic) | 54 | Coverage check wizards, savings enrollment, pharmacy setup |
| **TOTAL** | **89** | |

### 6.3 Form Features Analysis

| Feature | Occurrence | Complexity Impact |
|---------|-----------|------------------|
| Multi-step wizard | 54 forms | High |
| Real-time API validation | 32 forms | High |
| NPI provider lookup | 12 forms | High |
| Government program screening | 20 forms | Medium |
| Conditional field display | 44 forms | Medium |
| Auto-complete/search | 12 forms | Medium |
| SMS/text enrollment | 8 forms | Medium |
| File/document reference | 4 forms | Low |
| Email result delivery | 32 forms | Medium |

---

## 7. Offers & Personalization Analysis

### 7.1 Personalization Assessment

| Category | Count | Sample URL | Complexity | Backend Required |
|----------|-------|-----------|-----------|-----------------|
| **Conditional Pricing Display** | 13 | Pharmacy pages | Medium | Yes - dynamic pricing |
| **Eligibility-Based Content** | 44 | Savings pages | Medium | Yes - program rules |
| **Insurance-Type Routing** | 32 | Coverage check | Medium | Yes - payer lookup |
| **Product-Specific Messaging** | 15 | Product pages | Low | No |
| **Time-Limited Offers** | 8 | Savings promotions | Low | No - date-based |
| **Supply/Availability Notices** | 2 | Saxenda page | Low | Possible |

### 7.2 Personalization Engine Assessment

**No Adobe Target or equivalent personalization engine detected.** Content personalization is achieved through:
- URL-based routing (different pages for different audiences)
- Form-based eligibility determination (server-side logic)
- Conditional content display within savings enrollment flows
- Date-based promotional content (offer expiration dates)

**Recommendation:** No complex personalization migration required. Conditional logic lives within form workflows rather than page-level targeting.

---

## 8. Complex Use Cases & Observations

| # | Use Case | Instances | Location | Why It's Complex |
|---|----------|-----------|----------|------------------|
| 1 | **Real-time Insurance Verification** | 32 pages | Coverage check pages across all therapeutic areas | Requires live API connections to multiple payer systems, NPI verification, multi-step workflow with conditional branching, timeout handling, and fallback email delivery |
| 2 | **Multi-Vendor Pharmacy Platform** | 13 pages | /pharmacy, product pharmacy pages | Three separate vendors (AssistRx, CoAssist, CenterWell) handling different workflow stages; e-prescribing integration; payment processing; delivery scheduling |
| 3 | **Savings Card Adjudication** | 44 pages | Eligibility/savings pages | Integration with ConnectiveRx and SS&C Health for real-time pharmacy claims; BIN/PCN/GRP code management; government program exclusion logic |
| 4 | **CoverMyMeds PA Workflow** | 5 pages | HCP PA pages | Cross-platform SSO-like experience; pre-populated forms from coverage check; requires HCP registration on external platform |
| 5 | **Multi-Step Eligibility Screening** | 20 pages | Savings enrollment forms | Sequential validation: residency → insurance type → government program check → age verification → enrollment; branching disqualification paths |
| 6 | **NPI Provider Registry Lookup** | 12 pages | HCP tools | Real-time CMS database search; auto-complete UX; verification workflow; address/specialty matching |
| 7 | **Spanish Language Content** | 8 pages | /content/novocare/es/ | Path-based i18n requiring parallel content management; partial translation coverage; URL structure differences |
| 8 | **Character-Based Education System** | 6 pages | Insurance exploration section | Five personas (Gabby, Max, Beth, Tom, Chris) with speech bubble UI, quiz integration, progressive disclosure |
| 9 | **WeGo_Together App Integration** | 2 pages | Patient/support pages | Deep linking, QR codes, cross-platform tracking, app-to-web data sharing |
| 10 | **Conditional Pharmacy Pricing** | 6 pages | Pharmacy pages | Dynamic price display based on: insurance status, self-pay, dosage form (pen vs pill), promotional periods |

---

## 9. Outlier Scenarios

| # | Scenario | Behavior | Implementation | Complexity | EDS Approach |
|---|----------|----------|----------------|-----------|--------------|
| 1 | **Coverage Check Tool** | Renders multi-step form wizard with real-time API calls to payer systems; displays results inline or sends email | Likely AEM component with server-side proxy to insurance verification APIs | Very High | Edge worker for API proxy; custom block with client-side form management; server-side session for multi-step state |
| 2 | **NovoCare Pharmacy Ordering** | Full eCommerce-like flow: product selection → payment → delivery scheduling → fulfillment tracking | Integration with 3 vendor APIs (AssistRx, CoAssist, CenterWell) via AEM backend | Very High | Dedicated microservice; Edge worker for pricing/availability; custom checkout block |
| 3 | **Savings Card Activation** | Multi-step enrollment ending in BIN/PCN/GRP credential issuance for pharmacy use | Server-side integration with ConnectiveRx; eligibility rules engine | High | Edge worker for eligibility API; custom form block; PDF generation for card |
| 4 | **Prior Authorization Pre-Population** | Coverage check data flows into CoverMyMeds PA form as pre-filled fields | Session-based data transfer between AEM and CoverMyMeds | High | API integration layer; secure token-based data passing |
| 5 | **Interactive Insurance Quiz** | 4-question branching quiz with character personas and personalized recommendations | Client-side JS with AEM component for content management | Medium | Custom EDS block; quiz logic in client-side JS; content authored in document |

### Effort Estimates for Outlier Scenarios

| Scenario | Design | Development | Testing | Total (days) |
|----------|--------|-------------|---------|--------------|
| Coverage Check Tool | 5 | 20 | 10 | 35 |
| Pharmacy Ordering | 8 | 30 | 15 | 53 |
| Savings Card Activation | 3 | 15 | 8 | 26 |
| PA Pre-Population | 3 | 12 | 6 | 21 |
| Insurance Quiz | 2 | 5 | 3 | 10 |
| **Total Outliers** | **21** | **82** | **42** | **145 days** |

---

## 10. Migration Estimates

### 10.1 Effort Breakdown

| Work Stream | Pages/Items | Effort (Days) | Notes |
|-------------|-------------|---------------|-------|
| **Design System Creation** | 34 components | 40 | New design tokens, component library, responsive framework |
| **Template Development** | 18 templates | 45 | EDS page templates with block definitions |
| **Standard Block Development** | 20 blocks (Low-Med) | 30 | Cards, heroes, accordions, navigation |
| **Complex Block Development** | 14 blocks (High) | 70 | Forms, wizards, tools, pharmacy flows |
| **Integration Layer** | 20 integrations | 60 | Edge workers, API proxies, third-party connections |
| **Content Migration - Automated** | 131 pages | 15 | Scripted migration with validation |
| **Content Migration - Manual** | 230 pages | 80 | Manual creation and QA |
| **Localization (Spanish)** | 8 pages + framework | 10 | i18n framework + content |
| **QA & Testing** | All | 50 | Cross-browser, accessibility, integration testing |
| **Performance Optimization** | All | 10 | Lighthouse 100, CWV optimization |
| **UAT & Stakeholder Review** | All | 15 | Business validation cycles |
| **Documentation & Training** | - | 10 | Author guides, developer docs |

### 10.2 Summary Estimates

| Category | Effort (Person-Days) | Duration (Calendar Weeks) | Team Size |
|----------|---------------------|--------------------------|-----------|
| **Phase 1: Design & Architecture** | 85 | 6 weeks | 3 |
| **Phase 2: Core Development** | 170 | 10 weeks | 4 |
| **Phase 3: Integration & Complex Features** | 130 | 8 weeks | 4 |
| **Phase 4: Content Migration** | 95 | 6 weeks | 3 |
| **Phase 5: QA, UAT & Launch** | 55 | 4 weeks | 3 |
| **TOTAL** | **535 person-days** | **~34 weeks** | **4 avg** |

### 10.3 Risk Factors & Contingency

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Payer API documentation/access delays | +4 weeks | High | Early engagement with insurance vendors |
| Pharmacy vendor API changes | +3 weeks | Medium | Contract API versioning requirements |
| Regulatory/legal content review cycles | +2 weeks | High | Parallel legal review process |
| Spanish content expansion requirements | +2 weeks | Medium | Modular i18n framework from start |
| Design iterations beyond initial scope | +3 weeks | Medium | Design sprint methodology, early sign-off |

### 10.4 Cost Estimate (Blended Rate)

| Resource | Rate/Day | Days | Cost |
|----------|----------|------|------|
| Solution Architect | $1,800 | 40 | $72,000 |
| Senior Frontend Developer (x2) | $1,500 | 200 | $300,000 |
| Integration Developer | $1,600 | 100 | $160,000 |
| UX/Design Lead | $1,400 | 50 | $70,000 |
| Content Migration Specialist | $1,000 | 80 | $80,000 |
| QA Engineer | $1,200 | 50 | $60,000 |
| Project Management | $1,400 | 34 weeks | $47,600 |
| **TOTAL ESTIMATED COST** | | | **~$789,600** |

---

## 11. Recommendations

### 11.1 Migration Strategy

1. **Phased approach recommended** - Start with static content pages (Insurance education, resources) to establish patterns, then tackle interactive tools
2. **Edge Worker architecture** - Critical for Coverage Check, Pharmacy, and Savings Card workflows
3. **Microservice layer** - Required for the pharmacy platform (3-vendor integration) and insurance verification
4. **Design system first** - Establish component library before content migration
5. **HCP site separation** - Treat as distinct project workstream with shared design tokens

### 11.2 Quick Wins (Weeks 1-4)

- Migrate static educational content (42 insurance education pages)
- Establish design tokens and base component library
- Set up Edge Delivery infrastructure and CI/CD

### 11.3 Critical Path Items

- Insurance payer API access and documentation (blocking for 32 pages)
- ConnectiveRx/SS&C Health integration documentation (blocking for 44 pages)
- CoAssist/AssistRx pharmacy API access (blocking for 13 pages)
- CoverMyMeds partnership agreement for EDS integration (blocking for 5 pages)

---

## Appendix A: Asset Inventory

| Asset Type | Estimated Count | Source |
|-----------|----------------|--------|
| Product logos/brand assets | ~30 | /content/dam/novonordisk/novocare/Logos/ |
| Icon library (SVG) | ~50 | /content/dam/novonordisk/novocare/icons/ |
| Hero/banner images | ~40 | /content/dam/novonordisk/novocare/slabs/ |
| Character illustrations (Gabby, etc.) | ~20 | Educational section assets |
| PDF documents (PI, Med Guides) | ~30 | novo-pi.com (external) |
| Product photography | ~25 | Product pages |
| **Total Digital Assets** | **~195** | |

---

## Appendix B: Site Architecture Diagram

```
novocare.com/
├── / (Homepage - Patient)
├── /hcp.html (HCP Hub)
│   ├── /hcp/diabetes/
│   ├── /hcp/obesity/
│   ├── /hcp/growth-related-disorders/
│   ├── /hcp/bleeding-disorders/
│   ├── /hcp/mash/
│   └── /hcp/ph1/
├── /diabetes/
│   ├── /products/ (11 medications)
│   ├── /help-with-costs/
│   ├── /insurance-information/
│   └── /sign-up-for-support
├── /obesity/
│   ├── /products/saxenda
│   └── /insurance-information/
├── /patient/ (Wegovy-focused)
│   ├── /medicines/wegovy/
│   ├── /treatment/find-doctor
│   └── /support/wgt-app
├── /growth-related-disorders/
├── /bleeding-disorders/
├── /ph1/
├── /mash/
├── /eligibility/ (44 enrollment forms)
├── /pharmacy
├── /contact-us
└── /content/novocare/es/ (Spanish)
```

---

*Report generated: May 4, 2026*  
*Analysis scope: 361 indexed pages, 20 integrations, 89 forms, 34 unique components, 18 templates*
