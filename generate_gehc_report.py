#!/usr/bin/env python3
"""Generate DOCX migration analysis report for GE HealthCare AEM to EDS migration."""

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
import os

doc = Document()

# --- Style Setup ---
style = doc.styles['Normal']
font = style.font
font.name = 'Calibri'
font.size = Pt(10)

for level in range(1, 4):
    hs = doc.styles[f'Heading {level}']
    hs.font.color.rgb = RGBColor(0x00, 0x2B, 0x49)  # GE HealthCare navy

def add_table(headers, rows):
    table = doc.add_table(rows=1, cols=len(headers), style='Light Grid Accent 1')
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h
        for p in cell.paragraphs:
            for run in p.runs:
                run.bold = True
                run.font.size = Pt(9)
    for row_data in rows:
        cells = table.add_row().cells
        for i, val in enumerate(row_data):
            cells[i].text = str(val)
            for p in cells[i].paragraphs:
                for run in p.runs:
                    run.font.size = Pt(9)
    return table

def add_screenshot(filename, caption, width=6.0):
    path = f'/workspace/gehc-screenshots/{filename}'
    if os.path.exists(path):
        doc.add_picture(path, width=Inches(width))
        last_p = doc.paragraphs[-1]
        last_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap = doc.add_paragraph(caption)
        cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in cap.runs:
            run.italic = True
            run.font.size = Pt(8)
            run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)

