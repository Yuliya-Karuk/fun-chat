import { AuthResponse, UserAuthResponse } from '../../app/model/auth';
import { UsersActiveResponse, UsersInactiveResponse } from '../../app/model/users';
import { WS } from '../../app/ws/ws';
import { Contact } from '../../components/contact/contact';
import { router } from '../../router/router';
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { checkEventTarget } from '../../utils/utils';
import { ChatView } from './chatView';

export class Chat {
  public view: ChatView;
  private userData: AuthResponse;
  private activeUsers: UserAuthResponse[];
  private inactiveUsers: UserAuthResponse[];

  constructor() {
    this.view = new ChatView();

    eventBus.subscribe('goToChatPage', (data: AuthResponse) => this.setChatData(data));
    eventBus.subscribe('getActiveUsers', (data: UsersActiveResponse) => this.getActiveUsers(data));
    eventBus.subscribe('getInactiveUsers', (data: UsersInactiveResponse) => this.getInactiveUsers(data));

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
    this.view.header.logoutLink.addEventListener('click', (e: Event) => this.handleHeaderNavigation(e, true));
    this.view.header.aboutLink.addEventListener('click', (e: Event) => this.handleHeaderNavigation(e, false));
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
      const user = new Contact(el);
      this.view.contacts.append(user.getNode());
    });
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
