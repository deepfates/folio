/**
 * Backend module that configures default plugins path for the packaged Electron app.
 * This ensures plugins are loaded from the correct location in both development and production.
 * 
 * Also handles creating the default ~/Folio workspace on first launch.
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const DEFAULT_FOLDER_NAME = 'Folio';

// ============================================================================
// 1. Set up default workspace for first launch
// ============================================================================
function ensureDefaultWorkspace(): void {
    const homeDir = os.homedir();
    const theiaDir = path.join(homeDir, '.theia');
    const recentWorkspaceFile = path.join(theiaDir, 'recentworkspace.json');
    const folioDir = path.join(homeDir, DEFAULT_FOLDER_NAME);
    
    // Check if recentworkspace.json already has content
    if (fs.existsSync(recentWorkspaceFile)) {
        try {
            const content = fs.readFileSync(recentWorkspaceFile, 'utf-8');
            const data = JSON.parse(content);
            // If there are any recent roots (not empty), don't interfere
            if (data.recentRoots && data.recentRoots.length > 0 && data.recentRoots[0] !== '') {
                console.log('[folio-layout] Recent workspace exists, skipping default setup');
                return;
            }
        } catch (e) {
            // JSON parse error, proceed with creating default
        }
    }
    
    console.log('[folio-layout] Setting up default workspace...');
    
    // Create ~/Folio if it doesn't exist
    if (!fs.existsSync(folioDir)) {
        console.log(`[folio-layout] Creating ${folioDir}`);
        fs.mkdirSync(folioDir, { recursive: true });
        
        // Create CLAUDE.md
        const claudeMd = `# Welcome to Folio

This is your workspace. I'm Claude, and I can read and edit any file in this folder.

## How we work together

- **Chat with me** in the sidebar on the left
- **Your files** are visible in the file explorer on the right
- Everything I do happens in plain sight—you can see and edit my work

## What I know about this folder

- This is your personal Folio workspace
- You can create notes, documents, research, or any other files here
- I'll remember our conversations and learn how you like to work

## Tips

- Press \`⌘O\` to open a different folder anytime
- Use \`⌘⇧P\` for the command palette
- Ask me anything—I'm here to help
`;
        fs.writeFileSync(path.join(folioDir, 'CLAUDE.md'), claudeMd);
        
        // Create README.md
        const readmeMd = `# Your Folio

Welcome! This folder is where you and Claude collaborate.

## Getting Started

1. **Say hello to Claude** in the sidebar on the left
2. **Create a file** — try writing a note or a document
3. **Ask Claude to help** — edit, organize, explain, or anything else

## What's here

- \`CLAUDE.md\` — Claude reads this to understand your workspace
- \`notes/\` — A place for your notes and documents
- \`.claude/skills/\` — Teach Claude new abilities (advanced)

## Learn more

- Press \`⌘⇧P\` and type "Folio" to see available commands
- Visit [folio.deepfates.com](https://folio.deepfates.com) for docs

Happy writing!
`;
        fs.writeFileSync(path.join(folioDir, 'README.md'), readmeMd);
        
        // Create notes/ directory
        fs.mkdirSync(path.join(folioDir, 'notes'), { recursive: true });
        
        // Create .claude/skills/ directory
        fs.mkdirSync(path.join(folioDir, '.claude', 'skills'), { recursive: true });
        
        console.log('[folio-layout] Default folder structure created');
    }
    
    // Seed recentworkspace.json to point to ~/Folio
    const folioUri = `file://${folioDir}`;
    const workspaceData = { recentRoots: [folioUri] };
    
    // Ensure ~/.theia exists
    if (!fs.existsSync(theiaDir)) {
        fs.mkdirSync(theiaDir, { recursive: true });
    }
    
    fs.writeFileSync(recentWorkspaceFile, JSON.stringify(workspaceData));
    console.log(`[folio-layout] Set default workspace to ${folioUri}`);
}

// Run this immediately when the module loads (before frontend)
try {
    ensureDefaultWorkspace();
} catch (error) {
    console.error('[folio-layout] Error setting up default workspace:', error);
}

// ============================================================================
// 2. Set up THEIA_DEFAULT_PLUGINS for packaged Electron apps
// ============================================================================
if (!process.env.THEIA_DEFAULT_PLUGINS) {
    // In Electron, THEIA_APP_PROJECT_PATH points to the app root
    const appProjectPath = process.env.THEIA_APP_PROJECT_PATH || path.resolve(__dirname, '..', '..');
    
    // Try multiple possible locations for plugins
    const possiblePaths = [
        // For packaged apps with extraResources: plugins are in Resources/plugins
        path.resolve(appProjectPath, '..', 'plugins'),
        // For packaged apps running from asar: try app.asar.unpacked
        appProjectPath.includes('app.asar') 
            ? appProjectPath.replace('app.asar', 'app.asar.unpacked') + '/plugins'
            : null,
        // Development mode: plugins in same directory as app
        path.resolve(appProjectPath, 'plugins'),
    ].filter(Boolean) as string[];
    
    // Find the first path that exists
    let pluginsPath: string | undefined;
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            pluginsPath = p;
            break;
        }
    }
    
    if (pluginsPath) {
        process.env.THEIA_DEFAULT_PLUGINS = `local-dir:${pluginsPath}`;
        console.log(`[folio-layout] Set THEIA_DEFAULT_PLUGINS to: local-dir:${pluginsPath}`);
    } else {
        // Fallback to development path
        const fallbackPath = path.resolve(appProjectPath, 'plugins');
        pluginsPath = fallbackPath;
        process.env.THEIA_DEFAULT_PLUGINS = `local-dir:${fallbackPath}`;
        console.log(`[folio-layout] Warning: plugins not found, using fallback: local-dir:${fallbackPath}`);
        console.log(`[folio-layout] Searched paths: ${possiblePaths.join(', ')}`);
    }
}

// Note: Plugin state configuration is handled at build-time via scripts/patch-extensions.sh
// This ensures reliable defaults regardless of runtime conditions.

export default new ContainerModule(() => {
    // This module only sets up environment variables, no bindings needed
});