# === TITLE PAGE ===
doc.add_paragraph('')
doc.add_paragraph('')
title = doc.add_heading('GE HealthCare', level=0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
subtitle = doc.add_heading('AEM AMS to Edge Delivery Services\nMigration Analysis Report', level=1)
subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('')
meta = doc.add_paragraph(
    'Date: April 16, 2026\n'
    'Source: https://www.gehealthcare.com/\n'
    'Scope: US English site (gehealthcare.com, no subdomains)\n'
    'Current Platform: Adobe Experience Manager (AEM as Cloud Service) + Sitecore JSS (legacy /shop)'
)
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_page_break()

# === TABLE OF CONTENTS ===
doc.add_heading('Table of Contents', level=1)
for item in [
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
]:
    doc.add_paragraph(item, style='List Number')
doc.add_page_break()

# === 1. HIGH-LEVEL SUMMARY ===
doc.add_heading('1. High-Level Summary', level=1)

doc.add_heading('1.1 Site Scale', level=2)
add_table(['Metric', 'Count'], [
    ['Main Sitemap URLs (no locale prefix)', '2,172'],
    ['US English Pages (/en-us/)', '1,723'],
    ['Global English Pages (/en/)', '1,667'],
    ['Total Across All Locales (12 sitemaps)', '~12,950'],
    ['Estimated Unique Pages (excl. locale duplication)', '~2,500-3,500'],
    ['Locale Variants', '10+ (US, GB, DE, SG, MY, PH, TH, Middle East, CN, Global)'],
    ['Max URL Depth', '5 levels (bulk at depth 3)'],
])

doc.add_heading('1.2 Current Tech Stack', level=2)
add_table(['Layer', 'Technology', 'Evidence'], [
    ['Primary CMS', 'Adobe Experience Manager (AEM as Cloud Service)', 'window.CQ, window.Granite, etc.clientlibs, cmp-* components, aem-Grid'],
    ['Legacy CMS', 'Sitecore JSS (React SPA)', '__JSS_STATE__, -/jssmedia/ paths — serves /shop only'],
    ['Component Framework', 'AEM Core Components', 'cmp-carousel, cmp-container, cmp-button, cmp-link, cmp-experiencefragment'],
    ['Grid System', 'AEM Responsive Grid + Material Design Components', 'aem-Grid--12, mdc-layout-grid'],
    ['Image Delivery', 'AEM Dynamic Media / Scene7', 's7d9.scene7.com asset URLs'],
    ['Search', 'Algolia', 'Algolia clientlib, aa-Form search classes'],
    ['Personalization', 'Adobe Target (Server-Side)', 'Console: "Target Server-Side Call Successful"'],
    ['Analytics', 'Google Tag Manager (2 containers)', 'GTM-58LKHLP, GTM-W4V7GZG'],
    ['Ads/Remarketing', 'Google Ads + DoubleClick', 'AW-357630064, AW-435915669, DC-10528130'],
    ['Cookie Consent', 'Evidon (Crownpeak)', 'c.evidon.com scripts'],
    ['Forms', 'Marketo', 'gehc-marketo-form, marketoform classes'],
    ['Video', 'Vidyard', 'play.vidyard.com/embed/v4.js'],
    ['ABM/Intent', 'Nrich.ai', 'j.nrich.ai/tag.js'],
    ['eCommerce', 'SAP Hybris (legacy via Sitecore)', 'gehcstorefront, /shop paths'],
    ['Payments', 'Affirm (Buy Now Pay Later)', 'cdn1.affirm.com/js/v2/affirm.js'],
    ['Pharma CRM', 'Veeva', 'Veeva class prefix on homepage'],
])

doc.add_heading('1.3 Thematic Page Breakdown (2,172 unique URLs)', level=2)
add_table(['Category', 'Pages', '%', 'Type'], [
    ['Products', '906', '42%', 'Product Marketing / Catalog'],
    ['Insights/Articles', '751', '35%', 'Content Marketing / Thought Leadership'],
    ['Courses', '209', '10%', 'Education / Training'],
    ['Education', '84', '4%', 'Education Landing Pages'],
    ['About/Corporate', '54', '2%', 'Corporate / Company'],
    ['Services', '29', '1%', 'Service Offerings'],
    ['Events', '26', '1%', 'Events & Conferences'],
    ['Specialties', '25', '1%', 'Medical Specialties'],
    ['Campaigns', '20', '1%', 'Marketing Campaigns'],
    ['News/Press', '13', '1%', 'Press Releases'],
    ['Shop (eCommerce)', '9', '<1%', 'eCommerce (Sitecore JSS)'],
    ['Corporate/Other', '~46', '2%', 'Initiatives, Support, etc.'],
])

doc.add_heading('1.4 Pages by Content Type', level=2)
add_table(['Type', 'Est. %', 'Est. Pages', 'Description'], [
    ['Static Authored (CMS)', '~80%', '~1,740', 'Product pages, about, services, specialties'],
    ['Dynamic/API-Driven', '~15%', '~325', 'Insights/articles feed, courses catalog, events'],
    ['Hybrid (Static + Personalization)', '~5%', '~107', 'Homepage (Adobe Target), campaign landing pages'],
])

doc.add_heading('1.5 Pages by Category', level=2)
doc.add_paragraph('Pages Integrated with eCommerce:', style='List Bullet')
doc.add_paragraph('Shop pages (/shop) — ~9 pages on Sitecore JSS with SAP Hybris backend', style='List Bullet 2')
doc.add_paragraph('Product Detail Pages with Affirm pricing — ~20+ PDPs', style='List Bullet 2')
doc.add_paragraph('Cart icon integration across all pages (header)', style='List Bullet 2')

doc.add_paragraph('Pages Fed from Other Systems:', style='List Bullet')
doc.add_paragraph('Careers (careers.gehealthcare.com) — external recruitment platform', style='List Bullet 2')
doc.add_paragraph('Investor Relations (investor.gehealthcare.com) — external IR platform', style='List Bullet 2')
doc.add_paragraph('Product Security (productsecurity/home) — separate security portal', style='List Bullet 2')

doc.add_heading('1.6 Design System Analysis', level=2)
doc.add_paragraph(
    'The site uses AEM Core Components (cmp-* namespace) as its foundation, with custom GE HealthCare '
    'components layered on top (ge-feature-card, ge-product-media-carousel, category-hero, etc.). '
    'Material Design Components (MDC) grid is used alongside AEM responsive grid. '
    'The legacy Sitecore JSS /shop pages use a completely different component system that is being deprecated. '
    'Overall: moderately unified design system with AEM Core Components + custom GE overlay. '
    'GE brand colors: dark navy (#002B49), white, teal accents.'
)

doc.add_page_break()

# === 2. TEMPLATES INVENTORY ===
doc.add_heading('2. Templates Inventory', level=1)
add_table(['#', 'Template Name', 'AEM Template', 'Complexity', 'Example URL', 'Description'], [
    ['T1', 'Homepage', 'homepage-template', 'High', '/en-us', 'Hero carousel (2+ slides, play/pause), category cards carousel, "What\'s New" editorial cards, stats counter, S-curve cards (3), CTA banner. Adobe Target personalization.'],
    ['T2', 'Product Category', 'generic-page-template', 'Medium', '/en-us/products/ultrasound', 'Category hero (image + H1 + CTA), video carousel, product card grid, S-curve feature sections, Marketo form modal, promo cards, CTA banner'],
    ['T3', 'Product Detail (PDP)', 'generic-page-template', 'High', '/en-us/products/ultrasound/handheld-ultrasound/vscan-air-sl', 'Sticky sub-nav with tabs, product hero with pricing/Affirm, "At a Glance" icon grid, feature carousels, S-curve features, FAQ accordion, support cards, resource downloads'],
    ['T4', 'Insights Hub', 'generic-page-template', 'Medium', '/en-us/insights', 'Text hero, 2-column editorial card grid, section headers with eyebrow text'],
    ['T5', 'Article/Content', 'generic-page-template', 'Low-Med', '/en-us/insights/article/five-key-trends...', 'Article hero image, rich text body, author info, related content cards, social sharing'],
    ['T6', 'Contact Us', 'generic-page-template', 'Medium', '/en-us/about/contact-us', 'Heading, dynamic form with dropdown routing, reCAPTCHA, phone directory'],
    ['T7', 'Specialties Hub', 'generic-page-template', 'Low', '/en-us/specialties', 'Sticky sub-nav, text intro, 3x2 specialty card grids (alphabetical), CTA banner'],
    ['T8', 'Education/Courses', 'generic-page-template', 'Medium', '/en-us/courses', 'Category hero, training card grid, resource icon cards, feature cards, CTA banner'],
    ['T9', 'Services', 'generic-page-template', 'High', '/en-us/services', 'Sticky sub-nav, hero, anchor nav bar, icon grid, sectioned card groups, tab interface (8 tabs), CTA banner. Most complex template.'],
    ['T10', 'Shop/eCommerce', 'Sitecore JSS', 'High', '/shop', 'Different CMS (Sitecore). Hero, category carousel, featured products, Affirm/SAP Hybris integration'],
    ['T11', 'Events', 'generic-page-template', 'Low', '/en-us/events', 'Minimal listing page. Content likely loaded dynamically'],
    ['T12', 'Campaigns', 'generic-page-template', 'Medium', '/en-us/campaigns/*', 'Marketing landing pages with hero, form capture, feature content'],
    ['T13', 'Newsroom/Press', 'generic-page-template', 'Medium', '/en-us/about/newsroom', 'Press release listing, article cards, pagination'],
    ['T14', 'Corporate/About', 'generic-page-template', 'Low-Med', '/en-us/about, /en-us/about/compliance', 'Standard content pages with text sections, link lists'],
])

doc.add_page_break()

# === 3. BLOCKS CATALOG ===
doc.add_heading('3. Blocks Catalog', level=1)
blocks = [
    ['B1', 'Global Header', 'High', 'GE logo, mega-nav with multi-level flyout, search (Algolia), sign-in, cart, hamburger mobile menu, country selector', 'All pages', 'No - custom build', 'Yes (Algolia, auth, cart)', 'No', 'No'],
    ['B2', 'Global Footer', 'Medium', 'Logo, 7-column link grid, compliance links, country selector, social icons, copyright', 'All pages', 'No - custom build', 'No', 'No', 'No'],
    ['B3', 'Hero Carousel', 'High', 'Multi-slide hero with bg images, H1, CTAs, prev/next/play-pause, slide counter. AEM cmp-carousel', 'Homepage', 'Variant of Carousel', 'No', 'Yes', 'No'],
    ['B4', 'Category Hero', 'Medium', 'Full-width hero with bg image, H1, body text, CTA button', 'Product category', 'Variant of Hero', 'No', 'Yes', 'No'],
    ['B5', 'Product Hero (Pricing)', 'High', 'Product image, H1, pricing ($4,999), Affirm financing, dual CTAs (Buy now / Demo)', 'PDP pages', 'No - custom build', 'Yes (pricing, Affirm)', 'No', 'No'],
    ['B6', 'Category Cards Carousel', 'Medium', 'Horizontal scrollable icon+text cards for product categories, prev/next arrows', 'Homepage', 'Variant of Carousel', 'No', 'Yes', 'No'],
    ['B7', 'Feature Cards', 'Low', 'Image + H3 + description + "Learn more" CTA. Grid layout (2-col/3-col). Most common component', 'All templates', 'Variant of Cards', 'No', 'Yes', 'No'],
    ['B8', 'S-Curve Cards', 'Medium', 'Alternating side-by-side image + text. H3 + paragraph + CTA', 'Homepage, Category', 'Variant of Columns', 'No', 'Yes', 'No'],
    ['B9', 'Stats Counter', 'Low', '4-column grid of large numbers + descriptions (~$5.1B, 5M+, 1B+, 110+)', 'Homepage', 'No - custom build', 'No', 'Yes', 'No'],
    ['B10', 'Editorial Cards', 'Low', 'Image + H3 + link. Horizontal scrollable row with section header', 'Homepage', 'Variant of Cards', 'No', 'Yes', 'No'],
    ['B11', 'Product Media Carousel', 'Medium', 'Video/image carousel for product demos, with progress bar and indicators', 'Product pages', 'Variant of Carousel', 'No', 'Yes', 'No'],
    ['B12', 'Sticky Sub-Navigation', 'Medium', 'Fixed top bar with product name, section tabs, CTA buttons', 'PDP, Services', 'No - custom build', 'No', 'Yes', 'No'],
    ['B13', 'At a Glance (Icon Grid)', 'Low', '4-column icon + headline + description grid', 'PDP pages', 'Variant of Cards', 'No', 'Yes', 'No'],
    ['B14', 'FAQ Accordion', 'Low', 'Expandable Q&A sections with +/- toggle icons', 'PDP pages', 'No - custom (Accordion)', 'No', 'Yes', 'No'],
    ['B15', 'Anchor Navigation', 'Medium', 'Horizontal scrollable anchor links for in-page section navigation', 'Services page', 'No - custom build', 'No', 'Yes', 'No'],
    ['B16', 'Tab Interface', 'Medium', 'Tabbed content with 8 selectable tabs displaying different panels', 'Services page', 'No - custom build', 'No', 'Yes', 'No'],
    ['B17', 'Marketo Form (Modal)', 'High', 'Lead gen form via Marketo, triggered from CTA. Modal overlay', 'Product, campaigns', 'No - Marketo integration', 'Yes (Marketo API)', 'No', 'Yes (Medium)'],
    ['B18', 'CTA Banner', 'Low', '"Have a question?" H2 + "Contact us" button. Full-width', 'Most pages', 'Yes - standard EDS', 'No', 'Yes', 'No'],
    ['B19', 'Resource Downloads', 'Low', 'Cards with download links for brochures, datasheets', 'PDP pages', 'Variant of Cards', 'No', 'Yes', 'No'],
    ['B20', 'Cookie Consent Banner', 'Low', 'Evidon-powered dialog with Allow/Accept/Customize', 'All pages', 'No - Evidon integration', 'Yes (Evidon)', 'No', 'No'],
    ['B21', 'Vidyard Video Player', 'Medium', 'Embedded video player for product demos and articles', 'Product, articles', 'No - Vidyard embed', 'Yes (Vidyard)', 'No', 'No'],
    ['B22', 'Country Selector', 'Low', 'Accordion-style country/locale picker with flag icons', 'Footer', 'No - custom build', 'No', 'Yes', 'No'],
    ['B23', 'Disclaimer/References', 'Low', 'Small text footnotes and regulatory disclaimers', 'Product pages', 'Yes - default content', 'No', 'Yes', 'No'],
    ['B24', 'Separator', 'Low', 'Horizontal rule divider between sections', 'Services, products', 'Yes - standard EDS', 'No', 'Yes', 'No'],
    ['B25', 'Search (Algolia)', 'High', 'Full-featured search with autocomplete, powered by Algolia', 'All pages (header)', 'No - Algolia integration', 'Yes (Algolia API)', 'No', 'No'],
    ['B26', 'Sign-in / Auth', 'Medium', 'User authentication flow for MyGEHealthCare portal', 'Header', 'No - custom build', 'Yes (auth API)', 'No', 'Yes (Medium)'],
    ['B27', 'Shopping Cart', 'Medium', 'Cart icon with count badge, links to shop', 'Header', 'No - custom build', 'Yes (cart API)', 'No', 'Yes (Medium)'],
    ['B28', 'Transition Banner', 'Low', 'Deprecation notice directing users from legacy to new site', 'Legacy pages', 'N/A - will be removed', 'No', 'No', 'No'],
]
add_table(['#', 'Block', 'Complexity', 'Description', 'Reference', 'Std EDS?', 'Backend?', 'LLM-Ready?', 'UI Ext?'], blocks)

doc.add_page_break()

# === 4. PAGE COUNTS ===
doc.add_heading('4. Page Counts by Template', level=1)
add_table(['Template', 'Est. Pages', 'Auto-Migratable?', 'Notes'], [
    ['T1: Homepage', '1', 'No - Manual', 'Adobe Target personalization, complex carousel'],
    ['T2: Product Category', '~50', 'Partially', 'Reusable template, Marketo form needs manual setup'],
    ['T3: Product Detail (PDP)', '~850', 'Partially', 'Pricing/Affirm needs integration; content is structured'],
    ['T4: Insights Hub', '1', 'Yes - Automated', 'Simple card layout'],
    ['T5: Article/Content', '~750', 'Yes - Automated', 'Most structured, standardized content'],
    ['T6: Contact Us', '1', 'No - Manual', 'Complex form routing, reCAPTCHA'],
    ['T7: Specialties Hub', '1', 'Yes - Automated', 'Simple card grid'],
    ['T8: Education/Courses', '~290', 'Partially', 'Course catalog may be API-driven'],
    ['T9: Services', '~30', 'Partially', 'Complex tabs/anchor nav need custom blocks'],
    ['T10: Shop/eCommerce', '~9', 'OUT OF SCOPE', 'Different CMS (Sitecore JSS), being deprecated'],
    ['T11: Events', '~26', 'Partially', 'Dynamic listings need feed integration'],
    ['T12: Campaigns', '~20', 'No - Manual', 'Custom landing pages with unique layouts'],
    ['T13: Newsroom/Press', '~13', 'Partially', 'Press release feed likely API-driven'],
    ['T14: Corporate/About', '~130', 'Yes - Automated', 'Standard content pages'],
])

doc.add_paragraph('')
doc.add_heading('Migration Classification Summary', level=2)
add_table(['Classification', 'Pages', '%'], [
    ['Automatically Migratable', '~930', '43%'],
    ['Semi-Automated (template + adjustments)', '~1,000', '46%'],
    ['Manual Migration', '~233', '11%'],
    ['Out of Scope (Sitecore shop)', '~9', '<1%'],
])

doc.add_page_break()

# === 5. INTEGRATIONS ===
doc.add_heading('5. Integrations Analysis', level=1)
add_table(['#', 'Integration', 'Type', 'Complexity', 'Client/Server', 'Active?'], [
    ['I1', 'Adobe Target', 'Personalization API', 'High', 'Server', 'Active'],
    ['I2', 'Google Tag Manager (GTM-58LKHLP)', 'Tag Manager', 'Medium', 'Client', 'Active'],
    ['I3', 'Google Tag Manager (GTM-W4V7GZG)', 'Tag Manager', 'Medium', 'Client', 'Active'],
    ['I4', 'Google Ads (AW-357630064, AW-435915669)', 'Remarketing', 'Low', 'Client', 'Active'],
    ['I5', 'DoubleClick (DC-10528130)', 'Ad Tracking', 'Low', 'Client', 'Active'],
    ['I6', 'Evidon (Crownpeak)', 'Cookie Consent', 'Medium', 'Client', 'Active'],
    ['I7', 'Marketo', 'Marketing Automation / Forms', 'High', 'Client + Server', 'Active'],
    ['I8', 'Algolia', 'Search-as-a-Service', 'High', 'Client + Server', 'Active'],
    ['I9', 'Vidyard', 'Video Hosting/Player', 'Medium', 'Client', 'Active'],
    ['I10', 'Nrich.ai', 'ABM/Intent Data', 'Low', 'Client', 'Active'],
    ['I11', 'AEM Dynamic Media / Scene7', 'Image Delivery/DAM', 'Medium', 'Server', 'Active'],
    ['I12', 'Affirm', 'Buy Now Pay Later', 'Medium', 'Client', 'Active'],
    ['I13', 'SAP Hybris', 'eCommerce Backend', 'High', 'Server', 'Active (legacy)'],
    ['I14', 'Google reCAPTCHA', 'Bot Protection', 'Low', 'Client', 'Active'],
    ['I15', 'Veeva', 'Pharma CRM', 'Medium', 'Client + Server', 'Active'],
    ['I16', 'Sitecore JSS', 'Legacy CMS (React SPA)', 'High', 'Server', 'Deprecated'],
])

doc.add_page_break()

# === 6. FORMS ===
doc.add_heading('6. Forms Analysis', level=1)
add_table(['#', 'Form Type', 'Complexity', 'Sample URL', 'Features', 'Backend'], [
    ['F1', 'Algolia Search Form', 'Medium', 'All pages (header)', 'Autocomplete, category filtering', 'Algolia API'],
    ['F2', 'Marketo Lead Gen (Modal)', 'High', '/en-us/products/ultrasound', 'Multi-field, progressive profiling, hidden fields', 'Marketo API'],
    ['F3', 'Contact Us Routing Form', 'High', '/en-us/about/contact-us', 'Dropdown routing, conditional fields, reCAPTCHA', 'Marketo + reCAPTCHA'],
    ['F4', 'Email Preferences', 'Medium', '/en-us/about/email-preferences', 'Subscription management, opt-in/out', 'Marketo preference center'],
    ['F5', 'Sign-in Form', 'High', 'Header (modal/flyout)', 'Authentication, MyGEHealthCare portal', 'Auth API (SSO/OAuth)'],
    ['F6', 'Cookie Preferences', 'Low', 'All pages (Evidon dialog)', 'Consent categories, manage/accept/reject', 'Evidon'],
    ['F7', 'Cart/Checkout', 'High', '/shop (Sitecore)', 'Add to cart, quantity, checkout flow', 'SAP Hybris'],
])

doc.add_page_break()

# === 7. OFFERS ===
doc.add_heading('7. Offers / Personalization Analysis', level=1)
add_table(['#', 'Offer Type', 'Complexity', 'Sample URL', 'Backend'], [
    ['O1', 'Homepage Hero Personalization', 'High', '/en-us — carousel slides via Adobe Target', 'Adobe Target (server-side)'],
    ['O2', 'Product Recommendations', 'Medium', 'Various product pages', 'Adobe Target mboxes (4 returned per page)'],
    ['O3', 'Geo-based Content', 'Medium', 'All pages — country selector + locale routing', 'GeoIP locator (countrymapping)'],
    ['O4', 'Campaign Landing Pages', 'Low', '/en-us/campaigns/*', 'Authored content (static)'],
    ['O5', 'Transition Banner', 'Low', 'Legacy pages — "outdated site experience"', 'Static rule-based'],
])

doc.add_page_break()

# === 8. COMPLEX USE CASES ===
doc.add_heading('8. Complex Use Cases & Observations', level=1)
add_table(['#', 'Use Case', 'Instances', 'Where Found', 'Why Complex'], [
    ['C1', 'Dual CMS Architecture', 'Site-wide', 'AEM (/en-us/*) + Sitecore JSS (/shop)', 'Two different tech stacks under same domain'],
    ['C2', 'Adobe Target Server-Side', '~5+ pages', 'Homepage, product pages', 'Server-side Target with 4+ mboxes; needs edge worker'],
    ['C3', 'Marketo Form Integration', '~70+ pages', 'Products, campaigns, contact', 'Modal forms with progressive profiling, conditional logic'],
    ['C4', 'Affirm Financing on PDP', '~20+ PDPs', 'Select products', 'Dynamic pricing + Affirm widget requires JS integration'],
    ['C5', 'Algolia Search', 'All pages', 'Header search', 'Full-text search with autocomplete across catalog'],
    ['C6', '10+ Locale Variants', '~12,950 URLs', 'Entire site', 'Multi-locale with path-based routing'],
    ['C7', 'Dynamic Media / Scene7', 'All pages', 'Image delivery', 'Images via Scene7 CDN with dynamic transformations'],
    ['C8', 'Sticky Sub-Navigation', '~100+ pages', 'PDP, Services, Specialties', 'Fixed-position nav with scroll-aware active states'],
    ['C9', 'eCommerce Integration', '/shop + PDPs', 'Cart, checkout, pricing', 'SAP Hybris + Affirm + user auth'],
    ['C10', 'Veeva CRM Integration', 'Homepage, campaigns', 'Marketing content', 'Pharma CRM compliance for content tracking'],
])

doc.add_page_break()

# === 9. OUTLIER SCENARIOS ===
doc.add_heading('9. Outlier Scenarios', level=1)
add_table(['#', 'Scenario', 'Behavior', 'Implementation', 'Effort'], [
    ['OS1', 'Sitecore JSS Shop Pages', 'Entire /shop section runs as React SPA with SAP Hybris', 'Keep separate or rebuild in EDS', 'Out of scope / 300+ hrs'],
    ['OS2', 'Adobe Target Server-Side', 'Homepage personalization via server-side Target API (4+ mboxes)', 'Edge worker for Target orchestration', '40-60 hours'],
    ['OS3', 'Marketo Modal Forms', 'Forms loaded async via Marketo embed, triggered from CTAs', 'EDS form block with Marketo API', '30-50 hours'],
    ['OS4', 'Affirm Pricing Widget', 'Dynamic BNPL pricing on PDP pages', 'Client-side Affirm.js in EDS block', '15-25 hours'],
    ['OS5', 'Scene7 Dynamic Media', 'All images with on-the-fly transformations', 'EDS image optimization or keep Scene7 CDN', '20-40 hours'],
    ['OS6', 'Course Catalog (209 pages)', 'Education content possibly fed from LMS', 'API integration or static migration', '20-40 hours'],
])

doc.add_page_break()

# === 10. MIGRATION ESTIMATES ===
doc.add_heading('10. Migration Estimates', level=1)

doc.add_heading('Scope Definition', level=2)
doc.add_paragraph('In-Scope for EDS Migration: ~2,163 US/EN pages (excluding Sitecore /shop)')
doc.add_paragraph('Out of Scope: Sitecore JSS shop pages (~9), SAP Hybris eCommerce backend')

doc.add_heading('Effort Breakdown', level=2)
add_table(['Phase', 'Activity', 'Hours', 'Days (1 FTE)'], [
    ['Phase 1: Foundation', 'Design system extraction & EDS CSS custom properties', '40', '5'],
    ['', 'Global header block (mega-nav + Algolia + auth + cart)', '80', '10'],
    ['', 'Global footer block', '24', '3'],
    ['', 'Core EDS block library (25 custom blocks/variants)', '200', '25'],
    ['', 'Edge worker setup (Adobe Target, APIs)', '40', '5'],
    ['Phase 2: Templates', 'Template T3 (Product Detail) - ~850 pages', '120', '15'],
    ['', 'Template T5 (Article/Content) - ~750 pages', '80', '10'],
    ['', 'Template T2 (Product Category) - ~50 pages', '40', '5'],
    ['', 'Template T8 (Education/Courses) - ~290 pages', '60', '8'],
    ['', 'Template T9 (Services) - ~30 pages', '40', '5'],
    ['', 'Templates T1, T4, T6, T7, T11-T14 - ~143 pages', '60', '8'],
    ['Phase 3: Integrations', 'Adobe Target personalization in EDS', '60', '8'],
    ['', 'Algolia search integration', '40', '5'],
    ['', 'Marketo form integration', '40', '5'],
    ['', 'Vidyard video integration', '16', '2'],
    ['', 'Affirm financing widget', '20', '3'],
    ['', 'Analytics (GTM) migration', '16', '2'],
    ['', 'Third-party (Evidon, Nrich, Veeva, reCAPTCHA)', '32', '4'],
    ['Phase 4: Content', 'Automated content import (~930 pages)', '60', '8'],
    ['', 'Semi-automated content import (~1,000 pages)', '160', '20'],
    ['', 'Manual content migration (~233 pages)', '120', '15'],
    ['Phase 5: QA', 'Visual regression testing', '60', '8'],
    ['', 'Functional testing (forms, search, cart, nav)', '40', '5'],
    ['', 'Performance testing (Lighthouse 100)', '32', '4'],
    ['', 'Accessibility testing (WCAG 2.1 AA)', '32', '4'],
    ['', 'UAT & stakeholder review', '40', '5'],
    ['Phase 6: Locales', 'Multi-locale setup & migration (9+ locales)', '240', '30'],
])

doc.add_paragraph('')
doc.add_heading('Summary', level=2)
add_table(['Category', 'Hours', 'Days'], [
    ['Foundation (Design + Blocks + Infra)', '384', '48'],
    ['Template Migration', '400', '51'],
    ['Integrations', '224', '29'],
    ['Content Migration', '340', '43'],
    ['QA & Testing', '204', '26'],
    ['Locale Rollout', '240', '30'],
    ['TOTAL (US/EN only)', '1,552', '~197'],
    ['TOTAL (All locales)', '1,792', '~227'],
])

doc.add_paragraph('')
doc.add_heading('Team Recommendation', level=2)
doc.add_paragraph('With a team of 3-4 FTEs (2 frontend developers, 1 integration/content specialist, 1 QA engineer):')
doc.add_paragraph('US/EN migration: ~3-4 months', style='List Bullet')
doc.add_paragraph('Full multi-locale migration: ~4-5 months', style='List Bullet')
doc.add_paragraph('Total calendar time with buffer: ~6 months', style='List Bullet')

doc.add_page_break()

# === 11. TEMPLATE SCREENSHOTS ===
doc.add_heading('11. Template Screenshots', level=1)
doc.add_paragraph('The following screenshots capture representative pages for each identified template type.')

screenshots = [
    ('T1-homepage.png', 'T1: Homepage — gehealthcare.com/en-us'),
    ('T2-product-category.png', 'T2: Product Category — Ultrasound'),
    ('T3-product-detail.png', 'T3: Product Detail (PDP) — Vscan Air SL'),
    ('T4-insights-hub.png', 'T4: Insights Hub'),
    ('T5-article.png', 'T5: Article/Content — Five Key Trends'),
    ('T6-contact-us.png', 'T6: Contact Us'),
    ('T7-specialties.png', 'T7: Specialties Hub'),
    ('T9-services.png', 'T9: Services (most complex template)'),
    ('T10-shop.png', 'T10: Shop/eCommerce (Sitecore JSS — legacy)'),
    ('T13-newsroom.png', 'T13: Newsroom/Press'),
]

for filename, caption in screenshots:
    doc.add_heading(caption.split(' — ')[0], level=2)
    add_screenshot(filename, caption, width=6.5)
    doc.add_paragraph('')

# Save
output = '/workspace/GEHealthCare_AMS_to_EDS_Migration_Analysis.docx'
doc.save(output)
print(f'Report saved to {output}')
