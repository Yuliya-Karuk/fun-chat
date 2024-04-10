import { AuthResponse, UserAuthResponse } from '../../app/model/auth';
import { UsersActiveResponse, UsersInactiveResponse } from '../../app/model/users';
import { WS } from '../../app/ws/ws';
import { Contact } from '../../components/contact/contact';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
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
  }

  private renderStaticParts(): void {
    this.view.renderContent();
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
    console.log(users);
  }

  private getInactiveUsers(inactiveUsersData: UsersActiveResponse): void {
    const { users } = inactiveUsersData.payload;
    this.inactiveUsers = [...users];
    this.renderContacts(this.inactiveUsers);
    console.log(users);
  }

  private renderContacts(users: UserAuthResponse[]): void {
    users.forEach(el => {
      const user = new Contact(el);
      this.view.contacts.append(user.getNode());
    });
  }
}
