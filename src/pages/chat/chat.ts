import { ContactController } from '../../app/controllers/contactController/contactController';
import { ContactAuthResponse, UserAuthRequest, UserAuthResponse } from '../../app/model/auth';
import { UsersActiveResponse, UsersInactiveResponse } from '../../app/model/users';
import { WS } from '../../app/ws/ws';
import { router } from '../../router/router';
import { Routes } from '../../router/router.types';
import { stateStorage } from '../../services/state.service';
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { checkEventTarget } from '../../utils/utils';
import { ChatView } from './chatView';

export class Chat {
  public view: ChatView;
  private userData: UserAuthRequest;
  private chosenUser: UserAuthResponse;

  constructor() {
    this.view = new ChatView();

    eventBus.subscribe('goToChatPage', (data: UserAuthRequest) => this.setChatData(data));
    eventBus.subscribe('goToLoginPage', () => this.handleLogoutNavigation(Routes.Auth));
    eventBus.subscribe('getActiveUsers', (data: UsersActiveResponse) => this.getActiveUsers(data));
    eventBus.subscribe('getInactiveUsers', (data: UsersInactiveResponse) => this.getInactiveUsers(data));
    eventBus.subscribe('chooseUser', (data: UserAuthResponse) => this.setUser(data));
    eventBus.subscribe('changeActivityUsers', (data: ContactAuthResponse) => this.changeActivityUsers(data));

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

  private setChatData(userData: UserAuthRequest): void {
    this.userData = userData;
    this.view.setUserName(this.userData.login);

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
    this.renderContacts(users);
  }

  private getInactiveUsers(inactiveUsersData: UsersActiveResponse): void {
    const { users } = inactiveUsersData.payload;
    this.renderContacts(users);
  }

  private renderContacts(users: UserAuthResponse[]): void {
    users.forEach(el => {
      if (el.login !== this.userData.login) {
        const contact = new ContactController(el);

        stateStorage.setOneUser(contact);
        this.view.contacts.append(contact.view.getNode());
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
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_LOGOUT,
      payload: {
        user: this.userData,
      },
    };

    WS.sendAuthMessage(request);
    StorageService.removeData();

    const location = checkEventTarget(e.target).getAttribute('href') || '';
    router.navigateTo(location);
  }

  private handleLogoutNavigation(location: Routes): void {
    router.navigateTo(location);
  }

  private changeActivityUsers(data: ContactAuthResponse): void {
    let updatedUser;

    if (stateStorage.checkUserIsExist(data.payload.user)) {
      updatedUser = stateStorage.updateOneUser(data.payload.user);

      updatedUser.updateUserVisibility();
      this.view.contacts.removeChild(updatedUser.view.getNode());
    } else {
      updatedUser = new ContactController(data.payload.user);
      stateStorage.setOneUser(updatedUser);
    }

    if (updatedUser.userData.isLogined) {
      this.view.contacts.prepend(updatedUser.view.getNode());
    } else {
      this.view.contacts.append(updatedUser.view.getNode());
    }
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
