# ThermoFisher.com AEM AMS → EDS Migration Analysis Plan

## 1. High-Level Summary

### Site Scale
| Metric | Count |
|--------|-------|
| **US/EN CMS Content Pages** (from sitemap) | **~11,595** |
| Product Catalog Pages (`/order/catalog/product/`) | ~400,000 |
| Antibody Product Pages (`/antibody/product/`) | ~500,000–800,000 |
| Product FAQ Pages | ~34,000 |
| Product Citation Pages | ~94,000 |
| **Total Indexed URLs (entire domain)** | **~1.2–1.5 million** |
| Locale Variants (36 country/language sitemaps) | ~200,000–250,000 CMS pages |
| Max URL Depth | 11 levels (bulk at depth 4–5) |

### Thematic Page Breakdown (US/EN CMS pages — 11,595 total)

| Category | Pages | Type |
|----------|-------|------|
| **Life Science** | 3,483 | Product/Technology Marketing |
| **Industrial** | 1,967 | Product/Technology Marketing |
| **References/Protocols** | 1,547 | Technical Resources |
| **Products & Services** | 835 | Marketing / eCommerce Hub |
| **Clinical** | 639 | Product/Technology Marketing |
| **Technical Resources** | 637 | Support & Learning |
| **About Us / Corporate** | 567 | Corporate/Company |
| **Electron Microscopy** | 418 | Product Marketing |
| **Materials Science** | 282 | Product Marketing |
| **Brands** | 250 | Brand Marketing |
| **Bioprocessing** | 219 | Application Marketing |
| **Chemicals** | 163 | Product Marketing |
| **Virtual Tours** | 111 | Interactive/3D |
| **Events** | 86 | Marketing Events |
| **Other (30+ sections)** | ~300 | Mixed |

### Pages by Content Type
| Type | Estimated % | Estimated Pages |
|------|------------|-----------------|
| **Static Authored (CMS)** | ~85% | ~9,850 |
| **Dynamic/API-Driven** | ~10% | ~1,160 |
| **Hybrid (Static + Dynamic)** | ~5% | ~585 |

### Pages Integrated with eCommerce
- Product Detail Pages (PDP): ~400,000+ (separate React SPA, NOT AEM-managed)
- Store pages (`/store/v2/`): Quick Order, Contact Us, Order Status — separate app, auth-gated
- Homepage has embedded eCommerce carousel with Add-to-Cart functionality

### Pages Fed from Other Systems
- Blog posts (`/blog/`) — WordPress or similar CMS
- Corporate site (`corporate.thermofisher.com`) — separate AEM instance
- Careers (`jobs.thermofisher.com`) — recruitment platform
- Investor Relations (`ir.thermofisher.com`) — IR platform
- Newsroom (`newsroom.thermofisher.com`) — news/PR platform

### Design System Analysis
- **Komodo Design System** — Primary design system with `kmd-*` utility classes (homepage)
- **AEM Core Components** — `cmp-*` class naming convention (modern content pages)
- **AEM Classic** — `parsys`, `cq-colctrl` patterns (older pages)
- **Store Platform** — `pdp-*`, `pragma-*` classes (eCommerce pages)
- **No unified design system** — multiple coexisting systems indicate organic growth over time

---

## 2. Templates Inventory

