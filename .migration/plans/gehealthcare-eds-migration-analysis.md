# GE HealthCare AEM AMS to EDS Migration Analysis Plan

## 1. High-Level Summary

### Site Scale
| Metric | Count |
|--------|-------|
| **Main Sitemap URLs (no locale prefix)** | **2,172** |
| US English Pages (`/en-us/`) | 1,723 |
| Global English Pages (`/en/`) | 1,667 |
| Total Across All Locales (12 sitemaps) | ~12,950 |
| Estimated Unique Pages (excluding locale duplication) | ~2,500–3,500 |
| Locale Variants | 10+ (US, GB, DE, SG, MY, PH, TH, Middle East, CN, Global) |
| Max URL Depth | 5 levels (bulk at depth 3) |

### Current Tech Stack
| Layer | Technology | Evidence |
|-------|-----------|----------|
| **Primary CMS** | Adobe Experience Manager (AEM as Cloud Service) | `window.CQ`, `window.Granite`, `etc.clientlibs`, `cmp-*` components, `aem-Grid` |
| **Legacy CMS** | Sitecore JSS (React SPA) | `__JSS_STATE__`, `-/jssmedia/` paths, React webpack bundles — serves `/shop` only |
| **Component Framework** | AEM Core Components | `cmp-carousel`, `cmp-container`, `cmp-button`, `cmp-link`, `cmp-experiencefragment` |
| **Grid System** | AEM Responsive Grid + Material Design Components | `aem-Grid--12`, `mdc-layout-grid` |
| **Image Delivery** | AEM Dynamic Media / Scene7 | `s7d9.scene7.com` asset URLs |
| **Search** | Algolia | Algolia clientlib, `aa-Form` search form classes |
| **Personalization** | Adobe Target (Server-Side) | Console: "Adobe API response... Target Server-Side Call Successful" |
| **Analytics** | Google Tag Manager (2 containers) | `GTM-58LKHLP`, `GTM-W4V7GZG` |
| **Ads/Remarketing** | Google Ads + DoubleClick | `AW-357630064`, `AW-435915669`, `DC-10528130` |
| **Cookie Consent** | Evidon (Crownpeak) | `c.evidon.com` scripts |
| **Forms** | Marketo | `gehc-marketo-form`, `marketoform` classes |
| **Video** | Vidyard | `play.vidyard.com/embed/v4.js` |
| **ABM/Intent** | Nrich.ai | `j.nrich.ai/tag.js` |
| **eCommerce** | SAP Hybris (legacy via Sitecore) | `gehcstorefront`, `/shop` paths |
| **Payments** | Affirm (Buy Now Pay Later) | `cdn1.affirm.com/js/v2/affirm.js` |
| **Pharma CRM** | Veeva | `Veeva` class prefix on homepage |

### Thematic Page Breakdown (from sitemap — 2,172 unique URLs)

| Category | Pages | % | Type |
|----------|-------|---|------|
| **Products** | 906 | 42% | Product Marketing / Catalog |
| **Insights/Articles** | 751 | 35% | Content Marketing / Thought Leadership |
| **Courses** | 209 | 10% | Education / Training |
| **Education** | 84 | 4% | Education Landing Pages |
| **About/Corporate** | 54 | 2% | Corporate / Company |
| **Services** | 29 | 1% | Service Offerings |
| **Events** | 26 | 1% | Events & Conferences |
| **Specialties** | 25 | 1% | Medical Specialties |
| **Campaigns** | 20 | 1% | Marketing Campaigns |
| **News/Press** | 13 | 1% | Press Releases |
| **Shop (eCommerce)** | 9 | <1% | eCommerce (Sitecore JSS) |
| **Corporate/Other** | ~46 | 2% | Initiatives, Support, etc. |

