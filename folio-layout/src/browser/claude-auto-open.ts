import { injectable, inject } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution, FrontendApplication, ApplicationShell } from '@theia/core/lib/browser';
import { CommandService } from '@theia/core/lib/common';
import { FILE_NAVIGATOR_ID } from '@theia/navigator/lib/browser';

const CLAUDE_OPENED_KEY = 'folio.claude.hasOpened';

/**
 * Opens the Claude panel and Navigator automatically on first launch.
 */
@injectable()
export class ClaudeAutoOpenContribution implements FrontendApplicationContribution {

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    /**
     * Called on every app start.
     * Opens Claude and Navigator on first launch only.
     */
    async onStart(_app: FrontendApplication): Promise<void> {
        // Check if we've already opened Claude before
        const hasOpened = localStorage.getItem(CLAUDE_OPENED_KEY);
        if (hasOpened) {
            return;
        }

        // Mark as opened for future launches
        localStorage.setItem(CLAUDE_OPENED_KEY, 'true');

        // Delay to ensure plugins are loaded
        setTimeout(async () => {
            try {
                console.log('[Folio] Opening Claude panel...');
                await this.commandService.executeCommand('claude-vscode.sidebar.open');
                console.log('[Folio] Claude panel opened successfully');
            } catch (e) {
                console.log('[Folio] Could not auto-open Claude panel:', e);
            }

            // Reveal the Navigator on the right sidebar
            try {
                console.log('[Folio] Revealing Navigator on right sidebar...');
                const navigatorWidget = await this.shell.revealWidget(FILE_NAVIGATOR_ID);
                if (navigatorWidget) {
                    console.log('[Folio] Navigator revealed successfully');
                } else {
                    console.log('[Folio] Navigator widget not found');
                }
            } catch (e) {
                console.log('[Folio] Could not reveal Navigator:', e);
            }
        }, 2000);
    }
}
