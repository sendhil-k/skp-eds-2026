# Amazon Alexa Website Migration Analysis Report
## Comprehensive Site Inventory & AEM Edge Delivery Services Migration Scoping

**Date:** May 4, 2026  
**Subject Sites:**  
- Consumer Portal: https://alexa.amazon.com (Alexa+ landing, user-facing)
- Developer Portal: https://developer.amazon.com/en-US/alexa (Alexa Developer ecosystem)
- Amazon Storefront: https://www.amazon.com/alexa (product/commerce pages - partially accessible)

---

## Executive Summary

The Amazon Alexa web presence spans three distinct domains with fundamentally different architectures. The consumer portal (alexa.amazon.com) is a lightweight marketing/sign-in gateway. The developer portal (developer.amazon.com/en-US/alexa) is a comprehensive developer documentation and community hub with ~120+ pages. The Amazon.com product pages (www.amazon.com/alexa) are deeply embedded in Amazon's eCommerce platform and are **not viable for EDS migration** due to tight commerce integration.

**Scope Recommendation:** Focus EDS migration on the **Alexa Developer Portal** (~120 pages) and **Alexa Consumer Landing** (~8-10 pages). Exclude Amazon.com commerce pages which require Amazon's proprietary retail infrastructure.

---

## 1. High-Level Summary

### 1.1 Current Technology Stack

| Layer | Technology | Evidence |
|-------|-----------|----------|
| **Platform (Consumer)** | Amazon proprietary (server-rendered) | m.media-amazon.com CDN, fls-na.amazon.com tracking |
| **Platform (Developer)** | AWS-based CMS/Portal Framework | CloudFront CDN (ds6yc8t7pnx74.cloudfront.net) |
| **Frontend** | Vanilla HTML/CSS/JS + proprietary framework | No React/Vue/Angular detected, semantic HTML |
| **CDN** | Amazon CloudFront | CloudFront distribution domains |
| **Media** | Amazon Media Services | m.media-amazon.com asset delivery |
| **Video** | Embedded video player (proprietary) | Video carousel on consumer pages |
| **Search** | Custom developer search | settingsUrl CloudFront endpoint for search data |
| **Forms** | Qualtrics (surveys/newsletter) | Referenced in newsletter and feedback forms |
| **Auth** | Amazon SSO / OpenID | signin gateway, OpenID parameters |
| **Analytics** | Amazon internal (fls-na pixel tracking) | Batch pixel processing |
| **i18n** | URL path-based + language selector | 9+ languages (EN, JP, FR, IT, DE, ES, PT, AR, HI) |
| **Code Hosting** | GitHub | github.com/alexa repositories |
| **Community** | Slack, Stack Overflow, Forums | Multiple community integration points |
| **Learning** | Sana LMS (alexa.sana.ai) | Course hosting external platform |

### 1.2 Pages by Thematic Breakdown

| Theme/Section | Pages (Est.) | Type |
|---------------|-------------|------|
| **Consumer Landing (Alexa+)** | 5-8 | Marketing |
| **Developer Hub/Homepage** | 3-5 | Marketing/Portal |
| **Alexa Skills Kit** | 15-20 | Product/Documentation |
| **Device Makers** | 10-12 | Product/Documentation |
| **Solution Providers** | 8-10 | Directory/Marketing |
| **Alexa AI / SDKs** | 5-8 | Product/Technical |
| **Alexa Smart Properties** | 8-10 | Vertical Marketing |
| **Programs (Startups/Fund/Prize)** | 12-15 | Program/Community |
| **Branding Guidelines** | 6-8 | Asset/Guidelines |
| **Training & Workshops** | 5-8 | Educational |
| **Blog Hub/Categories** | 8-10 | Content/Blog |
| **Champions/Community** | 3-5 | Community |
| **Voice Interoperability** | 3-5 | Technical/Standards |
| **Documentation Hubs** | 10-12 | Documentation |
| **Legal/Support** | 5-8 | Administrative |
| **TOTAL (Migratable)** | **~108-144** | |

### 1.3 Pages by Corporate/Marketing Breakdown