### Pages by Content Type
| Type | Est. % | Est. Pages | Description |
|------|--------|-----------|-------------|
| **Static Authored (CMS)** | ~80% | ~1,740 | Product pages, about, services, specialties |
| **Dynamic/API-Driven** | ~15% | ~325 | Insights/articles feed, courses catalog, events |
| **Hybrid (Static + Personalization)** | ~5% | ~107 | Homepage (Adobe Target), campaign landing pages |

### Design System Analysis
- **AEM Core Components** serve as the foundation (`cmp-*` namespace)
- Custom GE HealthCare components layered on top (`ge-feature-card`, `ge-product-media-carousel`, `category-hero`, etc.)
- **Material Design Components (MDC)** grid used alongside AEM grid (`mdc-layout-grid`)
- Consistent design language with GE brand colors (dark navy, white, teal accents)
- The Sitecore JSS `/shop` pages use a completely different component system — being deprecated
- Overall: **moderately unified** design system with AEM Core Components + custom GE overlay

---

## 2. Templates Inventory

| # | Template Name | AEM Template ID | Complexity | Example URL(s) | Description |
|---|--------------|-----------------|------------|-----------------|-------------|
| T1 | **Homepage** | `homepage-template` | High | `/en-us` | Hero carousel (2+ slides with play/pause), category cards carousel, "What's New" editorial cards, stats counter section, S-curve cards (3), CTA banner. Adobe Target personalization active. |
| T2 | **Product Category** | `generic-page-template` | Medium | `/en-us/products/ultrasound` | Category hero (image + H1 + CTA), video carousel, product card grid, S-curve feature sections, Marketo form modal, promo cards, CTA banner |
| T3 | **Product Detail (PDP)** | `generic-page-template` | High | `/en-us/products/ultrasound/handheld-ultrasound/vscan-air-sl` | Sticky sub-nav with tabs, product hero with pricing/Affirm financing, "At a Glance" icon grid, feature carousels, S-curve features, FAQ accordion, support cards, resource downloads |
| T4 | **Insights Hub** | `generic-page-template` | Medium | `/en-us/insights` | Text hero, 2-column editorial card grid, section headers with eyebrow text |
| T5 | **Article/Content** | `generic-page-template` | Low–Medium | `/en-us/insights/article/five-key-trends-driving-healthcare-forward` | Article hero image, rich text body, author info, related content cards, social sharing |
| T6 | **Contact Us** | `generic-page-template` | Medium | `/en-us/about/contact-us` | Heading, dynamic form with dropdown routing, reCAPTCHA, phone directory |
| T7 | **Specialties Hub** | `generic-page-template` | Low | `/en-us/specialties` | Sticky sub-nav, text intro, 3x2 specialty card grids (alphabetical sections), CTA banner |
| T8 | **Education/Courses** | `generic-page-template` | Medium | `/en-us/courses` | Category hero, training card grid, resource icon cards, feature cards, CTA banner |
| T9 | **Services** | `generic-page-template` | High | `/en-us/services` | Sticky sub-nav, hero, anchor navigation bar, icon grid, sectioned card groups with separators, tab interface (8 tabs), CTA banner. Most complex template. |
| T10 | **Shop/eCommerce** | Sitecore JSS | High | `/shop` | **Different CMS (Sitecore)**. Hero, category carousel, featured products, Affirm/SAP Hybris integration |
| T11 | **Events** | `generic-page-template` | Low | `/en-us/events` | Minimal listing page — header + H1 + footer. Content likely loaded dynamically |
| T12 | **Campaigns** | `generic-page-template` | Medium | `/en-us/campaigns/*` | Marketing landing pages with hero, form capture, feature content |
| T13 | **Newsroom/Press** | `generic-page-template` | Medium | `/en-us/about/newsroom` | Press release listing, article cards, pagination |
| T14 | **Corporate/About** | `generic-page-template` | Low–Medium | `/en-us/about`, `/en-us/about/compliance` | Standard content pages with text sections, link lists |

---

