import { ContainerModule } from '@theia/core/shared/inversify';
import { FolioWidget } from './folio-widget';
import { FolioContribution } from './folio-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, FolioContribution);
    bind(FrontendApplicationContribution).toService(FolioContribution);
    bind(FolioWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: FolioWidget.ID,
        createWidget: () => ctx.container.get<FolioWidget>(FolioWidget)
    })).inSingletonScope();
});
