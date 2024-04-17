import { ContactController } from '../app/controllers/contactController/contactController';
import { MessageController } from '../app/controllers/messageController/messageController';
import { UserAuthRequest, UserAuthResponse } from '../app/model/auth';
import { eventBus } from '../utils/eventBus';
import { isNotNullable } from '../utils/utils';

export class StateService {
  private users: ContactController[] = [];
  private chatOwner: UserAuthRequest;
  private chosenUser: UserAuthResponse | null;
  private history: MessageController[];

  constructor() {
    eventBus.subscribe('clearStateUsers', () => this.clearState());
    eventBus.subscribe('chooseUser', (data: UserAuthResponse) => this.setChosenUser(data));
  }

  private clearState(): void {
    this.users = [];
    this.chosenUser = null;
  }

  public setUser(userData: UserAuthRequest): void {
    this.chatOwner = userData;
  }

  public getUser(): UserAuthRequest {
    return this.chatOwner;
  }

  private setChosenUser(data: UserAuthResponse): void {
    this.chosenUser = data;
    this.history = [];
  }

  public getChosenUser(): UserAuthResponse | null {
    return this.chosenUser;
  }

  public setOneUser(user: ContactController): void {
    this.users.push(user);
  }

  public checkUserIsExist(userData: UserAuthResponse): boolean {
    console.log(this.users);
    return Boolean(this.users.find(contact => contact.userData.login === userData.login));
  }

  public updateOneUser(userData: UserAuthResponse): ContactController {
    const updatedUser = isNotNullable(this.users.find(contact => contact.userData.login === userData.login));
    updatedUser.userData.isLogined = userData.isLogined;
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
}

export const stateStorage = new StateService();
