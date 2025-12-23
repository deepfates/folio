/**
 * Backend module that configures default plugins path for the packaged Electron app.
 * This ensures plugins are loaded from the correct location in both development and production.
 */
import { ContainerModule } from '@theia/core/shared/inversify';
import * as path from 'path';
import * as fs from 'fs';

// Set up THEIA_DEFAULT_PLUGINS if not already set
// This is needed for packaged Electron apps where the plugins folder is bundled with the app
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