| Category | Count | Examples |
|----------|-------|---------|
| **Corporate/Company** | 5-8 | About Alexa, Trust & Privacy, Voice Interoperability |
| **Marketing (by menu structure):** | | |
| — Skill Builders | 15-20 | Skills Kit, Custom Skills, Start, Grow Business |
| — Device Makers | 10-12 | Built-in, Connected Devices, Alexa Auto |
| — Solution Providers | 8-10 | IoT providers, Agencies, ACK |
| — Products/AI | 8-10 | Alexa AI, Routines Kit, Radio Skills, Smart Home |
| — Programs | 12-15 | Startups, Fund, Prize, Champions, Fellowship |
| **eCommerce-integrated** | 15-20 | Echo device pages, shop links (on Amazon.com - excluded) |
| **Fed from external systems** | 8-10 | Blog (CMS), Training (Sana LMS), Champions (DB) |

### 1.4 Static vs Dynamic Data Design

| Category | Pages | % | Description |
|----------|-------|---|-------------|
| **Static/Marketing** | 75-85 | 60% | Product pages, landing pages, program info, guidelines |
| **Semi-Dynamic** | 25-35 | 25% | Blog listings, champion profiles, partner directories |
| **Dynamic/Tool-Based** | 15-20 | 15% | Developer console, search, training platform, forums |
| **TOTAL** | **~120** | 100% | |

### 1.5 Design System Analysis

**Developer Portal:** Uses a consistent but proprietary design system characterized by:
- Modular card-based layouts with consistent spacing
- Global navigation with multi-level dropdowns (Skill Builders, Device Makers, Solution Providers)
- CloudFront-hosted static assets and shared icon library
- Consistent footer pattern across all pages (Resources, Support, Legal, Social, Language)
- Blue/dark color palette with Amazon orange accents
- Newsletter signup component ("Voice Mail") appears across pages
- Quote/testimonial blocks with executive attribution

**Consumer Portal:** Minimal design system with:
- Progressive disclosure patterns
- Alternating text/image layouts
- Video carousel with thumbnail previews
- Feature icon grid (3-column)
- White/clean aesthetic with blue accents

**Gap:** No formal documented design system (beyond the Branding Guidelines pages which cover Alexa product branding, not the web portal UI).

---

## 2. Templates Inventory

| # | Template Name | Complexity | Reasoning | Example URL(s) |
|---|--------------|-----------|-----------|----------------|
| 1 | **Consumer Landing** | Medium | Hero + feature grid + video carousel + exploration cards, video player integration | https://alexa.amazon.com, https://alexa.amazon.com/about |
| 2 | **Developer Portal Hub** | Medium | Multi-level nav, hero, 4-column action cards, feature section, newsletter | https://developer.amazon.com/en-US/alexa |
| 3 | **Product/SKU Marketing** | Medium | Hero, value propositions, feature blocks, case studies, testimonials, CTAs | https://developer.amazon.com/en-US/alexa/alexa-skills-kit |
| 4 | **Technical Product Detail** | Medium | Breadcrumb, overview, how-it-works diagram, key features, categories, changelog table | https://developer.amazon.com/en-US/alexa/alexa-skills-kit/get-deeper/custom-skills |
| 5 | **Vertical Marketing** | Medium | Hero, vertical-specific cards, customer success carousel, benefit pillars | https://developer.amazon.com/en-US/alexa/alexa-smart-properties |
| 6 | **Program/Community** | Medium | Vision statement, portfolio grid, news cards, CTA | https://developer.amazon.com/en-US/alexa/alexa-startups |
| 7 | **Getting Started/Tutorial** | Medium | Progressive learning paths, course cards with duration, video embeds, community links | https://developer.amazon.com/en-US/alexa/alexa-skills-kit/start |
| 8 | **Training Catalog** | Low | Course listing cards with duration, sequential numbering, launch buttons | https://developer.amazon.com/en-US/alexa/trainings_and_workshops |
| 9 | **People/Champions** | Medium | Geographic tabs, profile cards in responsive grid, social links | https://developer.amazon.com/alexa/champions |
| 10 | **Blog Hub** | Low | Category cards with icons, 4-column grid, navigation | https://developer.amazon.com/en-US/blogs/alexa |
| 11 | **Brand Guidelines** | Medium | Left sidebar nav, expandable sections, asset specifications, compliance content | https://developer.amazon.com/en-US/alexa/branding/alexa-guidelines |
| 12 | **Solution Provider Directory** | Medium | Category overview, provider type cards, learn-more routing | https://developer.amazon.com/en-US/alexa/solution-providers |
| 13 | **Feature Updates/Changelog** | Low | Release type definitions, locale availability table, documentation links | https://developer.amazon.com/en-US/alexa/alexa-skills-kit/new/feature-updates |
| 14 | **AI/SDK Showcase** | High | Hero, SDK integration cards, video case studies (5+), partner testimonials, multi-CTA | https://developer.amazon.com/en-US/alexa/alexa-ai |
| 15 | **Standards/Initiative** | Medium | Video hero, mission pillars, executive quotes, member showcase, resource cards | https://developer.amazon.com/en-US/alexa/voice-interoperability |