| # | Template Name | Complexity | Example URL(s) | Description |
|---|--------------|------------|-----------------|-------------|
| T1 | **Homepage** | High | `/us/en/home.html` | Hero pods, product carousel (API-driven), blog cards, promotional cards, eCommerce integration. Uses `kmd-*` Komodo design system + `cmp-*` AEM components. Hybrid static + dynamic content. |
| T2 | **Category Hub (Full-Width)** | Medium | `/us/en/home/life-science/antibodies.html` | Hero with text overlay, icon link lists, card grids, section dividers. Modern AEM with `cmp-*` components and `aem-Grid` responsive layout. |
| T3 | **Category Hub (Sidebar)** | Medium | `/us/en/home/life-science/pcr.html`, `/us/en/home/life-science/cell-culture.html` | Left sidebar navigation + main content area. AEM Classic with `parsys` containers. Carousel banners, product filmstrips, 3-column link grids. |
| T4 | **Brand Page (Text-Heavy)** | Medium | `/us/en/home/brands/thermo-scientific.html` | Left sidebar with categorized links, anchor navigation, 2-column product link lists. AEM Classic. |
| T5 | **Brand Page (Visual)** | Medium | `/us/en/home/brands/gibco.html` | Full-width, card-grid layout with Brightcove video integration, promotional CTAs. No sidebar. |
| T6 | **Solutions/Application Landing** | Medium | `/us/en/home/bioprocessing.html`, `/us/en/home/digital-solutions.html` | Full-width hero, anchor navigation, alternating image+text content blocks, video embeds. Modern AEM `cmp-*` components. |
| T7 | **Product Directory** | Medium | `/us/en/home/order.html` | Collapsible table-of-contents, 3-column category link grids, API-loaded promo teasers. |
| T8 | **Promotions Hub** | Low | `/us/en/home/products-and-services/promotions.html` | Minimal static shell, filter buttons, dynamic promotional card grid loaded via API. |
| T9 | **Technical Resource/Support** | Low–Medium | `/us/en/home/support.html`, `/us/en/home/technical-resources/learning-centers.html` | Content-focused pages with link lists, resource cards. |
| T10 | **Events Page** | Medium | `/us/en/home/events.html` | Dynamic event listings, likely API-driven. |
| T11 | **Product Detail Page (PDP)** | High | `/order/catalog/product/11965092` | **NOT AEM** — React SPA with web components. Full eCommerce: pricing, stock, add-to-cart, tabs, citations, Q&A. |
| T12 | **Search Results** | High | `/search/results?query=antibodies` | **NOT AEM** — Standalone JS SPA with faceted search, filters, pagination. |
| T13 | **Store/Commerce App** | High | `/store/v2/quick-order`, `/store/v2/contact-us` | **NOT AEM** — Separate auth-gated application. |
| T14 | **Specialty Subsites** | Low–Medium | `/allergy/`, `/onelambda/`, `/bindingsite/` | Smaller microsites with locale variants, simpler layouts. |

---

## 3. Blocks Catalog

