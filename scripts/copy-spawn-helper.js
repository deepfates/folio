#!/usr/bin/env node
/**
 * Post-build script to copy spawn-helper to where the Webpack-bundled node-pty expects it.
 * 
 * The bundled node-pty code (unixTerminal.js) uses:
 *   helperPath = path.resolve(__dirname, '../build/Release/spawn-helper')
 * 
 * Since __dirname is 'lib/backend/' after Webpack bundling, this resolves to:
 *   lib/build/Release/spawn-helper
 * 
 * We must place spawn-helper there, NOT in lib/backend/native/.
 */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../node_modules/node-pty/build/Release/spawn-helper');
// The bundled code resolves '../build/Release/spawn-helper' from lib/backend/
// So we need: electron-app/lib/build/Release/spawn-helper
const destDir = path.join(__dirname, '../electron-app/lib/build/Release');
const dest = path.join(destDir, 'spawn-helper');

if (!fs.existsSync(src)) {
  console.error('[post-build] WARNING: spawn-helper not found at', src);
  process.exit(0); // Don't fail the build, just warn
}

// Ensure directory exists
if (!fs.existsSync(destDir)) {
  console.log('[post-build] Creating directory:', destDir);
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy spawn-helper
fs.copyFileSync(src, dest);
fs.chmodSync(dest, 0o755);
console.log('[post-build] Copied spawn-helper to', dest);
