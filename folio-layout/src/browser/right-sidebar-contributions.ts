import { injectable } from '@theia/core/shared/inversify';
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
