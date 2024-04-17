import { ContactController } from '../app/controllers/contactController/contactController';
import { UserAuthResponse } from '../app/model/auth';
import { isNotNullable } from '../utils/utils';

export class StateService {
  private users: ContactController[] = [];

  public setOneUser(user: ContactController): void {
    this.users.push(user);
  }

  public checkUserIsExist(userData: UserAuthResponse): boolean {
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
}

export const stateStorage = new StateService();
