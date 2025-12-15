import { injectable } from '@theia/core/shared/inversify';
import { FrontendApplication } from '@theia/core/lib/browser';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { SearchInWorkspaceFrontendContribution } from '@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution';

/**
 * Overrides FileNavigatorContribution to place it in the right sidebar by default.
 */
@injectable()
export class RightSideFileNavigatorContribution extends FileNavigatorContribution {
    override get defaultViewOptions() {
        return {
            ...super.defaultViewOptions,
            area: 'right' as const,
            rank: 100
        };
    }

    override async initializeLayout(app: FrontendApplication): Promise<void> {
        console.log('[Folio] Opening File Navigator on right sidebar...');
        await super.initializeLayout(app);
        console.log('[Folio] File Navigator initialized');
    }
}

/**
 * Overrides SearchInWorkspaceFrontendContribution to place it in the right sidebar by default.
 */
@injectable()
export class RightSideSearchContribution extends SearchInWorkspaceFrontendContribution {
    override get defaultViewOptions() {
        return {
            ...super.defaultViewOptions,
            area: 'right' as const,
            rank: 200
        };
    }
}
