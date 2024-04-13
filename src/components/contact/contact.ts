import { UserAuthResponse } from '../../app/model/auth';
import { eventBus } from '../../utils/eventBus';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './contact.module.scss';

export class Contact extends BaseComponent {
  public userData: UserAuthResponse;

  constructor(userData: UserAuthResponse) {
    super('div', [styles.contact]);

    this.userData = userData;

    this.renderContent();
    this.bindListeners();
  }

  private renderContent(): void {
    const userIcon = createElementWithProperties('div', [
      styles.contactIcon,
      `contact-icon_${this.userData.isLogined}`,
    ]);
    const userLogin = createElementWithProperties('div', [styles.contactLogin], undefined, [
      { innerText: this.userData.login },
    ]);
    const unreadMessages = createElementWithProperties('div', [styles.contactMessages]);

    this.appendChildren([userIcon, userLogin, unreadMessages]);
  }

  private bindListeners(): void {
    this.node.addEventListener('click', () => eventBus.emit('chooseUser', this.userData));
  }
}