---

## 3. Blocks/Components Catalog

### 3.1 Navigation & Layout

| # | Block Name | Complexity | Description | EDS Standard | Backend | Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|---------|-------------|--------------|
| 1 | **Global Dev Nav** | High | Multi-level dropdown with 8+ categories, ~60 links, language selector, sign-in | Custom nav block | No | No | Medium (dropdown logic) |
| 2 | **Consumer Nav** | Low | Simple header with logo, sign-in, 2-3 links | Standard header | No | No | No |
| 3 | **Multi-Column Footer** | Medium | 5-section footer with resources, support, legal, social, language picker | Standard footer variant | No | No | No |
| 4 | **Breadcrumb** | Low | Hierarchical path navigation | Standard EDS | No | No | No |
| 5 | **Left Sidebar Nav** | Medium | Expandable sections, active state highlighting (used in Branding) | Custom block | No | No | Low |

### 3.2 Hero & Banner Components

| # | Block Name | Complexity | Description | Reference URL | EDS Standard | Backend | Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|--------------|---------|-------------|--------------|
| 6 | **Marketing Hero** | Medium | Full-width headline + subhead + CTA button + optional image | Developer hub | Standard hero variant | No | No | No |
| 7 | **Consumer Hero** | Medium | Headline + sign-in CTA + feature tagline, minimal design | alexa.amazon.com | Standard hero variant | No | No | No |
| 8 | **Video Hero** | Medium | Hero section with embedded video player | Voice Interoperability | Hero variant | No | No | Low (video embed) |
| 9 | **Feature Announcement Banner** | Low | Highlighted new feature/news with link | Built-in devices page | Standard banner | No | No | No |

### 3.3 Card Components

| # | Block Name | Complexity | Description | Reference URL | EDS Standard | Backend | Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|--------------|---------|-------------|--------------|
| 10 | **Action Card (4-col)** | Medium | Icon + title + description + CTA, used in developer hub grids | Developer hub | Cards block variant | No | No | No |
| 11 | **Feature Card (3-col)** | Low | Icon + heading + text, consumer feature pillars | alexa.amazon.com | Columns variant | No | No | No |
| 12 | **Course Card** | Low | Title + description + duration + "Launch" CTA | Training page | Cards variant | No | No | No |
| 13 | **Skill Type Card** | Medium | Icon + category name + description + "Learn More" link (9 types) | Skills Kit page | Cards variant | No | No | No |
| 14 | **Case Study Card** | Medium | Video thumbnail + partner name + description + play trigger | Alexa AI page | Cards variant | No | No | Low (video) |
| 15 | **Partner Logo Grid** | Low | Grid of 12+ brand logos (Sonos, Bose, JBL, etc.) | Built-in devices | Standard logo grid | No | No | No |
| 16 | **Profile Card (Champion)** | Low | Name + location + "Learn more" link | Champions page | Cards variant | Possible (DB) | No | No |
| 17 | **Blog Category Card** | Low | Icon + title + description + "Read" CTA | Blog hub | Cards variant | No | No | No |
| 18 | **News/Press Card** | Low | Headline + source + "Read More" link | Startups/Fund page | Cards variant | No | No | No |
| 19 | **Vertical Industry Card** | Medium | Image + vertical name + description + CTA (hospitality, senior living) | Smart Properties | Cards variant | No | No | No |
| 20 | **Resource Card** | Low | Icon/image + title + description link (3-column footer pattern) | Consumer page | Cards variant | No | No | No |

