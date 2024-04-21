import { ContactController } from '../app/controllers/contactController/contactController';
import { MessageController } from '../app/controllers/messageController/messageController';
import { AuthResponse, UserAuthResponse } from '../app/model/auth';
import { eventBus } from '../utils/eventBus';
import { isNotNullable } from '../utils/utils';

export class StateService {
  private users: ContactController[] = [];
  private chatOwner: string;
  private recipientsData: UserAuthResponse[] = [];
  private chosenRecipient: string | null;
  private history: MessageController[] = [];

  constructor() {
    eventBus.subscribe('clearState', () => this.clearState());
    eventBus.subscribe('authorizeUser', (data: AuthResponse) => this.setChatOwner(data));
    eventBus.subscribe('chooseRecipient', (data: UserAuthResponse) => this.setChosenRecipient(data));
  }

  private clearState(): void {
    this.clearUsers();
    this.chosenRecipient = null;
  }

  public setChatOwner(userData: AuthResponse): void {
    this.chatOwner = userData.payload.user.login;
  }

  public getChatOwner(): string {
    return this.chatOwner;
  }

  public clearUsers(): void {
    this.users = [];
    this.recipientsData = [];
  }

  public setRecipientData(users: UserAuthResponse[], isInactive: boolean): void {
    this.recipientsData = [...this.recipientsData, ...users];

    if (isInactive) {
      eventBus.emit('receivedAllUser', this.recipientsData);
    }
  }

  public setOneRecipient(user: ContactController): void {
    this.users.push(user);
  }

  private setChosenRecipient(data: UserAuthResponse): void {
    this.chosenRecipient = data.login;
    this.history = [];
  }

  public getChosenRecipient(): string | null {
    return this.chosenRecipient;
  }

  public checkUserIsExist(userData: UserAuthResponse): boolean {
    console.log(this.users);
    return Boolean(this.users.find(contact => contact.login === userData.login));
  }

  public updateOneUser(userData: UserAuthResponse): ContactController {
    const updatedUser = isNotNullable(this.users.find(contact => contact.login === userData.login));
    updatedUser.isLogined = userData.isLogined;
    return updatedUser;
  }

  public getUsers(): ContactController[] {
    return this.users;
  }

  public pushMessageToHistory(msgController: MessageController): void {
    this.history.push(msgController);
  }

  public getUndeliveredMessages(): MessageController[] {
    const messages = this.history.filter(msgController => msgController.isDelivered === false);
    return messages;
  }

  public getUnreadMessages(): MessageController[] {
    const messages = this.history.filter(
      msgController => msgController.isReaded === false && msgController.to === this.chatOwner
    );
    return messages;
  }

  public getMessageById(id: string): MessageController | undefined {
    const message = this.history.find(msgController => msgController.id === id);
    return message;
  }

  public readMessages(login: string): void {
    const updatedUser = isNotNullable(this.users.find(contact => contact.login === login));
    updatedUser.setUnreadMessages(0);
  }
}

export const stateStorage = new StateService();
