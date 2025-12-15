import { injectable } from '@theia/core/shared/inversify';
import { FilterContribution, ContributionFilterRegistry } from '@theia/core/lib/common';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';

// Import the actual contribution classes for instanceof checks
// (class names are minified in production, so we can't use constructor.name)
import { VSXExtensionsContribution } from '@theia/vsx-registry/lib/browser/vsx-extensions-contribution';
import { TerminalFrontendContribution } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { ScmContribution } from '@theia/scm/lib/browser/scm-contribution';
import { DebugFrontendApplicationContribution } from '@theia/debug/lib/browser/debug-frontend-application-contribution';
import { TestViewContribution } from '@theia/test/lib/browser/view/test-view-contribution';

/**
 * This contribution filters out the FrontendApplicationContribution bindings
 * of certain views so they don't auto-open on first launch.
 * 
 * The views remain available via View menu and commands - this only prevents
 * them from opening by default (progressive disclosure).
 * 
 * HIDDEN from default: SCM, Extensions, Terminal, Debug, Test
 */
@injectable()
export class FolioLayoutFilterContribution implements FilterContribution {
    
    /**
     * Array of contribution classes to suppress from auto-opening.
     * Uses instanceof checks to work correctly with minified production builds.
     */
    private readonly suppressedContributionClasses = [
        // Views to hide from default layout (still accessible via View menu)
        VSXExtensionsContribution,            // Extensions marketplace
        TerminalFrontendContribution,         // Terminal
        ScmContribution,                      // Source Control (Git)
        DebugFrontendApplicationContribution, // Debug
        TestViewContribution,                 // Testing
    ];

    registerContributionFilters(registry: ContributionFilterRegistry): void {
        // Filter FrontendApplicationContribution bindings
        // This prevents initializeLayout() from being called for these views
        registry.addFilters([FrontendApplicationContribution], [
            contribution => {
                // Return false to filter OUT (prevent), true to KEEP
                for (const cls of this.suppressedContributionClasses) {
                    if (contribution instanceof cls) {
                        console.log(`[Folio] Suppressing default layout for: ${cls.name}`);
                        return false;
                    }
                }
                return true;
            }
        ]);
    }
}

// Re-export for potential use elsewhere
export {
    VSXExtensionsContribution,
    TerminalFrontendContribution,
    ScmContribution,
    DebugFrontendApplicationContribution,
    TestViewContribution,
};
