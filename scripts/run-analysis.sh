#!/bin/bash
# run-analysis.sh — end-to-end site-analysis dashboard pipeline.
# Resumable: every stage skips work already on disk. Safe to re-run after a restart.
#
# Usage: bash run-analysis.sh <catalogFolder>
#   catalogFolder must already contain config.json (see SKILL.md).
# Env you may override: CONCURRENCY (default 5), MAX_PAGES (default 9000),
#   RENDER_SAMPLE (default 4), CJK (1 to install a Japanese font first).
set +H 2>/dev/null || true
CF="${1:?usage: run-analysis.sh <catalogFolder>}"
SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
CONCURRENCY="${CONCURRENCY:-5}"; MAX_PAGES="${MAX_PAGES:-9000}"; RENDER_SAMPLE="${RENDER_SAMPLE:-4}"

# --- resolve playwright-core (bundled with the scrape-webpage skill) + chromium ---
PW_NODE_MODULES="$(dirname "$(find /home/node/.excat-marketplaces -type d -name playwright-core 2>/dev/null | head -1)")"
export NODE_PATH="$PW_NODE_MODULES"
node -e "require('playwright-core')" 2>/dev/null || { echo "❌ playwright-core not found; set NODE_PATH to a node_modules that has it"; exit 1; }

cfg(){ node -e "console.log((JSON.parse(require('fs').readFileSync('$CF/config.json')).$1)||'')"; }
SITE_URL="$(cfg siteUrl)"; SITE_ORIGIN="$(cfg siteOrigin)"
[ -z "$SITE_URL" ] && SITE_URL="$SITE_ORIGIN"

echo "▶ catalog: $CF"; echo "▶ site: $SITE_URL"

# --- optional CJK font (needed for Japanese/Chinese/Korean screenshots) ---
if [ "${CJK:-0}" = "1" ]; then bash "$SKILL_DIR/install-cjk-font.sh" "$CF"; fi

# --- 1. URL discovery (crawl) -> urls-all.json ---
if [ ! -f "$CF/urls-all.json" ]; then
  echo "▶ [1/9] crawling $SITE_URL (this can take a while for large sites)"
  CRAWL="$(find /home/node/.excat-marketplaces -name crawl-site.js -path '*url-discovery*' 2>/dev/null | head -1)"
  NODE_OPTIONS="--max-old-space-size=8192" node "$CRAWL" "$SITE_URL" --max-pages "$MAX_PAGES" --delay 350 --timeout 15000 --max-retries 1 --checkpoint-file "$CF/crawl-checkpoint.json" --logFile "$CF/catalog.log" > "$CF/.crawl.out" 2>>"$CF/catalog.log"
  node "$SKILL_DIR/build-urls-all.js" "$CF"
else echo "▶ [1/9] urls-all.json exists — skip crawl"; fi

# --- 2. render set from URL patterns -> render-set.json, groups.json ---
[ -f "$CF/render-set.json" ] || { echo "▶ [2/9] build render set"; node "$SKILL_DIR/build-render-set.js" "$CF" 2 "$RENDER_SAMPLE"; }

# --- 3. render + fingerprint -> pages.jsonl ---
echo "▶ [3/9] render + fingerprint (resumable)"; node "$SKILL_DIR/render-pages.js" "$CF" --concurrency "$CONCURRENCY"

# --- 4. cluster into layouts -> layouts.json (+ integrations.json placeholder) ---
echo "▶ [4/9] cluster layouts"; node "$SKILL_DIR/cluster-layouts.js" "$CF"

# --- 5. capture block instances -> blocks.jsonl + blocks/ ---
echo "▶ [5/9] capture block instances (resumable)"; node "$SKILL_DIR/capture-blocks.js" "$CF" --concurrency "$CONCURRENCY"

# --- 6. consolidate blocks -> block-catalog.json ---
echo "▶ [6/9] consolidate block variants"; node "$SKILL_DIR/consolidate-blocks.js" "$CF"

# --- 7. per-layout full-page screenshots -> shots/ + shots.json ---
echo "▶ [7/9] capture template screenshots"; node "$SKILL_DIR/capture-shots.js" "$CF"

# --- 8. methodology diagrams -> shots/*-diagram.jpg ---
echo "▶ [8/9] build methodology diagrams"; node "$SKILL_DIR/make-diagrams.js" "$CF" || echo "  (diagrams optional — continuing)"

# --- 9. compute supplementary data + assemble dashboard ---
echo "▶ [9/9] compute data + build dashboard"
node "$SKILL_DIR/compute-data.js" "$CF" "$SITE_ORIGIN"
node "$SKILL_DIR/build-dashboard.js" "$CF"
echo "✅ done."
