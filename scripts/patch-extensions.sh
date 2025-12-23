#!/bin/bash
# Patch extensions for Folio's one-click install experience
# This script runs at build time to configure extensions with sensible defaults
# ensuring users get a clean, popup-free first launch.

set -e

PLUGINS_DIR="$(dirname "$0")/../electron-app/plugins"
CLAUDE_DIR="$PLUGINS_DIR/Anthropic.claude-code/extension"

echo "Patching extensions for Folio..."

# =============================================================================
# 1. Workspace Trust: Prevent "workspace trust" popup
# =============================================================================
CLAUDE_PKG="$CLAUDE_DIR/package.json"
if [ -f "$CLAUDE_PKG" ]; then
    # Change "supported": false to "supported": true for untrustedWorkspaces
    sed -i '' 's/"supported": false/"supported": true/g' "$CLAUDE_PKG"
    echo "  ✓ Patched workspace trust in package.json"
fi

# =============================================================================
# 2. Terminal Banner: Suppress "back to terminal" prompt
# =============================================================================
# The extension uses globalState to track whether to show the terminal banner.
# We patch the extension JS to default showTerminalBanner to false.
CLAUDE_JS="$CLAUDE_DIR/extension.js"
if [ -f "$CLAUDE_JS" ]; then
    # The minified code has patterns like:
    #   this.showTerminalBanner=i  (where i comes from globalState.get)
    # We want to ensure it defaults to false
    
    # Patch: Change the initial value retrieval to always be false
    # Look for the pattern where showTerminalBanner is read from globalState
    # globalState.get("showTerminalBanner") should return false by default
    
    # The safest approach: ensure that wherever showTerminalBanner is initialized,
    # we bias it to false. We look for the constructor/init pattern.
    
    # This patches the line: this.showTerminalBanner=i (from globalState)
    # to: this.showTerminalBanner=!1 (false)
    if grep -q 'this\.showTerminalBanner=i' "$CLAUDE_JS"; then
        sed -i '' 's/this\.showTerminalBanner=i/this.showTerminalBanner=!1/g' "$CLAUDE_JS"
        echo "  ✓ Patched terminal banner default in extension.js"
    else
        echo "  ℹ Terminal banner pattern not found (may already be patched or extension changed)"
    fi
fi

# =============================================================================
# 3. Summary
# =============================================================================
echo ""
echo "Done patching extensions!"
echo ""
echo "Patches applied:"
echo "  - Workspace trust: Extensions work in untrusted workspaces"
echo "  - Terminal banner: Suppressed by default"
echo ""
echo "Note: Sidebar preference is set via Theia's package.json preferences"
