import { router } from '../../router/router';
import { StorageService } from '../../services/storage.service';
import { checkEventTarget } from '../../utils/utils';
import { AboutView } from './aboutView';

export class About {
  public view: AboutView;

  constructor() {
    this.view = new AboutView();

    this.renderStaticParts();
    this.bindListeners();
  }

  private bindListeners(): void {
    this.view.header.logoutLink.addEventListener('click', (e: Event) => this.handleHeaderNavigation(e, true));
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }

  public setLinks(isLoginedUser: boolean): void {
    this.view.setHeaderLinks(isLoginedUser);
  }

  private handleHeaderNavigation(e: Event, needToLogout: boolean): void {
    e.preventDefault();

    if (needToLogout) {
      StorageService.removeData();
    }

    const location = checkEventTarget(e.target).getAttribute('href') || '';
    router.navigateTo(location);
  }
}
