import { UserAuthResponse } from '../../app/model/auth';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './contact.module.scss';

export class Contact extends BaseComponent {
  private userIcon: HTMLDivElement;
  private userLogin: HTMLDivElement;
  private unreadMessages: HTMLDivElement;

  constructor() {
    super('div', [styles.contact]);

    this.renderContent();
  }

  private renderContent(): void {
    this.userIcon = createElementWithProperties('div', [styles.contactIcon]);
    this.userLogin = createElementWithProperties('div', [styles.contactLogin]);
    this.unreadMessages = createElementWithProperties('div', [styles.contactMessages]);

    this.appendChildren([this.userIcon, this.userLogin, this.unreadMessages]);
  }

  public setUserActivity(userData: UserAuthResponse): void {
    this.node.className = `${styles.contact} contact_${userData.isLogined}`;
    this.userLogin.innerText = userData.login;
  }

  public setUnreadMessages(messagesCount: number): void {
    if (messagesCount > 0) {
      this.unreadMessages.innerText = `${messagesCount}`;
    } else {
      this.unreadMessages.innerText = '';
    }
  }
}