| # | Block Name | Complexity | Description & Behavior | Reference URL(s) | Standard EDS Block? | Backend Service Needed? | LLM-Ready? | UI Extension? |
|---|-----------|------------|----------------------|-------------------|---------------------|------------------------|------------|---------------|
| B1 | **Global Header** | High | Logo, mega-nav with multi-level dropdowns, search bar (SearchBar v2 with Endeca), utility links (Order Status, Quick Order, Sign In, Cart), promotional offer banner, hamburger mobile menu | All pages | No — custom build | Yes (search API, cart API, auth) | No | No |
| B2 | **Global Footer** | Medium | 6-column link grid (Ordering, Support, Resources, About, Portfolio, Brands), legal links, copyright, country selector, cookie preferences | All pages | No — custom build | No | No | No |
| B3 | **Hero Pod** | Medium | Large hero image + headline + subtitle + CTA button, with 3 sub-hero cards below. Uses `tf-hero-pod` class. | Homepage | Variant of Hero | No | Yes | No |
| B4 | **Page Heading Hero** | Low | Text overlay hero with H1, subtitle, optional CTA. Uses `cmp-pageheadinghero` | Category pages (antibodies, bioprocessing) | Variant of Hero | No | Yes | No |
| B5 | **Product Offers Carousel** | High | Scrollable product cards with images, pricing (strikethrough + sale), "Add to cart" buttons. API-loaded from Adobe Target recommendations. Carousel with prev/next navigation. | Homepage | No — custom build | Yes (Target API, pricing API, cart API) | No | No |
| B6 | **Promotional Cards** | Medium | Image + headline + CTA + badge label (e.g., "22% OFF", "SAVE BIG"). Grid layout, 4 cards per row. | Homepage, Promotions page | Variant of Cards | No | Yes | No |
| B7 | **Education/Featured Cards** | Medium | Large featured card with image, description, bullet list + smaller companion cards. 2-column layout. | Homepage ("Featured Education") | Variant of Cards | No | Yes | No |
| B8 | **Blog/Article Cards** | Low | Image + title + author + date + "Read Article" link. 3-column grid. | Homepage ("Accelerating Science") | Variant of Cards | Possibly (blog API) | Yes | No |
| B9 | **New Product Cards** | Low | Image + headline + CTA link. 3-column grid. | Homepage ("New products") | Variant of Cards | No | Yes | No |
| B10 | **Category Link Grid** | Low | 3-column or 2-column lists of category links, sometimes with icons. Heavily used across hub pages. | Category hubs, Brand pages | Variant of Columns | No | Yes | No |
| B11 | **Sidebar Navigation** | Medium | Left sidebar with categorized link lists ("Popular products", "Key applications"), collapsible sections. | Brand pages, Category pages (PCR, Cell Culture) | No — custom build | No | Yes | No |
| B12 | **Anchor Navigation** | Low | In-page scroll navigation with anchor links to sections. | Brand pages, Solutions pages | No — custom build | No | Yes | No |
| B13 | **Image + Text (Alternating)** | Low | Side-by-side image and text blocks, alternating left/right. Uses `cmp-textimage`. | Solutions pages (bioprocessing) | Variant of Columns | No | Yes | No |
| B14 | **Video Player** | Medium | Brightcove/Video.js embedded player for product videos. | Gibco brand page, Digital Solutions | No — custom build (Brightcove embed) | Yes (Brightcove) | No | No |
| B15 | **Product Filmstrip/Carousel** | Medium | Horizontal scrolling product cards with prev/next. Featured products section. | Category pages (PCR, Cell Culture) | Variant of Carousel | No | Yes | No |
| B16 | **Promotional Banner Bar** | Low | Top-of-page promotional bar with rotating text + link. Clickable. | All pages (header) | No — custom build | Possibly (personalization) | No | No |
| B17 | **Table of Contents (Collapsible)** | Low | Expandable/collapsible navigation for long content pages. | Product Directory | No — custom build | No | Yes | No |
| B18 | **Filter Buttons** | Low | Client-side content filtering (e.g., "All", "Percentage Off", "Special Deal"). | Promotions page | No — custom build | No | Yes | No |
| B19 | **Contact Department Cards** | Medium | 6 clickable department selection cards for customer service routing. | Contact page (store) | Variant of Cards | Yes (routing, chat) | No | No |
| B20 | **Dynamic Offer/Teaser** | Medium | API-loaded promotional teasers using Adobe Target. Uses `aem-offer-container`, `dynamic-offer`. | Homepage, various pages | No — custom build | Yes (Adobe Target) | No | No |
| B21 | **Search Bar** | High | Full-featured search with category selector, autocomplete, SearchBar v2 with Endeca provider, Signals tracking. | All pages (header) | No — custom build | Yes (Endeca/search API) | No | No |
| B22 | **Cookie Consent Banner** | Low | TrustArc-powered cookie preferences modal with Accept/Reject/Manage. | All pages | No — TrustArc integration | Yes (TrustArc) | No | No |
| B23 | **Separator** | Low | Horizontal rule divider between sections. Uses `cmp-separator`. | Many pages | Yes — standard EDS | No | Yes | No |
| B24 | **CTA List** | Low | Grouped call-to-action buttons. Uses `cmp-ctalist`, `cmp-ctaitem`. | Category pages | Variant of Buttons | No | Yes | No |
| B25 | **Section Container** | Low | Wrapper component for grouping content sections. Uses `cmp-sectioncontainer`. | Modern AEM pages | Yes — EDS Section | No | Yes | No |
| B26 | **Feedback Button** | Low | Kampyle/Medallia feedback widget trigger. Fixed position. | All pages | No — Kampyle integration | Yes (Kampyle SDK) | No | No |
| B27 | **Chat Launcher** | Medium | Vue.js-based chat widget from `chat-api.thermofisher.com`. | All pages | No — custom build | Yes (chat API) | No | No |
| B28 | **Accessibility Menu** | Low | UserWay accessibility widget with skip-to-content, navigation aids. | All pages | No — UserWay integration | Yes (UserWay) | No | No |
| B29 | **Country Selector** | Low | Country/locale picker with flag icons. | Footer | No — custom build | No | Yes | No |

---

## 4. Page Counts by Template