## 3. Blocks Catalog

| # | Block Name | Complexity | Description & Behavior | Reference URL(s) | Standard EDS Block? | Backend Needed? | LLM-Ready? | UI Extension? |
|---|-----------|------------|----------------------|-------------------|---------------------|-----------------|------------|---------------|
| B1 | **Global Header** | High | GE logo, mega-nav with multi-level flyout (Products > Imaging > CT, etc.), search (Algolia), sign-in, cart, hamburger mobile menu, country selector | All pages | No — custom build | Yes (Algolia, auth, cart) | No | No |
| B2 | **Global Footer** | Medium | Logo, 7-column link grid (News, Investors, Suppliers, etc.), compliance links, country selector, social icons (FB, IG, LinkedIn, YouTube), copyright | All pages | No — custom build | No | No | No |
| B3 | **Hero Carousel** | High | Multi-slide hero with background images, H1, CTA links, prev/next/play-pause controls, slide counter (1/2). AEM `cmp-carousel` | Homepage | Variant of Carousel | No | Yes | No |
| B4 | **Category Hero** | Medium | Full-width hero with background image, H1, body text, CTA button | Product category pages | Variant of Hero | No | Yes | No |
| B5 | **Product Hero (with Pricing)** | High | Product image, H1, pricing ("Starting at $4,999"), Affirm financing, dual CTAs (Buy now / Request a demo) | PDP pages | No — custom build | Yes (pricing API, Affirm) | No | No |
| B6 | **Category Cards Carousel** | Medium | Horizontal scrollable icon+text cards for product categories, with prev/next arrows | Homepage | Variant of Carousel | No | Yes | No |
| B7 | **Feature Cards (ge-feature-card)** | Low | Image + H3 title + description + "Learn more" CTA. Grid layout (2-col or 3-col). Most common component. | All templates | Variant of Cards | No | Yes | No |
| B8 | **S-Curve Cards** | Medium | Alternating side-by-side image + text blocks. Image left/right alternates. H3 + paragraph + CTA link | Homepage, Category pages | Variant of Columns | No | Yes | No |
| B9 | **Stats Counter** | Low | 4-column grid of large numbers + descriptions (~$5.1B, 5M+, 1B+, 200+) | Homepage | No — custom build | No | Yes | No |
| B10 | **Editorial Cards (What's New)** | Low | Image + H3 + "Learn more" link. Horizontal scrollable row with section header | Homepage | Variant of Cards | No | Yes | No |
| B11 | **Product Media Carousel** | Medium | Video/image carousel for product demos and clinical images, with progress bar and indicators | Product pages | Variant of Carousel | No | Yes | No |
| B12 | **Sticky Sub-Navigation** | Medium | Fixed top bar with product name, section tabs (Overview/Product Details), and CTA buttons (Buy now/Request demo) | PDP, Services, Specialties | No — custom build | No | Yes | No |
| B13 | **At a Glance (Icon Grid)** | Low | 4-column grid of icon + headline + description. Feature highlights | PDP pages | Variant of Cards | No | Yes | No |
| B14 | **FAQ Accordion** | Low | Expandable Q&A sections with +/- toggle icons | PDP pages | No — custom (or Accordion variant) | No | Yes | No |
| B15 | **Anchor Navigation** | Medium | Horizontal scrollable anchor links for in-page section navigation | Services page | No — custom build | No | Yes | No |
| B16 | **Tab Interface** | Medium | Tabbed content with 8 selectable tabs displaying different content panels | Services page | No — custom build | No | Yes | No |
| B17 | **Marketo Form (Modal)** | High | Lead generation form embedded via Marketo, triggered from CTA buttons. Modal overlay. | Product category pages, campaigns | No — Marketo integration | Yes (Marketo API) | No | Yes (Medium) |
| B18 | **CTA Banner** | Low | "Have a question?" H2 + "Contact us" button. Full-width section | Most pages | Yes — standard EDS | No | Yes | No |
| B19 | **Resource Downloads** | Low | Cards with download links for brochures, datasheets, spec sheets | PDP pages | Variant of Cards | No | Yes | No |
| B20 | **Cookie Consent Banner** | Low | Evidon-powered dialog with Allow/Accept/Customize buttons | All pages | No — Evidon integration | Yes (Evidon) | No | No |
| B21 | **Vidyard Video Player** | Medium | Embedded video player for product demos and thought leadership | Product pages, articles | No — Vidyard embed | Yes (Vidyard) | No | No |
| B22 | **Country Selector** | Low | Accordion-style country/locale picker with flag icons | Footer | No — custom build | No | Yes | No |
| B23 | **Disclaimer/References** | Low | Small text footnotes and regulatory disclaimers (H6) | Product pages | Yes — default content | No | Yes | No |
| B24 | **Separator** | Low | Horizontal rule divider between sections | Services, product pages | Yes — standard EDS | No | Yes | No |
| B25 | **Search (Algolia)** | High | Full-featured search with autocomplete, powered by Algolia | All pages (header) | No — Algolia integration | Yes (Algolia API) | No | No |
| B26 | **Sign-in / Authentication** | Medium | User authentication flow for MyGEHealthCare portal | Header | No — custom build | Yes (auth API) | No | Yes (Medium) |
| B27 | **Shopping Cart** | Medium | Cart icon with count badge, links to Sitecore shop | Header | No — custom build | Yes (cart/eCommerce API) | No | Yes (Medium) |
| B28 | **Transition Banner** | Low | Deprecation notice banner directing users from legacy to new site | Legacy pages only | N/A — will be removed | No | No | No |

---

## 4. Page Counts by Template

| Template | Est. Pages | Auto-Migratable? | Notes |
|----------|-----------|-------------------|-------|
| T1: Homepage | 1 | No — Manual | Adobe Target personalization, complex carousel |
| T2: Product Category | ~50 | Partially | Reusable template, Marketo form needs manual setup |
| T3: Product Detail (PDP) | ~850 | Partially | Pricing/Affirm needs integration; content is structured |
| T4: Insights Hub | 1 | Yes — Automated | Simple card layout |
| T5: Article/Content | ~750 | Yes — Automated | Most structured, standardized content |
| T6: Contact Us | 1 | No — Manual | Complex form routing, reCAPTCHA |
| T7: Specialties Hub | 1 | Yes — Automated | Simple card grid |
| T8: Education/Courses | ~290 | Partially | Course catalog may be API-driven |
| T9: Services | ~30 | Partially | Complex tabs/anchor nav need custom blocks |
| T10: Shop/eCommerce | ~9 | **Out of Scope** | Different CMS (Sitecore JSS), being deprecated |
| T11: Events | ~26 | Partially | Dynamic listings need feed integration |
| T12: Campaigns | ~20 | No — Manual | Custom landing pages with unique layouts |
| T13: Newsroom/Press | ~13 | Partially | Press release feed likely API-driven |
| T14: Corporate/About | ~130 | Yes — Automated | Standard content pages |

**Migration Classification Summary:**
| Classification | Pages | % |
|---------------|-------|---|
| **Automatically Migratable** | ~930 | 43% |
| **Semi-Automated (template + adjustments)** | ~1,000 | 46% |
| **Manual Migration** | ~233 | 11% |
| **Out of Scope (Sitecore shop)** | ~9 | <1% |

---

## 5. Integrations Analysis

| # | Integration | Type | Complexity | Reference | Client/Server | Active? |
|---|------------|------|------------|-----------|---------------|---------|
| I1 | **Adobe Target** | Personalization API | High | Homepage — server-side call | Server | Active |
| I2 | **Google Tag Manager (GTM-58LKHLP)** | Tag Manager | Medium | All pages | Client | Active |
| I3 | **Google Tag Manager (GTM-W4V7GZG)** | Tag Manager | Medium | All pages | Client | Active |
| I4 | **Google Ads (AW-357630064, AW-435915669)** | Remarketing | Low | All pages via GTM | Client | Active |
| I5 | **DoubleClick (DC-10528130)** | Ad Tracking | Low | All pages via GTM | Client | Active |
| I6 | **Evidon (Crownpeak)** | Cookie Consent | Medium | All pages — banner + settings | Client | Active |
| I7 | **Marketo** | Marketing Automation / Forms | High | Product pages, campaigns — `gehc-marketo-form` | Client + Server | Active |
| I8 | **Algolia** | Search-as-a-Service | High | All pages (header search) — `aa-Form` | Client + Server | Active |
| I9 | **Vidyard** | Video Hosting/Player | Medium | Product pages, articles | Client | Active |
| I10 | **Nrich.ai** | ABM/Intent Data | Low | All pages — `j.nrich.ai/tag.js` | Client | Active |
| I11 | **AEM Dynamic Media / Scene7** | Image Delivery/DAM | Medium | All pages — `s7d9.scene7.com` | Server | Active |
| I12 | **Affirm** | Buy Now Pay Later | Medium | PDP pages, shop | Client | Active |
| I13 | **SAP Hybris** | eCommerce Backend | High | `/shop` — `gehcstorefront` | Server | Active (legacy) |
| I14 | **Google reCAPTCHA** | Bot Protection | Low | Contact Us form | Client | Active |
| I15 | **Veeva** | Pharma CRM | Medium | Homepage, campaign pages | Client + Server | Active |
| I16 | **Sitecore JSS** | Legacy CMS (React SPA) | High | `/shop` pages only | Server | Deprecated |

---

## 5b. Forms Analysis

| # | Form Type | Complexity | Sample URL | Features | Backend Integration |
|---|----------|------------|------------|----------|---------------------|
| F1 | **Algolia Search Form** | Medium | All pages (header) — `aa-Form` | Autocomplete, category filtering | Algolia API |
| F2 | **Marketo Lead Gen (Modal)** | High | `/en-us/products/ultrasound` — modal trigger | Multi-field form, progressive profiling, hidden fields, email validation | Marketo API |
| F3 | **Contact Us Routing Form** | High | `/en-us/about/contact-us` | Dropdown routing (Quote/Demo/Patient inquiry), conditional fields, reCAPTCHA | Marketo + reCAPTCHA |
| F4 | **Email Preferences** | Medium | `/en-us/about/email-preferences` | Subscription management, opt-in/out | Marketo preference center |
| F5 | **Sign-in Form** | High | Header (modal/flyout) | Authentication, MyGEHealthCare portal | Auth API (SSO/OAuth) |
| F6 | **Cookie Preferences** | Low | All pages (Evidon dialog) | Consent categories, manage/accept/reject | Evidon |
| F7 | **Cart/Checkout** | High | `/shop` (Sitecore) | Add to cart, quantity, checkout flow | SAP Hybris |

---

## 6. Offers / Personalization Analysis

| # | Offer Type | Complexity | Sample URL | Backend |
|---|-----------|------------|------------|---------|
| O1 | **Homepage Hero Personalization** | High | `/en-us` — carousel slides personalized via Adobe Target | Adobe Target (server-side) |
| O2 | **Product Recommendations** | Medium | Various product pages | Adobe Target mboxes (4 returned in API response) |
| O3 | **Geo-based Content** | Medium | All pages — country selector + locale routing | GeoIP locator (`countrymapping`) |
| O4 | **Campaign Landing Pages** | Low | `/en-us/campaigns/*` | Authored content (static) |
| O5 | **Transition Banner** | Low | Legacy pages — "outdated site experience" notice | Static rule-based |

---

## 7. Complex Use Cases & Observations

| # | Use Case | Instances | Where Found | Why It's Complex |
|---|----------|-----------|-------------|-----------------|
| C1 | **Dual CMS Architecture** | Site-wide | AEM (`/en-us/*`) + Sitecore JSS (`/shop`) | Two completely different tech stacks serve different URL paths under same domain. Migration must handle or exclude Sitecore pages |
| C2 | **Adobe Target Server-Side Personalization** | ~5+ pages | Homepage, product pages | Server-side Target calls with 4+ mboxes. EDS needs edge worker or client-side fallback |
| C3 | **Marketo Form Integration** | ~70+ pages | Product categories, campaigns, contact | Modal forms with progressive profiling, hidden fields, conditional logic |
| C4 | **Affirm Financing on PDP** | ~20+ PDPs | Handheld ultrasound, select products | Dynamic pricing display + Affirm widget requires JS integration |
| C5 | **Algolia Search** | All pages | Header search | Full-text search with autocomplete across entire product catalog + articles |
| C6 | **10+ Locale Variants** | ~12,950 URLs | Entire site | Multi-locale with path-based routing — content must be migrated per locale or use i18n |
| C7 | **Dynamic Media / Scene7** | All pages | Image delivery | Images served via Scene7 CDN with dynamic transformations — need new DAM strategy in EDS |
| C8 | **Sticky Sub-Navigation** | ~100+ pages | PDP, Services, Specialties | Fixed-position nav with scroll-aware active states and CTA buttons |
| C9 | **eCommerce Integration** | `/shop` + PDPs | Cart, checkout, pricing | SAP Hybris storefront integration, Affirm payments, user authentication |
| C10 | **Veeva CRM Integration** | Homepage, campaigns | Marketing content | Pharmaceutical CRM compliance requirements for content tracking |

---

## 8. Outlier Scenarios

| # | Scenario | Behavior | Implementation | Effort Estimate |
|---|----------|----------|----------------|----------------|
| OS1 | **Sitecore JSS Shop Pages** | Entire `/shop` section runs as React SPA on Sitecore with SAP Hybris backend | Keep as separate app or rebuild eCommerce in EDS + edge workers | Out of scope / 300+ hours if migrated |
| OS2 | **Adobe Target Server-Side Calls** | Homepage personalization via server-side Target API (4+ mboxes per page load) | Edge worker for Target API orchestration or client-side fallback | 40–60 hours |
| OS3 | **Marketo Modal Forms** | Forms loaded asynchronously via Marketo embed, triggered from product CTAs | EDS form block with Marketo API integration | 30–50 hours |
| OS4 | **Affirm Pricing Widget** | Dynamic BNPL pricing calculation embedded on PDP pages | Client-side Affirm.js integration in EDS block | 15–25 hours |
| OS5 | **Scene7 Dynamic Media** | All images served with on-the-fly transformations (resize, crop, format) | Migrate to EDS image optimization or maintain Scene7 as external CDN | 20–40 hours |
| OS6 | **Course Catalog (209 pages)** | Education/training content that may be fed from an LMS or external system | API integration or static content migration | 20–40 hours |

---

## 9. Migration Estimates

### Scope Definition
**In-Scope for EDS Migration:** ~2,163 US/EN pages (excluding Sitecore `/shop`)
**Out of Scope:** Sitecore JSS shop pages (~9), SAP Hybris eCommerce backend

### Effort Breakdown

| Phase | Activity | Hours | Days (1 FTE) |
|-------|----------|-------|-------------|
| **Phase 1: Foundation** | | | |
| | Design system extraction & EDS CSS custom properties | 40 | 5 |
| | Global header block (mega-nav + Algolia search + auth + cart) | 80 | 10 |
| | Global footer block | 24 | 3 |
| | Core EDS block library (25 custom blocks/variants) | 200 | 25 |
| | Edge worker setup (Adobe Target, APIs) | 40 | 5 |
| **Phase 2: Template Migration** | | | |
| | Template T3 (Product Detail) — ~850 pages | 120 | 15 |
| | Template T5 (Article/Content) — ~750 pages | 80 | 10 |
| | Template T2 (Product Category) — ~50 pages | 40 | 5 |
| | Template T8 (Education/Courses) — ~290 pages | 60 | 8 |
| | Template T9 (Services) — ~30 pages | 40 | 5 |
| | Templates T1, T4, T6, T7, T11-T14 — ~143 pages | 60 | 8 |
| **Phase 3: Integrations** | | | |
| | Adobe Target personalization in EDS | 60 | 8 |
| | Algolia search integration | 40 | 5 |
| | Marketo form integration | 40 | 5 |
| | Vidyard video integration | 16 | 2 |
| | Affirm financing widget | 20 | 3 |
| | Analytics (GTM) migration | 16 | 2 |
| | Third-party integrations (Evidon, Nrich, Veeva, reCAPTCHA) | 32 | 4 |
| **Phase 4: Content Migration** | | | |
| | Automated content import (~930 pages) | 60 | 8 |
| | Semi-automated content import (~1,000 pages) | 160 | 20 |
| | Manual content migration (~233 pages) | 120 | 15 |
| **Phase 5: QA & Testing** | | | |
| | Visual regression testing | 60 | 8 |
| | Functional testing (forms, search, cart, navigation) | 40 | 5 |
| | Performance testing & optimization (Lighthouse 100) | 32 | 4 |
| | Accessibility testing (WCAG 2.1 AA) | 32 | 4 |
| | UAT & stakeholder review | 40 | 5 |
| **Phase 6: Locale Rollout** | | | |
| | Multi-locale setup & content migration (9+ additional locales) | 240 | 30 |

### Summary

| Category | Hours | Days |
|----------|-------|------|
| **Foundation (Design + Blocks + Infra)** | 384 | 48 |
| **Template Migration** | 400 | 51 |
| **Integrations** | 224 | 29 |
| **Content Migration** | 340 | 43 |
| **QA & Testing** | 204 | 26 |
| **Locale Rollout** | 240 | 30 |
| **TOTAL (US/EN only)** | **1,552** | **~197 days** |
| **TOTAL (All locales)** | **1,792** | **~227 days** |

### Team Recommendation
With a team of **3–4 FTEs** (2 frontend developers, 1 integration/content specialist, 1 QA engineer):
- **US/EN migration:** ~3–4 months
- **Full multi-locale migration:** ~4–5 months
- **Total calendar time with buffer:** ~6 months

---

## Checklist

- [x] Analyze homepage structure and tech stack
- [x] Confirm CMS platform (AEM CS with `window.CQ`, `window.Granite`, `cmp-*` components)
- [x] Identify dual CMS architecture (AEM + Sitecore JSS for `/shop`)
- [x] Map main navigation structure (mega-nav with product categories)
- [x] Catalog all third-party integrations (16 integrations identified)
- [x] Identify page templates across different URL patterns (14 templates)
- [x] Analyze product/commerce page architecture (PDP with pricing, Affirm, sticky nav)
- [x] Determine sitemap scale and URL taxonomy (~2,172 unique, ~12,950 total with locales)
- [x] Catalog all reusable blocks/components (28 blocks identified)
- [x] Assess forms and their backend dependencies (7 form types)
- [x] Analyze personalization/offers (Adobe Target server-side, 5 offer patterns)
- [x] Identify complex use cases and outliers (10 complex cases, 6 outliers)
- [x] Estimate page counts per template
- [x] Classify pages as auto-migratable vs manual
- [x] Provide effort and timeline estimates
- [ ] Take representative screenshots for each template (requires Execute mode)
- [ ] Generate DOCX report (requires Execute mode)

> **Note:** Generating the DOCX report and capturing template screenshots requires switching to Execute mode.
