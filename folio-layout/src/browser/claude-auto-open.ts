import { injectable, inject } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser';
import { CommandService } from '@theia/core/lib/common';

/**
 * Opens the Claude panel automatically on first launch.
 */
@injectable()
export class ClaudeAutoOpenContribution implements FrontendApplicationContribution {

    @inject(CommandService)
    protected readonly commandService: CommandService;

    /**
     * Called when no previous layout state exists (first launch).
     * Opens the Claude panel in the left sidebar.
     */
    async initializeLayout(_app: FrontendApplication): Promise<void> {
        // Small delay to ensure plugins are loaded
        setTimeout(async () => {
            try {
                // Try to open the Claude panel via its command
                // The Claude extension registers this command
                await this.commandService.executeCommand('claude-vscode.sidebar.open');
            } catch (e) {
                console.log('[Folio] Could not auto-open Claude panel:', e);
            }
        }, 1000);
    }
}
