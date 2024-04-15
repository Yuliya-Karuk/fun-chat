import { ContactsController } from '../../app/controllers/contactsController/contactsController';
import { DialogController } from '../../app/controllers/dialogController/dialogController';
import { UserAuthRequest } from '../../app/model/auth';
import { WS } from '../../app/ws/ws';
import { router } from '../../router/router';
import { Routes } from '../../router/router.types';
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { checkEventTarget } from '../../utils/utils';
import { ChatView } from './chatView';

export class Chat {
  private dialogController: DialogController;
  private contactsController: ContactsController;
  public view: ChatView;
  private userData: UserAuthRequest;

  constructor() {
    this.view = new ChatView();
    this.dialogController = new DialogController();
    this.contactsController = new ContactsController();

    eventBus.subscribe('goToChatPage', (data: UserAuthRequest) => this.setChatData(data));
    eventBus.subscribe('goToLoginPage', () => this.handleLogoutNavigation(Routes.Auth));

    this.renderStaticParts();
    this.bindListeners();
  }

  public setLinks(isLoginedUser: boolean): void {
    this.view.setHeaderLinks(isLoginedUser);
  }

  private renderStaticParts(): void {
    this.view.renderContent(this.contactsController.view.getNode(), this.dialogController.view.getNode());
  }

  private bindListeners(): void {
    this.view.header.logoutLink.addEventListener('click', (e: Event) => this.handleLogoutUser(e));
    this.view.header.aboutLink.addEventListener('click', (e: Event) => this.handleAboutNavigation(e));
  }

  private setChatData(userData: UserAuthRequest): void {
    this.userData = userData;

    this.view.setUserName(this.userData.login);
  }

  private handleAboutNavigation(e: Event): void {
    e.preventDefault();

    const location = checkEventTarget(e.target).getAttribute('href') || '';
    router.navigateTo(location);
  }

  private handleLogoutUser(e: Event): void {
    e.preventDefault();
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_LOGOUT,
      payload: {
        user: this.userData,
      },
    };

    WS.sendAuthMessage(request);
    StorageService.removeData();
  }

  private handleLogoutNavigation(location: Routes): void {
    router.navigateTo(location);
  }
}
