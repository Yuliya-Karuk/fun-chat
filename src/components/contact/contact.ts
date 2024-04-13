import { UserAuthResponse } from '../../app/model/auth';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './contact.module.scss';

export class Contact extends BaseComponent {
  private userIcon: HTMLDivElement;
  private userLogin: HTMLDivElement;

  constructor() {
    super('div', [styles.contact]);

    this.renderContent();
  }

  private renderContent(): void {
    this.userIcon = createElementWithProperties('div', []);
    this.userLogin = createElementWithProperties('div', [styles.contactLogin]);
    const unreadMessages = createElementWithProperties('div', [styles.contactMessages]);

    this.appendChildren([this.userIcon, this.userLogin, unreadMessages]);
  }

  public setUserActivity(userData: UserAuthResponse): void {
    this.userIcon.className = `${styles.contactIcon} contact-icon_${userData.isLogined}`;
    this.userLogin.innerText = userData.login;
  }
}
