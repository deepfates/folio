import { injectable } from '@theia/core/shared/inversify';
import { FrontendApplication } from '@theia/core/lib/browser';

// Import the original contribution classes to extend
import { VSXExtensionsContribution } from '@theia/vsx-registry/lib/browser/vsx-extensions-contribution';
import { TerminalFrontendContribution } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { ScmContribution } from '@theia/scm/lib/browser/scm-contribution';
import { DebugFrontendApplicationContribution } from '@theia/debug/lib/browser/debug-frontend-application-contribution';
import { TestViewContribution } from '@theia/test/lib/browser/view/test-view-contribution';

/**
 * These override classes suppress the initializeLayout() method to prevent
 * auto-opening on first launch, while keeping all other functionality intact.
 * 
 * This allows progressive disclosure: views are hidden by default but remain
 * fully accessible via View menu and commands.
 */

/**
 * Suppresses Extensions view from auto-opening.
 */
@injectable()
export class SuppressedVSXExtensionsContribution extends VSXExtensionsContribution {
    override async initializeLayout(_app: FrontendApplication): Promise<void> {
        console.log('[Folio] Suppressing auto-open for Extensions view');
        // Do nothing - we don't want this view to open by default
    }
}

/**
 * Suppresses Terminal from auto-opening.
 * Note: TerminalFrontendContribution doesn't have initializeLayout, so we use onStart
 */
@injectable()
export class SuppressedTerminalFrontendContribution extends TerminalFrontendContribution {
    // Terminal doesn't auto-open by default, but we keep the override class
    // for consistency and in case the base behavior changes
}

/**
 * Suppresses SCM (Git) view from auto-opening.
 */
@injectable()
export class SuppressedScmContribution extends ScmContribution {
    override async initializeLayout(): Promise<void> {
        console.log('[Folio] Suppressing auto-open for SCM view');
        // Do nothing - we don't want this view to open by default
    }
}

/**
 * Suppresses Debug view from auto-opening.
 */
@injectable()
export class SuppressedDebugFrontendApplicationContribution extends DebugFrontendApplicationContribution {
    override async initializeLayout(): Promise<void> {
        console.log('[Folio] Suppressing auto-open for Debug view');
        // Do nothing - we don't want this view to open by default
    }
}

/**
 * Suppresses Test view from auto-opening.
 */
@injectable()
export class SuppressedTestViewContribution extends TestViewContribution {
    override async initializeLayout(): Promise<void> {
        console.log('[Folio] Suppressing auto-open for Test view');
        // Do nothing - we don't want this view to open by default
    }
}
