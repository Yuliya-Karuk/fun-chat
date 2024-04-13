import { AuthResponse, UserAuthResponse } from '../../app/model/auth';
import { UsersActiveResponse, UsersInactiveResponse } from '../../app/model/users';
import { WS } from '../../app/ws/ws';
import { Contact } from '../../components/contact/contact';
import { router } from '../../router/router';
import { Routes } from '../../router/router.types';
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { checkEventTarget, isNotNullable } from '../../utils/utils';
import { ChatView } from './chatView';

export class Chat {
  public view: ChatView;
  private userData: AuthResponse;
  private activeUsers: UserAuthResponse[];
  private inactiveUsers: UserAuthResponse[];
  private chosenUser: UserAuthResponse;

  constructor() {
    this.view = new ChatView();

    eventBus.subscribe('goToChatPage', (data: AuthResponse) => this.setChatData(data));
    eventBus.subscribe('goToLoginPage', () => this.handleLogoutNavigation(Routes.Auth));
    eventBus.subscribe('getActiveUsers', (data: UsersActiveResponse) => this.getActiveUsers(data));
    eventBus.subscribe('getInactiveUsers', (data: UsersInactiveResponse) => this.getInactiveUsers(data));
    eventBus.subscribe('chooseUser', (data: UserAuthResponse) => this.setUser(data));
    eventBus.subscribe('changeActivityUsers', () => this.getUsers());

    this.renderStaticParts();
    this.bindListeners();
  }

  public setLinks(isLoginedUser: boolean): void {
    this.view.setHeaderLinks(isLoginedUser);
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }

  private bindListeners(): void {
    this.view.header.logoutLink.addEventListener('click', (e: Event) => this.handleLogoutUser(e));
    this.view.header.aboutLink.addEventListener('click', (e: Event) => this.handleAboutNavigation(e));
    this.view.chatArea.form.addEventListener('submit', (e: Event) => this.sendMessageToUser(e));
  }

  private setChatData(userData: AuthResponse): void {
    this.userData = userData;
    this.view.setUserName(this.userData.payload.user.login);

    this.getUsers();
  }

  private getUsers(): void {
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_ACTIVE,
      payload: null,
    };

    const request2 = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_INACTIVE,
      payload: null,
    };

    this.view.contacts.replaceChildren();

    WS.getActiveUsers(request);
    WS.getInactiveUsers(request2);
  }

  private getActiveUsers(activeUsersData: UsersActiveResponse): void {
    const { users } = activeUsersData.payload;
    this.activeUsers = [...users];
    this.renderContacts(this.activeUsers);
  }

  private getInactiveUsers(inactiveUsersData: UsersActiveResponse): void {
    const { users } = inactiveUsersData.payload;
    this.inactiveUsers = [...users];
    this.renderContacts(this.inactiveUsers);
  }

  private renderContacts(users: UserAuthResponse[]): void {
    users.forEach(el => {
      if (el.login !== this.userData.payload.user.login) {
        const user = new Contact(el);
        this.view.contacts.append(user.getNode());
      }
    });
  }

  private handleAboutNavigation(e: Event): void {
    e.preventDefault();

    const location = checkEventTarget(e.target).getAttribute('href') || '';
    router.navigateTo(location);
  }

  private handleLogoutUser(e: Event): void {
    e.preventDefault();
    const request = isNotNullable(StorageService.getUserData());
    request.type = ResponseTypes.USER_LOGOUT;

    WS.sendAuthMessage(request);
    StorageService.removeData();

    const location = checkEventTarget(e.target).getAttribute('href') || '';
    router.navigateTo(location);
  }

  private handleLogoutNavigation(location: Routes): void {
    router.navigateTo(location);
  }

  private setUser(data: UserAuthResponse): void {
    this.chosenUser = data;
    this.view.chatArea.setUser(data);
  }

  private sendMessageToUser(e: Event): void {
    e.preventDefault();
    const message = this.view.chatArea.getMessageInputValue();
    console.log(message);
  }
}
