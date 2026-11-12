#!/usr/bin/env bash
# finesse installer - copies the skill into your agent's skills directory.
# Usage: curl -fsSL https://raw.githubusercontent.com/delevski/finesse/main/install.sh | bash
set -euo pipefail

REPO="https://github.com/delevski/finesse.git"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Fetching finesse..."
git clone --depth 1 --filter=blob:none --sparse "$REPO" "$TMP/finesse" >/dev/null 2>&1
cd "$TMP/finesse"
git sparse-checkout set skills/finesse >/dev/null 2>&1

installed=0
copy_skill() {
  local target="$1"
  mkdir -p "$target"
  cp -R "$TMP/finesse/skills/finesse/." "$target/finesse/"
  echo "Installed -> $target/finesse"
  installed=1
}

# Claude Code
if [ -d "$HOME/.claude" ] || [ "${FINESSE_CLAUDE:-}" = "1" ]; then
  copy_skill "$HOME/.claude/skills"
fi
# Codex CLI / generic agents dir
if [ -d "$HOME/.agents" ] || [ "${FINESSE_AGENTS:-}" = "1" ]; then
  copy_skill "$HOME/.agents/skills"
fi
if [ "$installed" = "0" ]; then
  copy_skill "$HOME/.claude/skills"
  copy_skill "$HOME/.agents/skills"
fi

cat <<'MSG'

finesse is installed.

Claude Code:  /finesse <path>  or "use finesse on this component"
Codex CLI:    the skill is in ~/.agents/skills/finesse
Cursor:       copy cursor/rules/finesse.mdc into your project's .cursor/rules/

Gallery and docs: https://delevski.github.io/finesse/
MSG
