import { injectable, inject } from '@theia/core/shared/inversify';
import { 
    FrontendApplicationContribution, 
    FrontendApplication,
    WidgetManager,
    ApplicationShell
} from '@theia/core/lib/browser';
import { FolioWelcomeWidget } from './folio-welcome-widget';

/**
 * Opens the Folio welcome widget in the main area on startup.
 */
@injectable()
export class FolioWelcomeContribution implements FrontendApplicationContribution {

    @inject(WidgetManager)
    protected readonly widgetManager: WidgetManager;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    async onStart(_app: FrontendApplication): Promise<void> {
        // Delay slightly to ensure the shell is ready
        setTimeout(async () => {
            try {
                // Check if there are any editors already open
                const mainAreaWidgets = this.shell.mainAreaTabBars;
                const hasOpenEditors = mainAreaWidgets.length > 0 && 
                    Array.from(mainAreaWidgets).some(tabBar => tabBar.titles.length > 0);
                
                if (!hasOpenEditors) {
                    console.log('[Folio] Opening welcome widget...');
                    const widget = await this.widgetManager.getOrCreateWidget(FolioWelcomeWidget.ID);
                    if (widget) {
                        this.shell.addWidget(widget, { area: 'main' });
                        this.shell.activateWidget(widget.id);
                        console.log('[Folio] Welcome widget opened successfully');
                    }
                }
            } catch (e) {
                console.log('[Folio] Could not open welcome widget:', e);
            }
        }, 500);
    }
}
