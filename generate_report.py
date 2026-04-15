#!/usr/bin/env python3
"""Generate DOCX migration analysis report for ThermoFisher AMS to EDS migration."""

from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
import os

doc = Document()

# --- Style Setup ---
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(10)

for level in range(1, 4):
    heading_style = doc.styles[f'Heading {level}']
    heading_style.font.color.rgb = RGBColor(0x1A, 0x1A, 0x2E)

def add_table(headers, rows, col_widths=None):
    table = doc.add_table(rows=1, cols=len(headers), style='Light Grid Accent 1')
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    hdr_cells = table.rows[0].cells
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        for p in hdr_cells[i].paragraphs:
            for run in p.runs:
                run.bold = True
                run.font.size = Pt(9)
    for row_data in rows:
        row_cells = table.add_row().cells
        for i, val in enumerate(row_data):
            row_cells[i].text = str(val)
            for p in row_cells[i].paragraphs:
                for run in p.runs:
                    run.font.size = Pt(9)
    return table

def add_screenshot(filename, caption, width=6.0):
    path = f'/workspace/screenshots/{filename}'
    if os.path.exists(path):
        doc.add_picture(path, width=Inches(width))
        last_paragraph = doc.paragraphs[-1]
        last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap = doc.add_paragraph(caption)
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap.style = doc.styles['Normal']
        for run in cap.runs:
            run.italic = True
            run.font.size = Pt(8)
            run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

