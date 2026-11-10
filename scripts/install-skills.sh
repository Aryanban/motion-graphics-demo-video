#!/usr/bin/env bash
# install-skills.sh - Install the repository's 4 video/motion-graphics Agent Skills
# globally (~/.agents/skills, ~/.gemini/config/skills, ~/.claude/skills) or into a target project.
#
# Usage:
#   bash scripts/install-skills.sh                 # Install all 4 skills globally
#   bash scripts/install-skills.sh --project <dir> # Install into <dir>/.agents/skills + .claude/skills
#   bash scripts/install-skills.sh --check         # Verify installation without modifying files

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_ROOT="$REPO_ROOT/.agents/skills"

SKILLS=(
  "remotion-best-practices"
  "saas-product-demo-video"
  "remotion-video-director"
  "remotion-motion-graphics"
)

MODE="global"
PROJECT_DIR=""
CHECK_ONLY=0

usage() {
  sed -n '2,9p' "$0"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      if [[ $# -lt 2 ]]; then
        echo "ERROR: --project requires a directory path" >&2
        exit 2
      fi
      MODE="project"
      PROJECT_DIR="$2"
      shift 2
      ;;
    --check)
      CHECK_ONLY=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

for skill in "${SKILLS[@]}"; do
  if [[ ! -f "$SRC_ROOT/$skill/SKILL.md" ]]; then
    echo "ERROR: missing source skill file $SRC_ROOT/$skill/SKILL.md" >&2
    exit 1
  fi
done

verify_skill_md() {
  local path="$1"
  [[ -e "$path" && -f "$path/SKILL.md" && -r "$path/SKILL.md" ]]
}

if [[ "$MODE" == "project" ]]; then
  mkdir -p "$PROJECT_DIR"
  TARGET_BASE="$(cd "$PROJECT_DIR" && pwd)"
  AGENTS_DIR="$TARGET_BASE/.agents/skills"
  CLAUDE_DIR="$TARGET_BASE/.claude/skills"

  if [[ "$CHECK_ONLY" -eq 1 ]]; then
    FAILED=0
    for skill in "${SKILLS[@]}"; do
      if verify_skill_md "$AGENTS_DIR/$skill" && verify_skill_md "$CLAUDE_DIR/$skill"; then
        echo "OK: $skill -> $AGENTS_DIR/$skill (linked in $CLAUDE_DIR/$skill)"
      else
        echo "MISSING: $skill in $TARGET_BASE" >&2
        FAILED=1
      fi
    done
    exit "$FAILED"
  fi

  mkdir -p "$AGENTS_DIR" "$CLAUDE_DIR"
  for skill in "${SKILLS[@]}"; do
    rm -rf "$AGENTS_DIR/$skill"
    cp -R "$SRC_ROOT/$skill" "$AGENTS_DIR/$skill"
    rm -rf "$CLAUDE_DIR/$skill"
    ln -s "../../.agents/skills/$skill" "$CLAUDE_DIR/$skill"
    echo "Installed project skill: $skill -> $AGENTS_DIR/$skill"
  done
  exit 0
fi

# Global installation
GLOBAL_AGENTS="$HOME/.agents/skills"
GLOBAL_GEMINI="$HOME/.gemini/config/skills"
GLOBAL_CLAUDE="$HOME/.claude/skills"

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  FAILED=0
  for skill in "${SKILLS[@]}"; do
    if verify_skill_md "$GLOBAL_AGENTS/$skill" && verify_skill_md "$GLOBAL_GEMINI/$skill" && verify_skill_md "$GLOBAL_CLAUDE/$skill"; then
      echo "OK: $skill (~/.agents/skills, ~/.gemini/config/skills, ~/.claude/skills)"
    else
      echo "MISSING: $skill in global skill directories" >&2
      FAILED=1
    fi
  done
  exit "$FAILED"
fi

mkdir -p "$GLOBAL_AGENTS" "$GLOBAL_GEMINI" "$GLOBAL_CLAUDE"
for skill in "${SKILLS[@]}"; do
  rm -rf "$GLOBAL_AGENTS/$skill"
  cp -R "$SRC_ROOT/$skill" "$GLOBAL_AGENTS/$skill"

  rm -rf "$GLOBAL_GEMINI/$skill"
  cp -R "$SRC_ROOT/$skill" "$GLOBAL_GEMINI/$skill"

  rm -rf "$GLOBAL_CLAUDE/$skill"
  ln -s "../../.agents/skills/$skill" "$GLOBAL_CLAUDE/$skill"

  echo "Installed global skill: $skill"
done

echo "All ${#SKILLS[@]} skills installed cleanly."