### 3.4 Content & Educational Components

| # | Block Name | Complexity | Description | Reference URL | EDS Standard | Backend | Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|--------------|---------|-------------|--------------|
| 21 | **Value Proposition Block** | Low | Heading + paragraph + optional CTA, alternating left/right layouts | Skills Kit, Smart Properties | Standard columns | No | No | No |
| 22 | **Statistics/Social Proof** | Low | Large numbers + context text ("billions of times each week") | Grow Business | Custom block | No | No | No |
| 23 | **Executive Quote/Testimonial** | Low | Photo + quote + name + title + company | Alexa AI, Voice Interop | Standard quote block | No | No | No |
| 24 | **Step-by-Step Process** | Low | Numbered steps with progressive disclosure | Getting Started | Columns/steps variant | No | No | No |
| 25 | **Comparison/Feature Table** | Medium | Multi-column table with release types, locale availability | Feature Updates | Standard table block | No | No | No |
| 26 | **Mission Pillars** | Low | 4-column grid with icon + title + text (mission/values) | Voice Interoperability | Columns variant | No | No | No |
| 27 | **SDK Integration Block** | Medium | SDK name + description + action CTA, technical marketing | Alexa AI | Custom block | No | No | No |

### 3.5 Interactive Components

| # | Block Name | Complexity | Description | Reference URL | EDS Standard | Backend | Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|--------------|---------|-------------|--------------|
| 28 | **Video Carousel** | High | 4-slot rotating video previews with play triggers, navigation arrows | alexa.amazon.com | Custom block | No | No | Medium (player) |
| 29 | **Customer Success Carousel** | Medium | Rotating case study cards with navigation | Smart Properties | Carousel block | Possible | No | Low |
| 30 | **Newsletter Signup Form** | Low | Email input + subscribe CTA ("Voice Mail") | Multiple pages | Standard form block | Yes - Qualtrics | No | No |
| 31 | **Language Selector** | Low | Dropdown with 9+ language options | All pages | Custom nav element | No | No | No |
| 32 | **Search** | High | Developer portal search with CloudFront data index | All dev portal pages | Custom block | Yes - search API | Yes - index | Medium |
| 33 | **Geographic Tabs** | Medium | Tab navigation (#americas, #europe, #asia-pacific) with section switching | Champions | Tabs block | No | No | Low |
| 34 | **Sign-In Button/Gateway** | Medium | Amazon SSO redirect with referral tracking | All pages | Custom CTA | Yes - Amazon auth | No | No |

### 3.6 Utility & Structural Components

| # | Block Name | Complexity | Description | Reference URL | EDS Standard | Backend | Edge Worker | UI Extension |
|---|-----------|-----------|-------------|--------------|--------------|---------|-------------|--------------|
| 35 | **Social Media Links** | Low | Facebook, Twitter/X, LinkedIn, Slack icons | Footer, all pages | Standard embed | No | No | No |
| 36 | **Line Break/Divider** | Low | Visual section separator | Skills Kit page | Default content | No | No | No |
| 37 | **Callout/Alert Box** | Low | Dismissible notification banner ("New to skill building?") | Skills Kit | Standard banner | No | No | No |
| 38 | **PDF/Resource Download** | Low | Document link with file type indicator | Brand guidelines | Standard link | No | No | No |

---

## 4. Page Counts by Template

| Template | Total Pages (Est.) | Auto-Migratable | Manual Migration | Reasoning |
|----------|-------------------|----------------|-----------------|-----------|
| Consumer Landing | 5-8 | 3-5 | 2-3 | Video carousel and auth integration need custom work |
| Developer Portal Hub | 3-5 | 2-3 | 1-2 | Complex nav, search integration |
| Product/SKU Marketing | 15-20 | 12-15 | 3-5 | Mostly static, some with video case studies |
| Technical Product Detail | 10-12 | 8-10 | 2-3 | Diagrams, changelog tables vary |
| Vertical Marketing | 8-10 | 6-8 | 2-3 | Customer success carousels dynamic |
| Program/Community | 12-15 | 10-12 | 2-3 | Portfolio grids may be database-driven |
| Getting Started/Tutorial | 5-8 | 3-5 | 2-3 | Video embeds, external LMS links |
| Training Catalog | 5-8 | 4-6 | 1-2 | Courses may be CMS-fed |
| People/Champions | 3-5 | 0 | 3-5 | Profile data likely from database |
| Blog Hub | 8-10 | 5-7 | 3-4 | Dynamic listings, categories |
| Brand Guidelines | 6-8 | 5-7 | 1-2 | Static with sidebar nav |
| Solution Provider Directory | 8-10 | 5-7 | 3-4 | Provider listings possibly dynamic |
| Feature Updates/Changelog | 3-5 | 2-3 | 1-2 | Table data may be API-fed |
| AI/SDK Showcase | 5-8 | 3-5 | 2-3 | Video case studies, partner testimonials |
| Standards/Initiative | 3-5 | 2-3 | 1-2 | GitHub integration, video |
| **TOTALS** | **~108-144** | **~70-90 (62%)** | **~38-54 (38%)** | |

---

## 5. Integrations Analysis

| # | Integration | Type | Complexity | Client/Server | Active/Legacy | Reference |
|---|-------------|------|-----------|---------------|---------------|-----------|
| 1 | **Amazon CloudFront CDN** | Infrastructure | Medium | Server-side | Active | All pages (asset delivery) |
| 2 | **Amazon SSO/OpenID** | Authentication | High | Server+Client | Active | Sign-in across all pages |
| 3 | **Qualtrics** | Embed/Plugin | Low | Client-side | Active | Newsletter signup, surveys |
| 4 | **Developer Console (ASK)** | API/Redirect | High | Server-side | Active | Console links throughout |
| 5 | **GitHub** | External Link/API | Low | Client-side | Active | Code samples, MAX Toolkit |
| 6 | **YouTube** | Embed | Low | Client-side | Active | Training videos, getting started |
| 7 | **Slack Community** | External Link | Low | Client-side | Active | Community engagement |
| 8 | **Stack Overflow** | External Link | Low | Client-side | Active | Q&A support |
| 9 | **Sana LMS** | Redirect/Embed | Medium | Client-side | Active | alexa.sana.ai training courses |
| 10 | **Amazon Media Services** | CDN/Asset | Low | Server-side | Active | m.media-amazon.com images |
| 11 | **fls-na.amazon.com** | Analytics/Tracking | Medium | Client-side | Active | Pixel-based page tracking |
| 12 | **CloudFront Search Index** | API | Medium | Client-side | Active | Developer portal search |
| 13 | **Amazon Science** | External Link | Low | Client-side | Active | Blog/research cross-link |
| 14 | **Developer Forums** | External Platform | Medium | Server-side | Active | forums.developer.amazon.com |
| 15 | **Social Media APIs** | External Links | Low | Client-side | Active | Facebook, Twitter/X, LinkedIn |
| 16 | **Amazon.com Store** | eCommerce Link | Low | Client-side | Active | Shop Echo & Alexa links |
| 17 | **Alexa+ Subscription** | eCommerce | High | Server-side | Active | /dp/B0DCCNHWV5 product page |
| 18 | **Video Player (Proprietary)** | Embed | Medium | Client-side | Active | Consumer carousel, case studies |

---

## 6. Forms Analysis

### 6.1 Form Inventory

| Category | Count | Sample URL | Complexity | Backend Required |
|----------|-------|-----------|-----------|-----------------|
| **Newsletter Signup ("Voice Mail")** | 5-8 instances | Multiple pages (footer pattern) | Simple | Yes - Qualtrics |
| **Developer Account Registration** | 1 | /alexa/console/signin (external) | High | Yes - Amazon SSO |
| **Pitch/Application Form** | 2-3 | Alexa Fund "Pitch Us" | Medium | Yes - CRM/form service |
| **Feedback Survey** | 2-3 | Qualtrics embedded survey | Simple | Yes - Qualtrics |
| **Contact Us** | 1 | /support/contact-us | Medium | Yes - Support ticketing |
| **Training Course Enrollment** | 5-8 redirects | alexa.sana.ai (external) | N/A (external) | External LMS |
| **TOTAL** | **~16-24** | | | |

### 6.2 Form Complexity Breakdown

| Complexity | Count | Rationale |
|-----------|-------|-----------|
| **Simple** (1-2 fields, no validation) | 10-14 | Newsletter signups, feedback surveys |
| **Medium** (multi-field, basic validation) | 3-5 | Contact forms, pitch applications |
| **Complex** (multi-step, auth, API) | 2-3 | Developer registration, console access |
| **External (not migratable)** | 5-8 | LMS enrollment, forums, console |

---

## 7. Offers & Personalization Analysis

### 7.1 Personalization Assessment

| Category | Count | Complexity | Backend Required |
|----------|-------|-----------|-----------------|
| **Authenticated state (sign-in/out)** | All pages | Medium | Yes - Session |
| **Locale-based content** | All pages | Medium | No - URL routing |
| **"New feature" callout banners** | 3-5 | Low | No - static |
| **Context-aware device sync** | 2-3 consumer pages | High | Yes - Amazon ecosystem |
| **Alexa+ subscription upsell** | 2-3 | Medium | Yes - subscription API |

**Assessment:** Limited personalization on the developer portal side (mostly locale-based). Consumer portal has deeper personalization tied to Amazon account state and Alexa+ subscription status, but this is handled by Amazon's core platform, not the content layer.

**No Adobe Target or equivalent third-party personalization engine detected.** Personalization is handled entirely by Amazon's internal systems.

---

## 8. Complex Use Cases & Observations

| # | Use Case | Instances | Location | Why Complex |
|---|----------|-----------|----------|-------------|
| 1 | **Developer Console Integration** | All dev pages | Sign-in CTAs, console links | Requires Amazon SSO federation; cannot replicate console in EDS |
| 2 | **Multi-language Support (9+ locales)** | All pages | Language selector, URL paths | Full i18n framework needed with locale-based content management |
| 3 | **Developer Portal Search** | All dev pages | Header search | CloudFront-indexed search requires edge worker or external search service |
| 4 | **Video Carousel with Player** | 2-3 consumer pages | alexa.amazon.com | Proprietary video player, lazy loading, thumbnail state management |
| 5 | **Champions Database** | 1 page + profiles | /alexa/champions | Dynamic profile data from database, geographic filtering tabs |
| 6 | **Blog/Content Feed** | 4+ blog sections | /blogs/alexa/* | CMS-driven content listings, categorization, pagination |
| 7 | **External LMS Integration** | 5-8 training pages | /trainings_and_workshops | Course data from Sana LMS, progress tracking external |
| 8 | **Partner/Provider Directory** | 3-5 pages | Solution providers section | Potentially database-driven listings with categorization |
| 9 | **Amazon Store Cross-Links** | 5-8 pages | "Shop Echo" links | Deep linking into Amazon commerce with referral tracking |
| 10 | **Subscription/Purchase Flow** | 1-2 pages | Alexa+ upsell | Connects to Amazon subscription infrastructure |

---

## 9. Outlier Scenarios

| # | Scenario | Behavior | Implementation | Complexity | EDS Approach | Effort (days) |
|---|----------|----------|----------------|-----------|--------------|---------------|
| 1 | **Developer Console SSO** | Sign-in redirects to Amazon auth, returns with session | Amazon OpenID Connect, session cookies, referral params | Very High | Federated auth via edge worker; SSO redirect pattern; session token handling | 15-20 |
| 2 | **CloudFront Search** | Full-text search across developer portal content | Pre-built search index on CloudFront CDN, client-side query | High | Edge worker with search index (Algolia/similar) or AEM search integration | 10-15 |
| 3 | **Video Player Integration** | Proprietary Amazon video carousel with lazy thumbnails, inline playback | Custom player framework, m.media-amazon.com streaming | Medium | YouTube embeds or custom HTML5 video block; simplified carousel | 5-8 |
| 4 | **Champions Profile System** | Geographic-filtered people directory with individual profiles | Backend database, tab-based filtering, profile detail pages | Medium | Spreadsheet-driven content (AEM doc-based) or edge worker with DB | 8-12 |
| 5 | **Blog CMS Integration** | Multi-category blog with listings, individual post pages, author attribution | Separate CMS system feeding blog content | High | AEM doc-based authoring or headless CMS integration | 12-18 |
| 6 | **Training/LMS Redirect** | Course cards that redirect to external Sana LMS with enrollment | External platform integration, progress state | Low | Simple link cards; LMS remains external | 2-3 |
| 7 | **Locale-Based Content Routing** | 9+ language versions with full navigation translation | URL-path i18n, translated nav/content, locale detection | High | AEM multi-language site structure; edge worker for locale detection | 15-20 |
| **TOTAL OUTLIER EFFORT** | | | | | | **67-96 days** |

---

## 10. Migration Estimates

### 10.1 Effort Breakdown

| Work Stream | Items | Effort (Days) | Notes |
|-------------|-------|---------------|-------|
| **Design System Creation** | 38 components | 25 | Design tokens, typography, color, spacing, responsive grid |
| **Template Development** | 15 templates | 30 | EDS page templates with block definitions |
| **Standard Block Development** | 25 blocks (Low-Med) | 20 | Cards, heroes, columns, footers, navigation |
| **Complex Block Development** | 8 blocks (High) | 25 | Video carousel, search, nav dropdowns, carousels |
| **Integration Layer** | 18 integrations | 35 | Auth, search, video, LMS, analytics, i18n |
| **Content Migration - Automated** | 70-90 pages | 10 | Scripted import for static marketing pages |
| **Content Migration - Manual** | 38-54 pages | 25 | Dynamic pages, profiles, directories, blog setup |
| **Localization Framework** | 9 languages | 15 | i18n structure, translated navigation, locale routing |
| **QA & Testing** | All | 20 | Cross-browser, accessibility, responsive, integration |
| **Performance Optimization** | All | 5 | Lighthouse 100, CWV, image optimization |
| **UAT & Stakeholder Review** | All | 8 | Business validation |
| **Documentation** | - | 5 | Author guides |

### 10.2 Phase Summary

| Phase | Effort (Person-Days) | Duration (Weeks) | Team Size |
|-------|---------------------|-----------------|-----------|
| **Phase 1: Design & Architecture** | 55 | 4 weeks | 3 |
| **Phase 2: Core Development** | 75 | 5 weeks | 3 |
| **Phase 3: Integration & Complex Features** | 60 | 4 weeks | 3 |
| **Phase 4: Content Migration & i18n** | 50 | 4 weeks | 3 |
| **Phase 5: QA, UAT & Launch** | 33 | 3 weeks | 2 |
| **TOTAL** | **~273 person-days** | **~20 weeks** | **3 avg** |

### 10.3 Risk Factors

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Amazon SSO integration complexity | +3 weeks | High | Early auth architecture spike |
| Search implementation challenges | +2 weeks | Medium | Evaluate Algolia/Coveo early |
| Video player replacement quality | +1 week | Low | Use standard HTML5/YouTube |
| Blog content volume exceeds estimate | +2 weeks | Medium | Prioritize recent content only |
| Localization scope growth | +3 weeks | High | Phase languages incrementally |
| Amazon internal stakeholder alignment | +2 weeks | High | Early governance agreement |

### 10.4 Cost Estimate (Blended Rate)

| Resource | Rate/Day | Days | Cost |
|----------|----------|------|------|
| Solution Architect | $1,800 | 25 | $45,000 |
| Senior Frontend Developer (x2) | $1,500 | 130 | $195,000 |
| Integration Developer | $1,600 | 50 | $80,000 |
| UX/Design Lead | $1,400 | 30 | $42,000 |
| Content Migration Specialist | $1,000 | 35 | $35,000 |
| QA Engineer | $1,200 | 25 | $30,000 |
| Project Management | $1,400 | 20 weeks | $28,000 |
| **TOTAL ESTIMATED COST** | | | **~$455,000** |

### 10.5 Migration Approach by Priority

| Priority | Pages | Approach | Timeline |
|----------|-------|----------|----------|
| **P1 - Consumer Landing** | 5-8 | Manual rebuild with new design | Weeks 1-6 |
| **P2 - Developer Hub + Key Products** | 20-25 | Template development + content import | Weeks 4-10 |
| **P3 - All Product/Marketing Pages** | 40-50 | Scripted migration using templates | Weeks 8-14 |
| **P4 - Blog + Dynamic Content** | 15-20 | CMS integration + content migration | Weeks 10-16 |
| **P5 - Localization** | Full site x9 langs | Phased language rollout | Weeks 14-20 |

---

## 11. Recommendations

### 11.1 Migration Strategy

1. **Exclude Amazon.com commerce pages** — These are deeply embedded in Amazon's retail platform and cannot practically be migrated to EDS. Maintain as external links.
2. **Developer Portal first** — The developer.amazon.com/alexa section has the most content and is most suited to EDS (primarily marketing/documentation content).
3. **Consumer landing as showcase** — Build the alexa.amazon.com pages as the EDS proof-of-concept with high design quality.
4. **Auth integration via redirect** — Don't replicate Amazon SSO; redirect to Amazon's auth and handle return tokens.
5. **Search via third-party** — Implement Algolia, Coveo, or similar for developer search rather than replicating CloudFront index.
6. **Blog as doc-based** — Use AEM's document-based authoring for blog content rather than a headless CMS.
7. **Localization phased** — Start with English, add languages iteratively (JP, DE, FR highest traffic).

### 11.2 Out-of-Scope Items (Recommended Exclusions)

| Item | Reason |
|------|--------|
| Amazon.com product/commerce pages | Deep Amazon retail integration |
| Developer Console (ASK, AVS, ACK) | Complex web application, not content |
| Sana LMS training content | External platform, keep as redirect |
| Developer Forums | Separate platform (forums.developer.amazon.com) |
| Amazon Science blog | Separate domain and editorial system |

### 11.3 Quick Wins (Weeks 1-4)

- Establish design tokens and base component library from existing patterns
- Migrate 15-20 static marketing pages (Programs, Branding, Standards)
- Set up EDS infrastructure with CI/CD
- Build global nav component and footer

---

## Appendix A: Asset Inventory

| Asset Type | Estimated Count | Source |
|-----------|----------------|--------|
| Hero/banner images | ~25-30 | CloudFront CDN |
| Product/SDK icons | ~40-50 | CloudFront CDN |
| Partner/brand logos | ~30-40 | Logo grids across pages |
| Champion profile photos | ~50-80 | Champions section |
| Video content | ~15-20 | Embedded players |
| PDF/documentation files | ~10-15 | Brand guidelines, resources |
| **Total Digital Assets** | **~170-235** | |

---

## Appendix B: Site Architecture (Migratable Pages)

```
alexa.amazon.com/
├── / (Consumer Landing - Alexa+)
├── /about
└── /shop-echo-devices

developer.amazon.com/en-US/alexa/
├── / (Developer Hub)
├── /alexa-skills-kit/
│   ├── /start
│   ├── /get-deeper/custom-skills
│   ├── /get-deeper/smart-home-skills
│   ├── /grow-your-business
│   ├── /new/feature-updates
│   ├── /radio-skills-kit
│   └── /gaming, /music, /video-content, /news-content
├── /alexa-ai/
│   ├── /alexa-routines-kit
│   └── /smarthomeinsider
├── /devices/
│   ├── /alexa-built-in
│   ├── /connected-devices
│   └── /alexa-auto-sdk
├── /alexa-smart-properties/
│   ├── /hospitality
│   ├── /seniorliving
│   ├── /healthcare
│   └── /customersuccess
├── /solution-providers/
│   ├── /skill-building-agencies
│   └── /alexa-connect-kit
├── /alexa-startups/
│   ├── /alexa-fund (+ portfolio, next-stage, fellowship)
│   ├── /alexa-prize
│   └── /signup
├── /branding/
│   ├── /alexa-guidelines
│   └── /echo-guidelines
├── /trainings_and_workshops
├── /champions
├── /voice-interoperability
├── /office-hours
├── /enterprise-and-business
└── /blogs/alexa/ (4 categories)
```

---

*Report generated: May 4, 2026*  
*Analysis scope: ~120-144 migratable pages, 18 integrations, 16-24 forms, 38 unique blocks, 15 templates*
*Note: Amazon.com pages returned 503 errors (bot protection) — analysis based on accessible pages and known URL structures.*
