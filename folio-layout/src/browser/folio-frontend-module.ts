import './style/index.css';
import { ContainerModule } from '@theia/core/shared/inversify';
import { ClaudeAutoOpenContribution } from './claude-auto-open';
import { FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { SearchInWorkspaceFrontendContribution } from '@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution';
import { RightSideFileNavigatorContribution, RightSideSearchContribution } from './right-sidebar-contributions';
import { FolioWelcomeWidget } from './folio-welcome-widget';
import { FolioWelcomeContribution } from './folio-welcome-contribution';

// Import original contributions for rebinding
import { VSXExtensionsContribution } from '@theia/vsx-registry/lib/browser/vsx-extensions-contribution';
import { TerminalFrontendContribution } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { ScmContribution } from '@theia/scm/lib/browser/scm-contribution';
import { DebugFrontendApplicationContribution } from '@theia/debug/lib/browser/debug-frontend-application-contribution';
import { TestViewContribution } from '@theia/test/lib/browser/view/test-view-contribution';

// Import our suppressed overrides
import {
    SuppressedVSXExtensionsContribution,
    SuppressedTerminalFrontendContribution,
    SuppressedScmContribution,
    SuppressedDebugFrontendApplicationContribution,
    SuppressedTestViewContribution
} from './suppressed-contributions';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    // ===== Progressive Disclosure: Suppress auto-open for these views =====
    // These views remain accessible via View menu and commands, just don't open by default

    // Extensions marketplace - suppress auto-open
    bind(SuppressedVSXExtensionsContribution).toSelf().inSingletonScope();
    rebind(VSXExtensionsContribution).toService(SuppressedVSXExtensionsContribution);

    // Terminal - suppress auto-open
    bind(SuppressedTerminalFrontendContribution).toSelf().inSingletonScope();
    rebind(TerminalFrontendContribution).toService(SuppressedTerminalFrontendContribution);

    // SCM (Git) - suppress auto-open
    bind(SuppressedScmContribution).toSelf().inSingletonScope();
    rebind(ScmContribution).toService(SuppressedScmContribution);

    // Debug - suppress auto-open
    bind(SuppressedDebugFrontendApplicationContribution).toSelf().inSingletonScope();
    rebind(DebugFrontendApplicationContribution).toService(SuppressedDebugFrontendApplicationContribution);

    // Test - suppress auto-open
    bind(SuppressedTestViewContribution).toSelf().inSingletonScope();
    rebind(TestViewContribution).toService(SuppressedTestViewContribution);

    // ===== Auto-open Claude panel on first launch =====
    bind(ClaudeAutoOpenContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(ClaudeAutoOpenContribution);

    // ===== Move Navigator (Explorer) to right sidebar =====
    bind(RightSideFileNavigatorContribution).toSelf().inSingletonScope();
    rebind(FileNavigatorContribution).toService(RightSideFileNavigatorContribution);
    bind(FrontendApplicationContribution).toService(RightSideFileNavigatorContribution);

    // ===== Move Search to right sidebar =====
    bind(RightSideSearchContribution).toSelf().inSingletonScope();
    rebind(SearchInWorkspaceFrontendContribution).toService(RightSideSearchContribution);
    bind(FrontendApplicationContribution).toService(RightSideSearchContribution);

    // ===== Welcome widget - shows logo when no editors are open =====
    bind(FolioWelcomeWidget).toSelf().inSingletonScope();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: FolioWelcomeWidget.ID,
        createWidget: () => ctx.container.get<FolioWelcomeWidget>(FolioWelcomeWidget)
    })).inSingletonScope();
    bind(FolioWelcomeContribution).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(FolioWelcomeContribution);
});
