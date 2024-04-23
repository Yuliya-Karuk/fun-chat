import { WS } from '../../app/ws/ws';
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { isNotNullable } from '../../utils/utils';
import { AboutView } from './aboutView';

export class About {
  public view: AboutView;

  constructor() {
    this.view = new AboutView();

    this.renderStaticParts();
    this.bindListeners();
  }

  private bindListeners(): void {
    this.view.header.logoutLink.addEventListener('click', (e: Event) => this.handleHeaderNavigation(e));
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }

  public setLinks(isLoginedUser: boolean): void {
    this.view.setHeaderLinks(isLoginedUser);
  }

  private handleHeaderNavigation(e: Event): void {
    e.preventDefault();
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_LOGOUT,
      payload: {
        user: isNotNullable(StorageService.getUserData()),
      },
    };

    WS.sendRequest(request);
  }
}
