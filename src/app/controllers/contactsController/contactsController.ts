import { Contacts } from '../../../components/contacts/contacts';
import { stateStorage } from '../../../services/state.service';
import { ResponseTypes } from '../../../types/enums';
import { eventBus } from '../../../utils/eventBus';
import { ContactAuthResponse, UserAuthResponse } from '../../model/auth';
import { UsersActiveResponse, UsersInactiveResponse } from '../../model/users';
import { WS } from '../../ws/ws';
import { ContactController } from '../contactController/contactController';

export class ContactsController {
  public view: Contacts;

  constructor() {
    this.view = new Contacts();

    eventBus.subscribe('goToChatPage', () => this.setUsers());
    eventBus.subscribe('receivedActiveUsers', (data: UsersActiveResponse) => this.getActiveUsers(data));
    eventBus.subscribe('receivedInactiveUsers', (data: UsersInactiveResponse) => this.getInactiveUsers(data));
    eventBus.subscribe('receivedAllUser', (data: UserAuthResponse[]) => this.createContacts(data));
    eventBus.subscribe('changeActivityUsers', (data: ContactAuthResponse) => this.changeActivityUsers(data));
    eventBus.subscribe('goToLoginPage', () => this.clearPreviousUser());

    this.bindListeners();
  }

  private bindListeners(): void {
    this.view.searchInput.addEventListener('input', () => this.searchByName());
  }

  private setUsers(): void {
    const requestActiveUsers = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_ACTIVE,
      payload: null,
    };

    const requestInactiveUsers = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_INACTIVE,
      payload: null,
    };

    WS.getActiveUsers(requestActiveUsers);
    WS.getInactiveUsers(requestInactiveUsers);
  }

  private getActiveUsers(activeUsersData: UsersActiveResponse): void {
    stateStorage.clearUsers();

    const { users } = activeUsersData.payload;

    stateStorage.setRecipientData(users, false);
  }

  private getInactiveUsers(inactiveUsersData: UsersActiveResponse): void {
    const { users } = inactiveUsersData.payload;

    stateStorage.setRecipientData(users, true);
  }

  private createContacts(recipientsData: UserAuthResponse[]): void {
    recipientsData.forEach(el => {
      if (el.login !== stateStorage.getChatOwner()) {
        const request = {
          id: crypto.randomUUID(),
          type: ResponseTypes.MSG_FROM_USER,
          payload: {
            user: {
              login: el.login,
            },
          },
        };

        const contact = new ContactController(el, request.id);

        WS.getHistory(request);
        stateStorage.setOneRecipient(contact);
      }
    });

    this.renderContacts();
  }

  private renderContacts(): void {
    this.view.clearContacts();

    stateStorage.getUsers().forEach(user => {
      this.view.contacts.append(user.view.getNode());
    });
  }

  private changeActivityUsers(data: ContactAuthResponse): void {
    let updatedUser;

    if (stateStorage.checkUserIsExist(data.payload.user)) {
      updatedUser = stateStorage.updateOneUser(data.payload.user);

      updatedUser.updateUserVisibility();
      this.view.contacts.removeChild(updatedUser.view.getNode());
    } else {
      const request = {
        id: crypto.randomUUID(),
        type: ResponseTypes.MSG_FROM_USER,
        payload: {
          user: {
            login: data.payload.user.login,
          },
        },
      };

      updatedUser = new ContactController(data.payload.user, request.id);

      WS.getHistory(request);
      stateStorage.setOneRecipient(updatedUser);
    }

    if (updatedUser.isLogined) {
      this.view.contacts.prepend(updatedUser.view.getNode());
    } else {
      this.view.contacts.append(updatedUser.view.getNode());
    }
  }

  private clearPreviousUser(): void {
    this.view.clearContacts();
  }

  private searchByName(): void {
    const searchValue = this.view.searchInput.value.toLowerCase();

    stateStorage.getUsers().forEach(user => user.setInvisible());
    const filteredUsers = stateStorage.getUsers().filter(user => user.login.toLowerCase().includes(searchValue));
    filteredUsers.forEach(user => user.setVisible());
  }
}
