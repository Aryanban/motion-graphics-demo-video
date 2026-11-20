#!/usr/bin/env bash
# setup-openmotion.sh - Install OpenMotion (nexu-io/openmotion, Apache-2.0) next to this toolkit:
# its local Studio, its MCP server registered in Claude Code, and its 8 Agent Skills.
# This is the same Studio + MCP + Skills bundle the DeepSeek Harness (DSH) plugin ships.
#
# Usage:
#   bash scripts/setup-openmotion.sh          # Install or update to the pinned commit
#   bash scripts/setup-openmotion.sh --check  # Verify installation without modifying files
#
# Env: OPENMOTION_HOME (checkout, default ~/.openmotion/app),
#      MOTION_DATA_DIR (projects, default ~/.openmotion/data). Needs git, Node >= 22.18, npm.

set -euo pipefail

OPENMOTION_REPO="https://github.com/nexu-io/openmotion.git"
OPENMOTION_COMMIT="f94275793c7a2e393015710077c5f0bf9f57b989"
OM_HOME="${OPENMOTION_HOME:-$HOME/.openmotion/app}"
OM_DATA="${MOTION_DATA_DIR:-$HOME/.openmotion/data}"

CHECK_ONLY=0
case "${1:-}" in
  "") ;;
  --check) CHECK_ONLY=1 ;;
  -h|--help) sed -n '2,11p' "$0"; exit 0 ;;
  *) echo "ERROR: unknown argument: $1" >&2; sed -n '2,11p' "$0" >&2; exit 2 ;;
esac

skill_names() { (cd "$OM_HOME/skills" && for d in */; do [[ -f "$d/SKILL.md" ]] && echo "${d%/}"; done); }

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  FAILED=0
  ok()   { echo "OK: $1"; }
  miss() { echo "MISSING: $1" >&2; FAILED=1; }
  if [[ -d "$OM_HOME/.git" ]] && [[ "$(git -C "$OM_HOME" rev-parse HEAD)" == "$OPENMOTION_COMMIT" ]]; then
    ok "checkout $OM_HOME at ${OPENMOTION_COMMIT:0:7}"
  else
    miss "checkout $OM_HOME at ${OPENMOTION_COMMIT:0:7}"
  fi
  [[ -f "$OM_HOME/studio/build/index.html" ]] && ok "Studio build" || miss "Studio build (studio/build/index.html)"
  if command -v claude >/dev/null && claude mcp get openmotion >/dev/null 2>&1; then
    ok "Claude Code MCP server 'openmotion'"
  else
    miss "Claude Code MCP server 'openmotion'"
  fi
  if [[ -d "$OM_HOME/skills" ]]; then
    for s in $(skill_names); do
      [[ -f "$HOME/.agents/skills/$s/SKILL.md" && -f "$HOME/.gemini/config/skills/$s/SKILL.md" \
        && -f "$HOME/.claude/skills/$s/SKILL.md" ]] && ok "skill $s" || miss "skill $s"
    done
  fi
  exit "$FAILED"
fi

command -v git >/dev/null || { echo "ERROR: git is required" >&2; exit 1; }
command -v npm >/dev/null || { echo "ERROR: npm is required" >&2; exit 1; }
NODE_BIN="$(command -v node || true)"
[[ -n "$NODE_BIN" ]] || { echo "ERROR: Node.js >= 22.18 is required" >&2; exit 1; }
"$NODE_BIN" -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=18)?0:1)' \
  || { echo "ERROR: Node.js >= 22.18 is required (found $("$NODE_BIN" -v))" >&2; exit 1; }

# Git LFS media stays as pointers; the Studio does not need it to run.
NO_LFS=(-c filter.lfs.process= -c filter.lfs.smudge= -c filter.lfs.required=false)

# 1. Checkout at the pinned commit. Never overwrite local changes in an existing checkout.
if [[ -d "$OM_HOME/.git" ]]; then
  if [[ -n "$(git -C "$OM_HOME" status --porcelain --untracked-files=no)" ]]; then
    echo "ERROR: $OM_HOME has local changes; commit or stash them first" >&2
    exit 1
  fi
else
  [[ -e "$OM_HOME" ]] && { echo "ERROR: $OM_HOME exists and is not a git checkout" >&2; exit 1; }
  mkdir -p "$(dirname "$OM_HOME")"
  git "${NO_LFS[@]}" clone --quiet --filter=blob:none --no-checkout "$OPENMOTION_REPO" "$OM_HOME"
fi
git -C "$OM_HOME" "${NO_LFS[@]}" fetch --quiet --depth 1 origin "$OPENMOTION_COMMIT"
git -C "$OM_HOME" "${NO_LFS[@]}" checkout --quiet --detach "$OPENMOTION_COMMIT"
echo "OpenMotion checkout: $OM_HOME at ${OPENMOTION_COMMIT:0:7}"

# 2. Locked dependencies and the Studio build.
(cd "$OM_HOME" && npm ci --no-audit --no-fund && npm run build:studio)
mkdir -p "$OM_DATA"

# 3. MCP server for Claude Code (stdio). Other agents: see the JSON in README.md.
if command -v claude >/dev/null; then
  MCP_ADD=(claude mcp add --scope user openmotion -e "MOTION_DATA_DIR=$OM_DATA" --
    "$NODE_BIN" --experimental-strip-types "$OM_HOME/mcp.ts")
  # Replace an existing entry only once a plain add has failed, so a working entry is never lost first.
  "${MCP_ADD[@]}" >/dev/null 2>&1 || { claude mcp remove --scope user openmotion >/dev/null; "${MCP_ADD[@]}"; }
  echo "Registered MCP server 'openmotion' in Claude Code (user scope)"
else
  echo "NOTE: 'claude' CLI not found; add the MCP server to your agent by hand (see README.md)"
fi

# 4. Skills, version-matched to the checkout, in the same places as install-skills.sh.
mkdir -p "$HOME/.agents/skills" "$HOME/.gemini/config/skills" "$HOME/.claude/skills"
for s in $(skill_names); do
  for dir in "$HOME/.agents/skills" "$HOME/.gemini/config/skills"; do
    rm -rf "${dir:?}/$s"
    cp -R "$OM_HOME/skills/$s" "$dir/$s"
  done
  rm -rf "$HOME/.claude/skills/$s"
  ln -s "../../.agents/skills/$s" "$HOME/.claude/skills/$s"
  echo "Installed OpenMotion skill: $s"
done

# The Studio must use the same data folder as the MCP server, or it shows a different workspace.
echo "Done. Start the Studio with: (cd \"$OM_HOME\" && MOTION_DATA_DIR=\"$OM_DATA\" npm start)"
echo "Restart your agent so it loads the 'openmotion' MCP tools."
