---
name: Site Analysis Dashboard
description: Run an exhaustive site analysis of any website and produce a self-contained, multi-section interactive HTML dashboard to scope an AEM Edge Delivery Services migration. Crawls every page, groups URLs by pattern, renders + structurally fingerprints pages into layout families, catalogs block variants (with an Unknown/Custom group) with cropped screenshots + source URLs, scans third-party integrations (site-wide, per-template, and per-block-type heatmaps), builds pictorial methodology step-diagrams, and assembles a dashboard with Overview, Methodology, Page Templates (full-page popups), Blocks & Components galleries, Human-in-the-loop Review, Integrations, URL Coverage, Site Structure, Linked Documents and Recommendations. Handles multi-locale sites and installs a CJK font so Japanese/Chinese/Korean text renders correctly in screenshots. Use when asked to "analyze a site", "site analysis report/dashboard", "scope a migration", "discover pages and layouts", "catalog blocks", or "build a migration console" for a URL.
---

# Site Analysis Dashboard

Turns a live website into a single self-contained interactive HTML dashboard for scoping an
AEM Edge Delivery Services migration. This is the generalized pipeline first built for the
Marubeni.com analysis.

## When to use

- "Do a full site analysis of `https://example.com`"
- "Build a migration console / site-analysis dashboard for this site"
- "Discover all pages and layouts and catalog the blocks"
- "How many page templates / block variants does this site have?"

## What it produces

`reports/<site>-site-analysis-dashboard.html` — one self-contained file (all screenshots
embedded as base64) with these sections:

1. **Overview** — KPIs, key findings, site metrics, method.
2. **Methodology** — how the analysis works, with two pictorial worked-example step-diagrams
   (a recognised block and an Unknown/Custom block, each traced through the detection cascade).
3. **Page Templates** — layout families with page-population estimates, key blocks, sample
   URLs, and a full-page screenshot popup per template.
4. **Blocks & Components** — top-variant table + tabbed galleries per base block type
   (Cards, Media, Table, Form, Embed, Breadcrumbs, Hero, List, Text, **Unknown/Custom**),
   every variant with a cropped screenshot, usage counts and a clickable source URL.
5. **Human-in-the-loop Review** — editable canvas pre-seeded from the analysis (per-site
   localStorage key; "Reset to analysis baseline" re-seeds).
6. **Integrations** — detected third-party services + **per-template** and **per-block-type**
   coverage heatmaps (Percent/Counts toggles).
7. **URL Coverage** — full inventory grouped by locale + status counts.
8. **Site Structure**, **Linked Documents**, **Recommendations**.

## Prerequisites (environment)

- **Headless Chromium** via the bundled `playwright-core` (ships with the `scrape-webpage`
  skill). The orchestrator auto-discovers it and sets `NODE_PATH`. A Chromium binary must be
  installed (e.g. `/ms-playwright/chromium-*/chrome-linux64/chrome`).
- **Node.js** (uses only built-ins + playwright-core).
- For multi-locale/CJK sites, set `CJK=1` so a Japanese font is installed before screenshots
  (already-running browsers cache fontconfig — the pipeline always launches fresh browsers).

## How to run

1. **Create a working folder and `config.json`.** Put it anywhere durable (NOT `/tmp`, which
   can be wiped mid-run — use a folder inside the repo, e.g. `.migration/<site>-scope/`).
   See `templates/config.example.json`. Minimum fields:

   ```json
   {
     "siteUrl": "https://www.example.com/",
     "siteOrigin": "https://www.example.com",
     "site": "example.com",
     "scope": "Entire domain",
     "catalogFolder": "/abs/path/.migration/example-scope",
     "reportsDir": "/abs/path/reports",
     "templateHtml": "/abs/path/.claude/skills/site-analysis-dashboard/templates/dashboard-template.html",
     "cjk": false
   }
   ```

2. **Run the pipeline** (resumable — safe to re-run after any restart; each stage skips work
   already on disk):

   ```bash
   CJK=1 bash .claude/skills/site-analysis-dashboard/scripts/run-analysis.sh \
     /abs/path/.migration/example-scope
   ```

3. Open the resulting `reports/<site>-site-analysis-dashboard.html` in any browser.

### Scale checkpoint (important for large sites)

The crawl runs to completion and can find thousands of pages. After stage 1 (`urls-all.json`),
**stop and report the page count + per-locale breakdown to the user before mass-rendering**,
and confirm the render scope. To bound work, the render set is built by URL-pattern grouping:
recurring patterns (≥2 pages) are sampled (`RENDER_SAMPLE`, default 4) and every long-tail
unique page is rendered in full — so no layout/block is missed while keeping the render count
tractable. Attachments/images are always excluded from rendering.

## Pipeline stages (scripts/)

| # | Script | Input → Output |
|---|--------|----------------|
| 1 | `run-analysis.sh` → crawler + `build-urls-all.js` | site → `urls-all.json` |
| 2 | `build-render-set.js` | `urls-all.json` → `render-set.json`, `groups.json` |
| 3 | `render-pages.js` | render set → `pages.jsonl` (structural fingerprints) |
| 4 | `cluster-layouts.js` | `pages.jsonl` → `layouts.json` |
| 5 | `capture-blocks.js` | render set → `blocks.jsonl` + `blocks/*.jpg` |
| 6 | `consolidate-blocks.js` | `blocks.jsonl` → `block-catalog.json` |
| 7 | `capture-shots.js` | `layouts.json` → `shots/*.jpg` + `shots.json` |
| 8 | `make-diagrams.js` | `block-catalog.json` → `shots/*-diagram.jpg` |
| 9 | `compute-data.js` + `build-dashboard.js` | all of the above → the dashboard HTML |

`install-cjk-font.sh` installs/verifies the CJK font (with a per-catalog backup for fast
restore after a reset).

## Key design notes / gotchas

- **Resumability:** `render-pages.js` and `capture-blocks.js` skip pages already recorded; the
  crawler checkpoints. Keep artifacts in a durable folder so a mid-run restart resumes cheaply.
- **Block classification** is a 5-tier heuristic cascade (class/id keywords → semantic HTML →
  content heuristics → media-vs-text → **Unknown/Custom fallback**). The `text` base is plain
  prose; composite blocks with no standard signal become `unknown` (kept for manual review).
- **`SITE` origin:** `build-dashboard.js` sets the dashboard's link-resolver origin from
  `config.siteOrigin`. If this is wrong, every source link breaks — always set it.
- **Per-site localStorage keys:** the Human Review tool namespaces its storage by `site`, so
  one browser can hold multiple site dashboards without cross-contaminating cached review data.
- **Heap:** the crawler runs with `--max-old-space-size=8192`; large domains otherwise OOM.
- **CJK:** verify `fc-match 'sans-serif:lang=ja'` resolves to Noto before capturing screenshots.

## Related skills

- `excat-url-discovery` (provides the crawler used in stage 1)
- `scrape-webpage` (provides the bundled `playwright-core` + Chromium)
