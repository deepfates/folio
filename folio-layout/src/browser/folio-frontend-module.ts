import { ContainerModule } from '@theia/core/shared/inversify';
import { FolioLayoutFilterContribution } from './folio-layout-filter';
import { ClaudeAutoOpenContribution } from './claude-auto-open';
import { FilterContribution } from '@theia/core/lib/common';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { SearchInWorkspaceFrontendContribution } from '@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution';
import { RightSideFileNavigatorContribution, RightSideSearchContribution } from './right-sidebar-contributions';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    // Bind the layout filter to hide unwanted views (SCM, Extensions, Terminal, Debug, Test)
    bind(FolioLayoutFilterContribution).toSelf().inSingletonScope();
    bind(FilterContribution).toService(FolioLayoutFilterContribution);

    // Auto-open Claude panel on first launch
    bind(ClaudeAutoOpenContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(ClaudeAutoOpenContribution);

    // Move Navigator (Explorer) to right sidebar
    // Bind our override and rebind the original contribution to use it
    bind(RightSideFileNavigatorContribution).toSelf().inSingletonScope();
    rebind(FileNavigatorContribution).toService(RightSideFileNavigatorContribution);
    // Also need to rebind the FrontendApplicationContribution that points to FileNavigatorContribution
    // This is a multi-binding, so we unbind the old one and add a new one
    bind(FrontendApplicationContribution).toService(RightSideFileNavigatorContribution);

    // Move Search to right sidebar
    bind(RightSideSearchContribution).toSelf().inSingletonScope();
    rebind(SearchInWorkspaceFrontendContribution).toService(RightSideSearchContribution);
    bind(FrontendApplicationContribution).toService(RightSideSearchContribution);
});