| Template | Est. Pages | Auto-Migratable? | Notes |
|----------|-----------|-------------------|-------|
| T1: Homepage | 1 | No — Manual | Complex hybrid layout, API-driven content |
| T2: Category Hub (Full-Width) | ~2,000 | Partially | Static content migratable; dynamic elements need rebuild |
| T3: Category Hub (Sidebar) | ~3,000 | Partially | Sidebar nav pattern needs custom EDS block |
| T4: Brand Page (Text-Heavy) | ~100 | Partially | Individually authored — no single template |
| T5: Brand Page (Visual) | ~150 | Partially | Video integration needs Brightcove setup |
| T6: Solutions/Application Landing | ~500 | Partially | Anchor nav and alternating blocks need custom work |
| T7: Product Directory | ~50 | No — Manual | Collapsible TOC, massive link directories |
| T8: Promotions Hub | ~50 | No — Manual | Primarily API-driven content |
| T9: Technical Resource/Support | ~2,500 | Yes — Automated | Mostly static authored content |
| T10: Events Page | ~100 | No — Manual | Dynamic event listings |
| T11: PDP (React SPA) | ~400,000 | **Out of Scope** | Not AEM content — separate commerce platform |
| T12: Search Results (SPA) | N/A | **Out of Scope** | Standalone application |
| T13: Store/Commerce App | N/A | **Out of Scope** | Separate auth-gated application |
| T14: Specialty Subsites | ~500 | Yes — Automated | Simpler layouts, static content |

**Summary:**
- **~4,000 pages** (35%) can be **automatically migrated** (standardized templates, static data)
- **~5,850 pages** (50%) require **semi-automated migration** (template conversion + manual adjustments)
- **~1,745 pages** (15%) require **manual migration** (dynamic, custom, complex logic)
- **~400,000+ pages OUT OF SCOPE** (eCommerce PDP, Search, Store — not AEM CMS content)

---

## 5. Integrations Analysis

| # | Integration | Type | Complexity | Reference URL(s) | Client/Server | Active? |
|---|------------|------|------------|-------------------|---------------|---------|
| I1 | **Adobe Experience Platform (AEP) Web SDK / Alloy** | Analytics/CDP | High | All pages — `cdn1.adoberesources.net/alloy/2.23.0/alloy.min.js` | Client | Active |
| I2 | **Adobe Launch (DTM)** | Tag Manager | Medium | All pages — `assets.adobedtm.com/.../launch-f46125d37e44.min.js` | Client | Active |
| I3 | **Adobe Target** | Personalization | High | Homepage — recommendations API, dynamic offers, `aem-offer-container` | Client + Server | Active |
| I4 | **Endeca Search** | Search Engine | High | All pages — SearchBar v2, `/etc/thermo/endeca/focusAreas/` | Client + Server | Active |
| I5 | **Kampyle / Medallia** | Feedback/Survey | Medium | All pages — `nebula-cdn.kampyle.com` | Client | Active |
| I6 | **TrustArc** | Cookie Consent | Low | All pages — `consent.trustarc.com` | Client | Active |
| I7 | **UserWay** | Accessibility | Low | All pages — `cdn.userway.org` | Client | Active |
| I8 | **Brightcove / Video.js** | Video Hosting | Medium | Brand pages, Solutions pages | Client | Active |
| I9 | **Chat Widget (Vue.js)** | Live Chat | Medium | All pages — `chat-api.thermofisher.com` | Client + Server | Active |
| I10 | **eCommerce / Cart API** | Commerce | High | Homepage, PDP — `/api/store/`, cart details preload | Client + Server | Active |
| I11 | **jQuery + jQuery Migrate 3.4.1** | Legacy Framework | Low | All AEM pages | Client | Active (deprecated) |
| I12 | **Signals Search Analytics** | Search Analytics | Low | All pages — search signal capture | Client | Active |
| I13 | **Store Platform (React)** | eCommerce SPA | High | `/store/v2/`, `/order/catalog/product/` | Client + Server | Active |

---

## 5b. Forms Analysis

