Let me analyze the TD SYNNEX website to determine its platform.# TD SYNNEX Website Platform Analysis

## Finding: NOT on AEM — It's WordPress

The site at **https://www.tdsynnex.com/na/us/** is powered by **WordPress 6.9.4**, not any version of AEM.

### Platform Identification

| Indicator | Result |
|-----------|--------|
| **CMS Platform** | WordPress 6.9.4 |
| **Theme** | Visual Composer Starter (v3.3) with Bootstrap 4.6.1 |
| **Page Builder** | Visual Composer plugin (v45.15.0) |
| **JavaScript** | jQuery 3.7.1 + jQuery Migrate 3.4.1 |
| **Additional Plugin** | Super RSS Reader Pro (v5.2) |

### AEM Checks Performed

| AEM Version | Key Indicators Checked | Found? |
|------------|----------------------|--------|
| **AEM EDS** | `aem.live` / `hlx.live` scripts, `/scripts/aem.js`, Franklin generator meta | **None found** |
| **AEM Cloud Service** | `window.CQ`, `window.Granite`, `cmp-*` classes, `aem-Grid`, `etc.clientlibs` | **None found** |
| **AEM 6.5** | `/etc/designs/`, `cq:` attributes, older clientlib patterns | **None found** |

### WordPress Evidence

- `<meta name="generator" content="WordPress 6.9.4">`
- Body classes: `home wp-singular page-template-default page page-id-340 wp-custom-logo wp-theme-visual-composer-starter`
- Scripts/CSS served from `/wp-content/` and `/wp-includes/` paths
- WordPress REST API link (`rel="https://api.w.org/"`) present

### Important Note

There are references to `etc.clientlibs` and `/content/dam/` in some footer links (Privacy, Terms & Conditions, Careers), which suggests **other sections of tdsynnex.com** (outside `/na/us/`) may run on AEM. The `/na/us/` path specifically is a standalone WordPress installation.

---

## Checklist

- [x] Navigate to https://www.tdsynnex.com/na/us/
- [x] Check for AEM EDS indicators (aem.live, hlx.live, scripts/aem.js)
- [x] Check for AEM Cloud Service indicators (window.CQ, cmp-*, aem-Grid)
- [x] Check for AEM 6.5 indicators (/etc/designs/, cq: attributes)
- [x] Check for alternative CMS platforms (WordPress, Sitecore, Drupal)
- [x] Identify the actual CMS and version
- [x] Document findings
