import { Contact } from '../../../components/contact/contact';
import { eventBus } from '../../../utils/eventBus';
import { UserAuthResponse } from '../../model/auth';
import { MessageHistoryResponse, MessageResponse } from '../../model/message';

export class ContactController {
  public view: Contact = new Contact();
  public login: string;
  public isLogined: boolean;
  private historyRequestId: string;
  public unreadMessages: number = 0;

  constructor(userData: UserAuthResponse, historyRequestId: string) {
    this.login = userData.login;
    this.isLogined = userData.isLogined;
    this.historyRequestId = historyRequestId;

    eventBus.subscribe('receivedHistory', (data: MessageHistoryResponse) => this.countUnreadMessage(data));
    eventBus.subscribe('getReceivedMessage', (data: MessageResponse) => this.changeUnreadMessage(data));
    eventBus.subscribe('resetUnreadMessages', (user: string) => this.resetUnreadMessage(user));

    this.view.getNode().addEventListener('click', () => eventBus.emit('chooseRecipient', userData));
    this.view.setUserActivity(this.login, this.isLogined);
  }

  public updateUserVisibility(): void {
    this.view.setUserActivity(this.login, this.isLogined);
  }

  private countUnreadMessage(data: MessageHistoryResponse): void {
    if (data.id === this.historyRequestId) {
      const unreadMessages = data.payload.messages.filter(msg => !msg.status.isReaded && msg.from === this.login);
      console.log(unreadMessages);
      this.setUnreadMessages(unreadMessages.length);
    }
  }

  public setUnreadMessages(count?: number): void {
    if (count === undefined) {
      this.unreadMessages += 1;
    } else {
      this.unreadMessages = count;
    }

    this.view.setUnreadMessages(this.unreadMessages);
  }

  private changeUnreadMessage(data: MessageResponse): void {
    if (data.payload.message.from === this.login) {
      this.setUnreadMessages();
    }
  }

  public resetUnreadMessage(user: string): void {
    if (this.login === user) {
      this.setUnreadMessages(0);
    }
  }
}
