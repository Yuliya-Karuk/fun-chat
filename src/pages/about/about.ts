import { WS } from '../../app/ws/ws';
import { router } from '../../router/router';
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { checkEventTarget, isNotNullable } from '../../utils/utils';
import { AboutView } from './aboutView';

export class About {
  public view: AboutView;

  constructor() {
    this.view = new AboutView();

    this.renderStaticParts();
    this.bindListeners();
  }

  private bindListeners(): void {
    this.view.header.logoutLink.addEventListener('click', (e: Event) => this.handleLogout(e));
    this.view.header.loginLink.addEventListener('click', (e: Event) => this.handleNavigation(e));
    this.view.header.chatLink.addEventListener('click', (e: Event) => this.handleNavigation(e));
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }

  public setLinks(isLoginedUser: boolean): void {
    this.view.setHeaderLinks(isLoginedUser);
  }

  private handleLogout(e: Event): void {
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

  private handleNavigation(e: Event): void {
    e.preventDefault();
    const path = isNotNullable(checkEventTarget(e.target).getAttribute('href'));
    router.navigateTo(path);
  }
}