| # | Form Type | Complexity | Sample URL | Backend Integration |
|---|----------|------------|------------|---------------------|
| F1 | **Search Form** (Header) | High | All pages — `#smartsearch` | Endeca search API |
| F2 | **Contact Us Form** | Medium | `/store/v2/contact-us?enableChat=true` | Store platform (not AEM) |
| F3 | **Sign In / Account** | High | Account dropdown | Auth system (SSO/OAuth) |
| F4 | **Quick Order** | High | `/store/v2/quick-order` | Store/cart API (auth-gated) |
| F5 | **Add to Cart** | Medium | Homepage carousel, PDP | Cart API (`/api/store/`) |
| F6 | **Cookie Preferences** | Low | All pages (TrustArc modal) | TrustArc |
| F7 | **Feedback Form** | Low | All pages (Kampyle widget) | Kampyle/Medallia |

---

## 6. Offers / Personalization Analysis

| # | Offer Type | Complexity | Sample URL | Backend |
|---|-----------|------------|------------|---------|
| O1 | **Header Promotional Banner** | Medium | All pages — rotating offer bar | Likely Adobe Target or authored |
| O2 | **Online Offers Carousel** | High | Homepage — 24 products with pricing | Adobe Target recommendations + Pricing API |
| O3 | **Dynamic Teasers** | Medium | Various pages — `aem-offer-container` | Adobe Target |
| O4 | **Promotional Cards (Curated)** | Low | Homepage "Promotions" section | Authored (static) |
| O5 | **Product-Level Promotions** | Medium | PDP — promo badges, coupon codes | Store API |

---

## 7. Complex Use Cases & Observations

| # | Use Case | Instances | Where Found | Why It's Complex |
|---|----------|-----------|-------------|-----------------|
| C1 | **Multi-Platform Architecture** | Site-wide | Header, PDP, Search, Store | Three separate tech stacks (AEM Classic, Modern AEM, React Store) must be unified or integrated |
| C2 | **Adobe Target Personalization** | ~50+ pages | Homepage, category pages | Dynamic content loaded via Target API requires edge-side personalization in EDS |
| C3 | **Endeca Search Integration** | All pages | Header search bar | Deep search integration with category-specific focus areas, autocomplete |
| C4 | **eCommerce Cart on CMS Pages** | Homepage + others | "Add to cart" buttons on authored pages | CMS pages embed live commerce functionality (pricing, stock, cart) |
| C5 | **Mega Navigation (Multi-Level)** | All pages | Header | Complex mega-nav with dynamic content, popular products, images |
| C6 | **Brand Page Inconsistency** | ~250 pages | `/us/en/home/brands/*` | No consistent template — each brand page is individually authored with different layouts |
| C7 | **Legacy jQuery Dependency** | All AEM pages | Global scripts | jQuery Migrate 3.4.1 + deprecated API usage throughout |
| C8 | **36 Locale Variants** | ~250,000 pages | Entire site | Multi-country, multi-language with locale-specific content and redirects |
| C9 | **Aggressive Redirects** | Multiple pages | support.html → order.html, industrial.html → quick-order | URL-level routing that transforms CMS paths to app endpoints |
| C10 | **Chat Widget (Custom Vue.js)** | All pages | Footer/floating | Custom-built chat launcher needs reimplementation or embedding strategy |

---

## 8. Outlier Scenarios

| # | Scenario | Behavior | Implementation | Complexity Estimate |
|---|----------|----------|----------------|-------------------|
| OS1 | **Product Offers Carousel** (Homepage) | Full section rendered via API — Target recommendations → pricing API → cart API. No static fallback. | Custom EDS block with edge worker for API orchestration | 40–60 hours |
| OS2 | **Product Detail Pages** (400K+ pages) | Entire page is a React SPA with web components (`core-tooltip`, `core-quantityselector`, etc.) | Keep as separate app or rebuild as EDS + edge workers | Out of scope / 500+ hours if migrated |
| OS3 | **Search Results SPA** | Client-side rendered, anti-bot protections, faceted search with filters | Keep as separate app or integrate EDS-compatible search | Out of scope / 200+ hours if migrated |
| OS4 | **Virtual/3D Tours** (111 pages) | Interactive 3D product experiences | Embed strategy in EDS iframe/web component | 20–30 hours |
| OS5 | **Dynamic Offer Containers** | `aem-offer-container` divs filled by Target at runtime | Edge worker or client-side personalization in EDS | 30–40 hours |
| OS6 | **Blog Integration** | Blog posts from `/blog/` subdirectory (likely WordPress) | RSS/API feed integration or migrate to EDS | 40–80 hours |

---

