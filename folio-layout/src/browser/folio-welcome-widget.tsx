import * as React from 'react';
import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Message } from '@theia/core/lib/browser';

export const FolioWelcomeWidgetID = 'folio-welcome-widget';

@injectable()
export class FolioWelcomeWidget extends ReactWidget {

    static readonly ID = FolioWelcomeWidgetID;
    static readonly LABEL = 'Welcome';

    @postConstruct()
    protected init(): void {
        this.id = FolioWelcomeWidget.ID;
        this.title.label = FolioWelcomeWidget.LABEL;
        this.title.caption = FolioWelcomeWidget.LABEL;
        this.title.closable = true;
        this.addClass('folio-welcome-widget');
        this.update();
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.node.focus();
    }

    protected render(): React.ReactNode {
        return (
            <div className="folio-welcome-container">
                <div className="folio-welcome-content">
                    {/* Logo + Wordmark row */}
                    <div className="folio-brand">
                        <svg className="folio-logo" width="56" height="56" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8H32C34.2091 8 36 9.79086 36 12V14H44C46.2091 14 48 15.7909 48 18V48C48 50.2091 46.2091 52 44 52H12C9.79086 52 8 50.2091 8 48V12C8 9.79086 9.79086 8 12 8Z" fill="#d87757"/>
                            <rect x="18" y="22" width="20" height="3" rx="1.5" fill="#0a0a0a"/>
                            <rect x="18" y="30" width="14" height="3" rx="1.5" fill="#0a0a0a"/>
                            <rect x="18" y="38" width="3" height="3" rx="1.5" fill="#0a0a0a" opacity="0.6"/>
                        </svg>
                        <span className="folio-wordmark">Folio</span>
                    </div>

                    {/* Tagline */}
                    <p className="folio-tagline">Share your computer with Claude</p>

                    {/* Shortcuts */}
                    <div className="folio-shortcuts">
                        <div className="folio-shortcut">
                            <span className="folio-shortcut-label">Open Folder</span>
                            <div className="folio-kbd-group">
                                <kbd className="folio-kbd">⌘</kbd>
                                <kbd className="folio-kbd">O</kbd>
                            </div>
                        </div>
                        <div className="folio-shortcut">
                            <span className="folio-shortcut-label">Command Palette</span>
                            <div className="folio-kbd-group">
                                <kbd className="folio-kbd">⌘</kbd>
                                <kbd className="folio-kbd">⇧</kbd>
                                <kbd className="folio-kbd">P</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