# === TITLE PAGE ===
doc.add_paragraph('')
doc.add_paragraph('')
title = doc.add_heading('ThermoFisher.com', level=0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle = doc.add_heading('AEM AMS to Edge Delivery Services\nMigration Analysis Report', level=1)
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('')
meta = doc.add_paragraph('Date: April 15, 2026\nSource: https://www.thermofisher.com/us/en/home.html\nScope: US English site (do not go into subdomains)\nCurrent Platform: Adobe Experience Manager (AMS)')
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_page_break()

# === TABLE OF CONTENTS ===
doc.add_heading('Table of Contents', level=1)
toc_items = [
    '1. High-Level Summary',
    '2. Templates Inventory',
    '3. Blocks Catalog',
    '4. Page Counts by Template',
    '5. Integrations Analysis',
    '6. Forms Analysis',
    '7. Offers / Personalization Analysis',
    '8. Complex Use Cases & Observations',
    '9. Outlier Scenarios',
    '10. Migration Estimates',
    '11. Template Screenshots',
]
for item in toc_items:
    doc.add_paragraph(item, style='List Number')
doc.add_page_break()

# === 1. HIGH-LEVEL SUMMARY ===
doc.add_heading('1. High-Level Summary', level=1)

doc.add_heading('1.1 Site Scale', level=2)
add_table(
    ['Metric', 'Count'],
    [
        ['US/EN CMS Content Pages (from sitemap)', '~11,595'],
        ['Product Catalog Pages (/order/catalog/product/)', '~400,000'],
        ['Antibody Product Pages (/antibody/product/)', '~500,000-800,000'],
        ['Product FAQ Pages', '~34,000'],
        ['Product Citation Pages', '~94,000'],
        ['Total Indexed URLs (entire domain)', '~1.2-1.5 million'],
        ['Locale Variants (36 country/language sitemaps)', '~200,000-250,000 CMS pages'],
        ['Max URL Depth', '11 levels (bulk at depth 4-5)'],
    ]
)

doc.add_heading('1.2 Thematic Page Breakdown (US/EN CMS pages)', level=2)
add_table(
    ['Category', 'Pages', 'Type'],
    [
        ['Life Science', '3,483', 'Product/Technology Marketing'],
        ['Industrial', '1,967', 'Product/Technology Marketing'],
        ['References/Protocols', '1,547', 'Technical Resources'],
        ['Products & Services', '835', 'Marketing / eCommerce Hub'],
        ['Clinical', '639', 'Product/Technology Marketing'],
        ['Technical Resources', '637', 'Support & Learning'],
        ['About Us / Corporate', '567', 'Corporate/Company'],
        ['Electron Microscopy', '418', 'Product Marketing'],
        ['Materials Science', '282', 'Product Marketing'],
        ['Brands', '250', 'Brand Marketing'],
        ['Bioprocessing', '219', 'Application Marketing'],
        ['Chemicals', '163', 'Product Marketing'],
        ['Virtual Tours', '111', 'Interactive/3D'],
        ['Events', '86', 'Marketing Events'],
        ['Other (30+ sections)', '~300', 'Mixed'],
    ]
)

doc.add_heading('1.3 Pages by Content Type', level=2)
add_table(
    ['Type', 'Estimated %', 'Estimated Pages'],
    [
        ['Static Authored (CMS)', '~85%', '~9,850'],
        ['Dynamic/API-Driven', '~10%', '~1,160'],
        ['Hybrid (Static + Dynamic)', '~5%', '~585'],
    ]
)

doc.add_heading('1.4 Pages Integrated with eCommerce', level=2)
doc.add_paragraph('Product Detail Pages (PDP): ~400,000+ (separate React SPA, NOT AEM-managed)', style='List Bullet')
doc.add_paragraph('Store pages (/store/v2/): Quick Order, Contact Us, Order Status - separate app, auth-gated', style='List Bullet')
doc.add_paragraph('Homepage has embedded eCommerce carousel with Add-to-Cart functionality', style='List Bullet')

doc.add_heading('1.5 Pages Fed from Other Systems', level=2)
doc.add_paragraph('Blog posts (/blog/) - WordPress or similar CMS', style='List Bullet')
doc.add_paragraph('Corporate site (corporate.thermofisher.com) - separate AEM instance', style='List Bullet')
doc.add_paragraph('Careers (jobs.thermofisher.com) - recruitment platform', style='List Bullet')
doc.add_paragraph('Investor Relations (ir.thermofisher.com) - IR platform', style='List Bullet')
doc.add_paragraph('Newsroom (newsroom.thermofisher.com) - news/PR platform', style='List Bullet')

doc.add_heading('1.6 Current Tech Stack & Design System Analysis', level=2)
doc.add_paragraph('The site runs on multiple coexisting technology stacks:')
add_table(
    ['System', 'Technology', 'Scope'],
    [
        ['CMS', 'Adobe Experience Manager (AMS)', 'All /us/en/ content pages'],
        ['Design System', 'Komodo (kmd-* classes)', 'Homepage, modern pages'],
        ['Component System', 'AEM Core Components (cmp-*)', 'Modern content pages'],
        ['Legacy CMS', 'AEM Classic (parsys, cq-*)', 'Older category/brand pages'],
        ['eCommerce', 'Custom React SPA (pdp-*, pragma-*)', 'Product pages, store'],
        ['Search', 'Endeca (SearchBar v2)', 'All pages (header)'],
        ['JavaScript', 'jQuery 3.7.1 + jQuery Migrate 3.4.1', 'All AEM pages'],
        ['Analytics', 'Adobe Experience Platform (Alloy 2.23)', 'All pages'],
        ['Tag Manager', 'Adobe Launch', 'All pages'],
        ['Personalization', 'Adobe Target', 'Homepage, category pages'],
    ]
)
doc.add_paragraph('')
doc.add_paragraph('Key Observation: No unified design system exists. Multiple coexisting systems (Komodo, AEM Core Components, AEM Classic, Store Platform) indicate organic growth over time. This is a significant consideration for EDS migration as design tokens and patterns must be unified.')

doc.add_page_break()

# === 2. TEMPLATES INVENTORY ===
doc.add_heading('2. Templates Inventory', level=1)
templates = [
    ['T1', 'Homepage', 'High', '/us/en/home.html', 'Hero pods, product carousel (API-driven), blog cards, promotional cards, eCommerce integration. Uses kmd-* Komodo design system + cmp-* AEM components. Hybrid static + dynamic content.'],
    ['T2', 'Category Hub (Full-Width)', 'Medium', '/us/en/home/life-science/antibodies.html', 'Hero with text overlay, icon link lists, card grids, section dividers. Modern AEM with cmp-* components and aem-Grid responsive layout.'],
    ['T3', 'Category Hub (Sidebar)', 'Medium', '/us/en/home/life-science/pcr.html', 'Left sidebar navigation + main content area. AEM Classic with parsys containers. Carousel banners, product filmstrips, 3-column link grids.'],
    ['T4', 'Brand Page (Text-Heavy)', 'Medium', '/us/en/home/brands/thermo-scientific.html', 'Left sidebar with categorized links, anchor navigation, 2-column product link lists. AEM Classic.'],
    ['T5', 'Brand Page (Visual)', 'Medium', '/us/en/home/brands/gibco.html', 'Full-width, card-grid layout with Brightcove video integration, promotional CTAs. No sidebar.'],
    ['T6', 'Solutions/Application Landing', 'Medium', '/us/en/home/bioprocessing.html', 'Full-width hero, anchor navigation, alternating image+text content blocks, video embeds. Modern AEM cmp-* components.'],
    ['T7', 'Product Directory', 'Medium', '/us/en/home/order.html', 'Collapsible table-of-contents, 3-column category link grids, API-loaded promo teasers.'],
    ['T8', 'Promotions Hub', 'Low', '/us/en/home/products-and-services/promotions.html', 'Minimal static shell, filter buttons, dynamic promotional card grid loaded via API.'],
    ['T9', 'Technical Resource/Support', 'Low-Med', '/us/en/home/support.html', 'Content-focused pages with link lists, resource cards.'],
    ['T10', 'Events Page', 'Medium', '/us/en/home/events.html', 'Dynamic event listings, likely API-driven.'],
    ['T11', 'Product Detail Page (PDP)', 'High', '/order/catalog/product/11965092', 'NOT AEM - React SPA with web components. Full eCommerce: pricing, stock, add-to-cart, tabs, citations, Q&A.'],
    ['T12', 'Search Results', 'High', '/search/results?query=antibodies', 'NOT AEM - Standalone JS SPA with faceted search, filters, pagination.'],
    ['T13', 'Store/Commerce App', 'High', '/store/v2/quick-order', 'NOT AEM - Separate auth-gated application.'],
    ['T14', 'Specialty Subsites', 'Low-Med', '/allergy/, /onelambda/, /bindingsite/', 'Smaller microsites with locale variants, simpler layouts.'],
]
add_table(
    ['#', 'Template Name', 'Complexity', 'Example URL', 'Description'],
    templates
)

doc.add_page_break()

# === 3. BLOCKS CATALOG ===
doc.add_heading('3. Blocks Catalog', level=1)
blocks = [
    ['B1', 'Global Header', 'High', 'Logo, mega-nav with multi-level dropdowns, search bar (SearchBar v2 with Endeca), utility links, promotional offer banner, hamburger mobile menu', 'All pages', 'No - custom build', 'Yes (search API, cart API, auth)', 'No', 'No'],
    ['B2', 'Global Footer', 'Medium', '6-column link grid (Ordering, Support, Resources, About, Portfolio, Brands), legal links, copyright, country selector', 'All pages', 'No - custom build', 'No', 'No', 'No'],
    ['B3', 'Hero Pod', 'Medium', 'Large hero image + headline + subtitle + CTA button, with 3 sub-hero cards below', 'Homepage', 'Variant of Hero', 'No', 'Yes', 'No'],
    ['B4', 'Page Heading Hero', 'Low', 'Text overlay hero with H1, subtitle, optional CTA', 'Category pages', 'Variant of Hero', 'No', 'Yes', 'No'],
    ['B5', 'Product Offers Carousel', 'High', 'Scrollable product cards with images, pricing, "Add to cart" buttons. API-loaded from Adobe Target recommendations', 'Homepage', 'No - custom build', 'Yes (Target, pricing, cart API)', 'No', 'No'],
    ['B6', 'Promotional Cards', 'Medium', 'Image + headline + CTA + badge label (e.g., "22% OFF"). Grid layout', 'Homepage, Promotions', 'Variant of Cards', 'No', 'Yes', 'No'],
    ['B7', 'Education/Featured Cards', 'Medium', 'Large featured card with image, description, bullet list + smaller companion cards', 'Homepage', 'Variant of Cards', 'No', 'Yes', 'No'],
    ['B8', 'Blog/Article Cards', 'Low', 'Image + title + author + date + "Read Article" link. 3-column grid', 'Homepage', 'Variant of Cards', 'Possibly (blog API)', 'Yes', 'No'],
    ['B9', 'New Product Cards', 'Low', 'Image + headline + CTA link. 3-column grid', 'Homepage', 'Variant of Cards', 'No', 'Yes', 'No'],
    ['B10', 'Category Link Grid', 'Low', '3-column or 2-column lists of category links, sometimes with icons', 'Category hubs', 'Variant of Columns', 'No', 'Yes', 'No'],
    ['B11', 'Sidebar Navigation', 'Medium', 'Left sidebar with categorized link lists, collapsible sections', 'Brand/Category pages', 'No - custom build', 'No', 'Yes', 'No'],
    ['B12', 'Anchor Navigation', 'Low', 'In-page scroll navigation with anchor links to sections', 'Brand/Solutions pages', 'No - custom build', 'No', 'Yes', 'No'],
    ['B13', 'Image + Text (Alternating)', 'Low', 'Side-by-side image and text blocks, alternating left/right', 'Solutions pages', 'Variant of Columns', 'No', 'Yes', 'No'],
    ['B14', 'Video Player', 'Medium', 'Brightcove/Video.js embedded player for product videos', 'Brand pages', 'No - custom (Brightcove)', 'Yes (Brightcove)', 'No', 'No'],
    ['B15', 'Product Filmstrip/Carousel', 'Medium', 'Horizontal scrolling product cards with prev/next', 'Category pages', 'Variant of Carousel', 'No', 'Yes', 'No'],
    ['B16', 'Promotional Banner Bar', 'Low', 'Top-of-page promotional bar with rotating text + link', 'All pages (header)', 'No - custom build', 'Possibly (personalization)', 'No', 'No'],
    ['B17', 'Table of Contents (Collapsible)', 'Low', 'Expandable/collapsible navigation for long content pages', 'Product Directory', 'No - custom build', 'No', 'Yes', 'No'],
    ['B18', 'Filter Buttons', 'Low', 'Client-side content filtering (All, Percentage Off, Special Deal)', 'Promotions page', 'No - custom build', 'No', 'Yes', 'No'],
    ['B19', 'Contact Department Cards', 'Medium', '6 clickable department selection cards for customer service routing', 'Contact page', 'Variant of Cards', 'Yes (routing, chat)', 'No', 'No'],
    ['B20', 'Dynamic Offer/Teaser', 'Medium', 'API-loaded promotional teasers using Adobe Target', 'Homepage, various', 'No - custom build', 'Yes (Adobe Target)', 'No', 'No'],
    ['B21', 'Search Bar', 'High', 'Full-featured search with category selector, autocomplete, Endeca provider', 'All pages (header)', 'No - custom build', 'Yes (Endeca/search API)', 'No', 'No'],
    ['B22', 'Cookie Consent Banner', 'Low', 'TrustArc-powered cookie preferences modal', 'All pages', 'No - TrustArc integration', 'Yes (TrustArc)', 'No', 'No'],
    ['B23', 'Separator', 'Low', 'Horizontal rule divider between sections', 'Many pages', 'Yes - standard EDS', 'No', 'Yes', 'No'],
    ['B24', 'CTA List', 'Low', 'Grouped call-to-action buttons', 'Category pages', 'Variant of Buttons', 'No', 'Yes', 'No'],
    ['B25', 'Section Container', 'Low', 'Wrapper component for grouping content sections', 'Modern AEM pages', 'Yes - EDS Section', 'No', 'Yes', 'No'],
    ['B26', 'Feedback Button', 'Low', 'Kampyle/Medallia feedback widget trigger', 'All pages', 'No - Kampyle integration', 'Yes (Kampyle SDK)', 'No', 'No'],
    ['B27', 'Chat Launcher', 'Medium', 'Vue.js-based chat widget from chat-api.thermofisher.com', 'All pages', 'No - custom build', 'Yes (chat API)', 'No', 'No'],
    ['B28', 'Accessibility Menu', 'Low', 'UserWay accessibility widget with skip-to-content, navigation aids', 'All pages', 'No - UserWay integration', 'Yes (UserWay)', 'No', 'No'],
    ['B29', 'Country Selector', 'Low', 'Country/locale picker with flag icons', 'Footer', 'No - custom build', 'No', 'Yes', 'No'],
]
add_table(
    ['#', 'Block Name', 'Complexity', 'Description', 'Reference', 'Standard EDS?', 'Backend Needed?', 'LLM-Ready?', 'UI Extension?'],
    blocks
)

doc.add_page_break()

# === 4. PAGE COUNTS BY TEMPLATE ===
doc.add_heading('4. Page Counts by Template', level=1)
add_table(
    ['Template', 'Est. Pages', 'Auto-Migratable?', 'Notes'],
    [
        ['T1: Homepage', '1', 'No - Manual', 'Complex hybrid layout, API-driven content'],
        ['T2: Category Hub (Full-Width)', '~2,000', 'Partially', 'Static content migratable; dynamic elements need rebuild'],
        ['T3: Category Hub (Sidebar)', '~3,000', 'Partially', 'Sidebar nav pattern needs custom EDS block'],
        ['T4: Brand Page (Text-Heavy)', '~100', 'Partially', 'Individually authored - no single template'],
        ['T5: Brand Page (Visual)', '~150', 'Partially', 'Video integration needs Brightcove setup'],
        ['T6: Solutions/Application Landing', '~500', 'Partially', 'Anchor nav and alternating blocks need custom work'],
        ['T7: Product Directory', '~50', 'No - Manual', 'Collapsible TOC, massive link directories'],
        ['T8: Promotions Hub', '~50', 'No - Manual', 'Primarily API-driven content'],
        ['T9: Technical Resource/Support', '~2,500', 'Yes - Automated', 'Mostly static authored content'],
        ['T10: Events Page', '~100', 'No - Manual', 'Dynamic event listings'],
        ['T11: PDP (React SPA)', '~400,000', 'OUT OF SCOPE', 'Not AEM content - separate commerce platform'],
        ['T12: Search Results (SPA)', 'N/A', 'OUT OF SCOPE', 'Standalone application'],
        ['T13: Store/Commerce App', 'N/A', 'OUT OF SCOPE', 'Separate auth-gated application'],
        ['T14: Specialty Subsites', '~500', 'Yes - Automated', 'Simpler layouts, static content'],
    ]
)

doc.add_paragraph('')
doc.add_heading('Migration Classification Summary', level=2)
add_table(
    ['Classification', 'Pages', '% of Total', 'Description'],
    [
        ['Automatically Migratable', '~4,000', '35%', 'Standardized templates, static data'],
        ['Semi-Automated Migration', '~5,850', '50%', 'Template conversion + manual adjustments'],
        ['Manual Migration', '~1,745', '15%', 'Dynamic, custom, complex logic'],
        ['Out of Scope', '~400,000+', 'N/A', 'eCommerce PDP, Search, Store - not AEM CMS content'],
    ]
)

doc.add_page_break()

# === 5. INTEGRATIONS ANALYSIS ===
doc.add_heading('5. Integrations Analysis', level=1)
add_table(
    ['#', 'Integration', 'Type', 'Complexity', 'Client/Server', 'Active?'],
    [
        ['I1', 'Adobe Experience Platform (AEP) Web SDK / Alloy', 'Analytics/CDP', 'High', 'Client', 'Active'],
        ['I2', 'Adobe Launch (DTM)', 'Tag Manager', 'Medium', 'Client', 'Active'],
        ['I3', 'Adobe Target', 'Personalization', 'High', 'Client + Server', 'Active'],
        ['I4', 'Endeca Search', 'Search Engine', 'High', 'Client + Server', 'Active'],
        ['I5', 'Kampyle / Medallia', 'Feedback/Survey', 'Medium', 'Client', 'Active'],
        ['I6', 'TrustArc', 'Cookie Consent', 'Low', 'Client', 'Active'],
        ['I7', 'UserWay', 'Accessibility', 'Low', 'Client', 'Active'],
        ['I8', 'Brightcove / Video.js', 'Video Hosting', 'Medium', 'Client', 'Active'],
        ['I9', 'Chat Widget (Vue.js)', 'Live Chat', 'Medium', 'Client + Server', 'Active'],
        ['I10', 'eCommerce / Cart API', 'Commerce', 'High', 'Client + Server', 'Active'],
        ['I11', 'jQuery + jQuery Migrate 3.4.1', 'Legacy Framework', 'Low', 'Client', 'Active (deprecated)'],
        ['I12', 'Signals Search Analytics', 'Search Analytics', 'Low', 'Client', 'Active'],
        ['I13', 'Store Platform (React)', 'eCommerce SPA', 'High', 'Client + Server', 'Active'],
    ]
)

doc.add_page_break()

# === 6. FORMS ANALYSIS ===
doc.add_heading('6. Forms Analysis', level=1)
add_table(
    ['#', 'Form Type', 'Complexity', 'Sample URL', 'Backend Integration'],
    [
        ['F1', 'Search Form (Header)', 'High', 'All pages - #smartsearch', 'Endeca search API'],
        ['F2', 'Contact Us Form', 'Medium', '/store/v2/contact-us?enableChat=true', 'Store platform (not AEM)'],
        ['F3', 'Sign In / Account', 'High', 'Account dropdown', 'Auth system (SSO/OAuth)'],
        ['F4', 'Quick Order', 'High', '/store/v2/quick-order', 'Store/cart API (auth-gated)'],
        ['F5', 'Add to Cart', 'Medium', 'Homepage carousel, PDP', 'Cart API (/api/store/)'],
        ['F6', 'Cookie Preferences', 'Low', 'All pages (TrustArc modal)', 'TrustArc'],
        ['F7', 'Feedback Form', 'Low', 'All pages (Kampyle widget)', 'Kampyle/Medallia'],
    ]
)

doc.add_page_break()

# === 7. OFFERS / PERSONALIZATION ===
doc.add_heading('7. Offers / Personalization Analysis', level=1)
add_table(
    ['#', 'Offer Type', 'Complexity', 'Sample URL', 'Backend'],
    [
        ['O1', 'Header Promotional Banner', 'Medium', 'All pages - rotating offer bar', 'Likely Adobe Target or authored'],
        ['O2', 'Online Offers Carousel', 'High', 'Homepage - 24 products with pricing', 'Adobe Target recommendations + Pricing API'],
        ['O3', 'Dynamic Teasers', 'Medium', 'Various pages - aem-offer-container', 'Adobe Target'],
        ['O4', 'Promotional Cards (Curated)', 'Low', 'Homepage "Promotions" section', 'Authored (static)'],
        ['O5', 'Product-Level Promotions', 'Medium', 'PDP - promo badges, coupon codes', 'Store API'],
    ]
)

doc.add_page_break()

# === 8. COMPLEX USE CASES ===
doc.add_heading('8. Complex Use Cases & Observations', level=1)
add_table(
    ['#', 'Use Case', 'Instances', 'Where Found', 'Why It\'s Complex'],
    [
        ['C1', 'Multi-Platform Architecture', 'Site-wide', 'Header, PDP, Search, Store', 'Three separate tech stacks (AEM Classic, Modern AEM, React Store) must be unified or integrated'],
        ['C2', 'Adobe Target Personalization', '~50+ pages', 'Homepage, category pages', 'Dynamic content loaded via Target API requires edge-side personalization in EDS'],
        ['C3', 'Endeca Search Integration', 'All pages', 'Header search bar', 'Deep search integration with category-specific focus areas, autocomplete'],
        ['C4', 'eCommerce Cart on CMS Pages', 'Homepage + others', '"Add to cart" buttons on authored pages', 'CMS pages embed live commerce functionality (pricing, stock, cart)'],
        ['C5', 'Mega Navigation (Multi-Level)', 'All pages', 'Header', 'Complex mega-nav with dynamic content, popular products, images'],
        ['C6', 'Brand Page Inconsistency', '~250 pages', '/us/en/home/brands/*', 'No consistent template - each brand page is individually authored with different layouts'],
        ['C7', 'Legacy jQuery Dependency', 'All AEM pages', 'Global scripts', 'jQuery Migrate 3.4.1 + deprecated API usage throughout'],
        ['C8', '36 Locale Variants', '~250,000 pages', 'Entire site', 'Multi-country, multi-language with locale-specific content and redirects'],
        ['C9', 'Aggressive Redirects', 'Multiple pages', 'support.html -> order.html', 'URL-level routing that transforms CMS paths to app endpoints'],
        ['C10', 'Chat Widget (Custom Vue.js)', 'All pages', 'Footer/floating', 'Custom-built chat launcher needs reimplementation or embedding strategy'],
    ]
)

doc.add_page_break()

# === 9. OUTLIER SCENARIOS ===
doc.add_heading('9. Outlier Scenarios', level=1)
add_table(
    ['#', 'Scenario', 'Behavior', 'Implementation', 'Effort Estimate'],
    [
        ['OS1', 'Product Offers Carousel (Homepage)', 'Full section rendered via API - Target recommendations -> pricing API -> cart API. No static fallback.', 'Custom EDS block with edge worker for API orchestration', '40-60 hours'],
        ['OS2', 'Product Detail Pages (400K+ pages)', 'Entire page is a React SPA with web components (core-tooltip, core-quantityselector, etc.)', 'Keep as separate app or rebuild as EDS + edge workers', 'Out of scope / 500+ hrs'],
        ['OS3', 'Search Results SPA', 'Client-side rendered, anti-bot protections, faceted search with filters', 'Keep as separate app or integrate EDS-compatible search', 'Out of scope / 200+ hrs'],
        ['OS4', 'Virtual/3D Tours (111 pages)', 'Interactive 3D product experiences', 'Embed strategy in EDS iframe/web component', '20-30 hours'],
        ['OS5', 'Dynamic Offer Containers', 'aem-offer-container divs filled by Target at runtime', 'Edge worker or client-side personalization in EDS', '30-40 hours'],
        ['OS6', 'Blog Integration', 'Blog posts from /blog/ subdirectory (likely WordPress)', 'RSS/API feed integration or migrate to EDS', '40-80 hours'],
    ]
)

doc.add_page_break()

# === 10. MIGRATION ESTIMATES ===
doc.add_heading('10. Migration Estimates', level=1)

doc.add_heading('Scope Definition', level=2)
doc.add_paragraph('In-Scope for EDS Migration: ~11,595 US/EN CMS content pages')
doc.add_paragraph('Out of Scope: PDP (React SPA), Search Results (SPA), Store App (auth-gated), external subdomains')

doc.add_heading('Effort Breakdown', level=2)
add_table(
    ['Phase', 'Activity', 'Hours', 'Days (1 FTE)'],
    [
        ['Phase 1: Foundation', 'Design system extraction & EDS CSS custom properties', '80', '10'],
        ['', 'Global header block (mega-nav + search + cart integration)', '120', '15'],
        ['', 'Global footer block', '40', '5'],
        ['', 'Core EDS block library (23+ custom blocks)', '320', '40'],
        ['', 'Edge worker setup (personalization, pricing APIs)', '80', '10'],
        ['Phase 2: Templates', 'Template T2 (Category Hub Full-Width) - ~2,000 pages', '160', '20'],
        ['', 'Template T3 (Category Hub Sidebar) - ~3,000 pages', '200', '25'],
        ['', 'Template T9 (Technical Resources) - ~2,500 pages', '120', '15'],
        ['', 'Template T6 (Solutions Landing) - ~500 pages', '80', '10'],
        ['', 'Template T4/T5 (Brand Pages) - ~250 pages', '80', '10'],
        ['', 'Templates T1, T7, T8, T10, T14 - ~700 pages', '120', '15'],
        ['Phase 3: Integrations', 'Adobe Target personalization in EDS', '80', '10'],
        ['', 'Endeca search integration', '60', '8'],
        ['', 'eCommerce/Cart API integration', '80', '10'],
        ['', 'Chat widget migration', '40', '5'],
        ['', 'Analytics (AEP/Launch) migration', '40', '5'],
        ['', 'Third-party integrations (UserWay, TrustArc, Kampyle, Brightcove)', '60', '8'],
        ['Phase 4: Content', 'Automated content import (~4,000 pages)', '120', '15'],
        ['', 'Semi-automated content import (~5,850 pages)', '320', '40'],
        ['', 'Manual content migration (~1,745 pages)', '240', '30'],
        ['Phase 5: QA', 'Visual regression testing', '120', '15'],
        ['', 'Functional testing (forms, search, cart, navigation)', '80', '10'],
        ['', 'Performance testing & optimization (Lighthouse 100)', '60', '8'],
        ['', 'Accessibility testing (WCAG 2.1 AA)', '60', '8'],
        ['', 'UAT & stakeholder review', '80', '10'],
        ['Phase 6: Locales', 'Multi-locale setup & content migration (35 additional locales)', '400', '50'],
    ]
)

doc.add_paragraph('')
doc.add_heading('Summary', level=2)
add_table(
    ['Category', 'Hours', 'Days'],
    [
        ['Foundation (Design + Blocks + Infra)', '640', '80'],
        ['Template Migration', '760', '95'],
        ['Integrations', '360', '46'],
        ['Content Migration', '680', '85'],
        ['QA & Testing', '400', '51'],
        ['Locale Rollout', '400', '50'],
        ['TOTAL (US/EN only)', '2,840', '~355'],
        ['TOTAL (All locales)', '3,240', '~405'],
    ]
)

doc.add_paragraph('')
doc.add_heading('Team Recommendation', level=2)
doc.add_paragraph('With a team of 4-5 FTEs (2 frontend developers, 1 integration specialist, 1 content migration specialist, 1 QA engineer):')
doc.add_paragraph('US/EN migration: ~4-5 months', style='List Bullet')
doc.add_paragraph('Full multi-locale migration: ~6-7 months', style='List Bullet')
doc.add_paragraph('Total calendar time with buffer: ~8-9 months', style='List Bullet')

doc.add_page_break()

# === 11. TEMPLATE SCREENSHOTS ===
doc.add_heading('11. Template Screenshots', level=1)
doc.add_paragraph('The following screenshots capture representative pages for each identified template type.')

screenshots = [
    ('T1-homepage.png', 'T1: Homepage - thermofisher.com/us/en/home.html'),
    ('T2-category-hub-fullwidth.png', 'T2: Category Hub (Full-Width) - Antibodies page'),
    ('T3-category-hub-sidebar.png', 'T3: Category Hub (Sidebar) - PCR page'),
    ('T4-brand-page-text.png', 'T4: Brand Page (Text-Heavy) - Thermo Scientific'),
    ('T5-brand-page-visual.png', 'T5: Brand Page (Visual) - Gibco'),
    ('T6-solutions-landing.png', 'T6: Solutions/Application Landing - Bioprocessing'),
    ('T8-promotions-hub.png', 'T8: Promotions Hub'),
    ('T11-product-detail-page.png', 'T11: Product Detail Page (PDP) - React SPA'),
]

for filename, caption in screenshots:
    doc.add_heading(caption.split(' - ')[0], level=2)
    add_screenshot(filename, caption, width=6.5)
    doc.add_paragraph('')

# Save
output_path = '/workspace/ThermoFisher_AMS_to_EDS_Migration_Analysis.docx'
doc.save(output_path)
print(f'Report saved to {output_path}')
