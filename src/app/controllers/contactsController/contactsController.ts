import { Contacts } from '../../../components/contacts/contacts';
import { stateStorage } from '../../../services/state.service';
import { ResponseTypes } from '../../../types/enums';
import { eventBus } from '../../../utils/eventBus';
import { ContactAuthResponse, UserAuthRequest, UserAuthResponse } from '../../model/auth';
import { UsersActiveResponse, UsersInactiveResponse } from '../../model/users';
import { WS } from '../../ws/ws';
import { ContactController } from '../contactController/contactController';

export class ContactsController {
  public view: Contacts;
  public userData: UserAuthRequest;

  constructor() {
    this.view = new Contacts();

    eventBus.subscribe('goToChatPage', (data: UserAuthRequest) => this.getUsers(data));
    eventBus.subscribe('getActiveUsers', (data: UsersActiveResponse) => this.getActiveUsers(data));
    eventBus.subscribe('getInactiveUsers', (data: UsersInactiveResponse) => this.getInactiveUsers(data));
    eventBus.subscribe('changeActivityUsers', (data: ContactAuthResponse) => this.changeActivityUsers(data));
  }

  private getUsers(userData: UserAuthRequest): void {
    this.userData = userData;

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
}
