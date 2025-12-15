import { ContainerModule } from '@theia/core/shared/inversify';
import { FolioLayoutFilterContribution } from './folio-layout-filter';
import { ClaudeAutoOpenContribution } from './claude-auto-open';
import { FilterContribution } from '@theia/core/lib/common';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';

export default new ContainerModule(bind => {
    // Bind the layout filter to hide unwanted views (SCM, Extensions, Terminal, Debug, Test)
    bind(FolioLayoutFilterContribution).toSelf().inSingletonScope();
    bind(FilterContribution).toService(FolioLayoutFilterContribution);

    // Auto-open Claude panel on first launch
    bind(ClaudeAutoOpenContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(ClaudeAutoOpenContribution);
});