## 9. Migration Estimates

### Scope Definition
**In-Scope for EDS Migration:** ~11,595 US/EN CMS content pages
**Out of Scope:** PDP (React SPA), Search Results (SPA), Store App (auth-gated), external subdomains

### Effort Breakdown

| Phase | Activity | Hours | Days (1 FTE) |
|-------|----------|-------|-------------|
| **Phase 1: Foundation** | | | |
| | Design system extraction & EDS CSS custom properties | 80 | 10 |
| | Global header block (mega-nav + search + cart integration) | 120 | 15 |
| | Global footer block | 40 | 5 |
| | Core EDS block library (23+ custom blocks) | 320 | 40 |
| | Edge worker setup (personalization, pricing APIs) | 80 | 10 |
| **Phase 2: Template Migration** | | | |
| | Template T2 (Category Hub Full-Width) — ~2,000 pages | 160 | 20 |
| | Template T3 (Category Hub Sidebar) — ~3,000 pages | 200 | 25 |
| | Template T9 (Technical Resources) — ~2,500 pages | 120 | 15 |
| | Template T6 (Solutions Landing) — ~500 pages | 80 | 10 |
| | Template T4/T5 (Brand Pages) — ~250 pages | 80 | 10 |
| | Templates T1, T7, T8, T10, T14 — ~700 pages | 120 | 15 |
| **Phase 3: Integrations** | | | |
| | Adobe Target personalization in EDS | 80 | 10 |
| | Endeca search integration | 60 | 8 |
| | eCommerce/Cart API integration | 80 | 10 |
| | Chat widget migration | 40 | 5 |
| | Analytics (AEP/Launch) migration | 40 | 5 |
| | Third-party integrations (UserWay, TrustArc, Kampyle, Brightcove) | 60 | 8 |
| **Phase 4: Content Migration** | | | |
| | Automated content import (~4,000 pages) | 120 | 15 |
| | Semi-automated content import (~5,850 pages) | 320 | 40 |
| | Manual content migration (~1,745 pages) | 240 | 30 |
| **Phase 5: QA & Testing** | | | |
| | Visual regression testing | 120 | 15 |
| | Functional testing (forms, search, cart, navigation) | 80 | 10 |
| | Performance testing & optimization (Lighthouse 100) | 60 | 8 |
| | Accessibility testing (WCAG 2.1 AA) | 60 | 8 |
| | UAT & stakeholder review | 80 | 10 |
| **Phase 6: Locale Rollout** | | | |
| | Multi-locale setup & content migration (35 additional locales) | 400 | 50 |

### Summary

| Category | Hours | Days |
|----------|-------|------|
| **Foundation (Design + Blocks + Infra)** | 640 | 80 |
| **Template Migration** | 760 | 95 |
| **Integrations** | 360 | 46 |
| **Content Migration** | 680 | 85 |
| **QA & Testing** | 400 | 51 |
| **Locale Rollout** | 400 | 50 |
| **TOTAL (US/EN only)** | **2,840** | **~355 days** |
| **TOTAL (All locales)** | **3,240** | **~405 days** |

### Team Recommendation
With a team of **4–5 FTEs** (2 frontend developers, 1 integration specialist, 1 content migration specialist, 1 QA engineer):
- **US/EN migration:** ~4–5 months
- **Full multi-locale migration:** ~6–7 months
- **Total calendar time with buffer:** ~8–9 months

---

## Checklist

- [x] Analyze homepage structure and tech stack
- [x] Identify CMS platform(s) and design systems
- [x] Map main navigation structure
- [x] Catalog all third-party integrations
- [x] Identify page templates across different URL patterns
- [x] Analyze product/commerce page architecture
- [x] Determine sitemap scale and URL taxonomy
- [x] Catalog all reusable blocks/components
- [x] Assess forms and their backend dependencies
- [x] Analyze personalization/offers (Adobe Target)
- [x] Identify complex use cases and outliers
- [x] Estimate page counts per template
- [x] Classify pages as auto-migratable vs manual
- [x] Provide effort and timeline estimates
- [ ] Generate DOCX report (requires Execute mode)
- [ ] Take representative screenshots for each template (requires Execute mode)

> **Note:** Generating the DOCX report and capturing template screenshots requires switching to Execute mode.
