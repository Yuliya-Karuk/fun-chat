import { Contacts } from '../../../components/contacts/contacts';
import { stateStorage } from '../../../services/state.service';
import { ResponseTypes } from '../../../types/enums';
import { eventBus } from '../../../utils/eventBus';
import { isNotNullable } from '../../../utils/utils';
import { ContactAuthResponse, UserAuthResponse } from '../../model/auth';
import { MessageResponse } from '../../model/message';
import { UsersActiveResponse, UsersInactiveResponse } from '../../model/users';
import { WS } from '../../ws/ws';
import { ContactController } from '../contactController/contactController';

export class ContactsController {
  public view: Contacts;

  constructor() {
    this.view = new Contacts();

    eventBus.subscribe('goToChatPage', () => this.setUsers());
    eventBus.subscribe('getActiveUsers', (data: UsersActiveResponse) => this.getActiveUsers(data));
    eventBus.subscribe('getInactiveUsers', (data: UsersInactiveResponse) => this.getInactiveUsers(data));
    eventBus.subscribe('changeActivityUsers', (data: ContactAuthResponse) => this.changeActivityUsers(data));
    eventBus.subscribe('getReceivedMessage', (data: MessageResponse) => this.setUnreadMessages(data));
  }

  private setUsers(): void {
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
    this.setContacts(users, false);
  }

  private getInactiveUsers(inactiveUsersData: UsersActiveResponse): void {
    const { users } = inactiveUsersData.payload;
    this.setContacts(users, true);
  }

  private setContacts(users: UserAuthResponse[], isLastResponse: boolean): void {
    users.forEach(el => {
      if (el.login !== stateStorage.getUser().login) {
        const contact = new ContactController(el);

        stateStorage.setOneUser(contact);
      }
    });

    if (isLastResponse) {
      this.renderContacts();
    }
  }

  private renderContacts(): void {
    this.view.clearContacts();

    stateStorage.getUsers().forEach(user => {
      this.view.contacts.append(user.view.getNode());
    });
  }

  private changeActivityUsers(data: ContactAuthResponse): void {
    let updatedUser;

    console.log('check', data.payload.user, stateStorage.checkUserIsExist(data.payload.user));
    if (stateStorage.checkUserIsExist(data.payload.user)) {
      console.log('update');
      updatedUser = stateStorage.updateOneUser(data.payload.user);

      updatedUser.updateUserVisibility();
      this.view.contacts.removeChild(updatedUser.view.getNode());
    } else {
      console.log('create new');
      updatedUser = new ContactController(data.payload.user);
      stateStorage.setOneUser(updatedUser);
    }

    if (updatedUser.userData.isLogined) {
      this.view.contacts.prepend(updatedUser.view.getNode());
    } else {
      this.view.contacts.append(updatedUser.view.getNode());
    }
  }

  private setUnreadMessages(data: MessageResponse): void {
    const users = stateStorage.getUsers();
    const author = isNotNullable(users.find(user => user.userData.login === data.payload.message.from));
    const { unreadMessages } = author;
    author.setUnreadMessages(unreadMessages + 1);
  }
}
