import { Contact } from '../../../components/contact/contact';
import { eventBus } from '../../../utils/eventBus';
import { UserAuthResponse } from '../../model/auth';

export class ContactController {
  public view: Contact;
  public userData: UserAuthResponse;
  public unreadMessages: number = 0;

  constructor(userData: UserAuthResponse) {
    this.userData = userData;
    this.view = new Contact();

    this.view.setUserActivity(this.userData);
    this.bindListeners();
  }

  private bindListeners(): void {
    this.view.getNode().addEventListener('click', () => eventBus.emit('chooseUser', this.userData));
  }

  public updateUserVisibility(): void {
    this.view.setUserActivity(this.userData);
  }

  public setUnreadMessages(messagesCount: number): void {
    this.unreadMessages = messagesCount;
    this.view.setUnreadMessages(this.unreadMessages);
  }

  public getUnreadMessages(): number {
    return this.unreadMessages;
  }
}
