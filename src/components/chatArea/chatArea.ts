import { UserAuthResponse } from '../../app/model/auth';
import { MessageInput } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './chatArea.module.scss';

export class ChatArea extends BaseComponent {
  public form: HTMLFormElement;
  private messagesArea: HTMLDivElement;
  private userIcon: HTMLDivElement;
  private userLogin: HTMLDivElement;
  private messageInput: HTMLInputElement;
  public messageButton: HTMLButtonElement;

  constructor() {
    super('div', [styles.chatArea]);

    this.renderContent();
  }

  private renderContent(): void {
    this.userIcon = createElementWithProperties('div', [styles.selectedIcon]);
    this.userLogin = createElementWithProperties('div', [styles.selectedLogin], undefined, [
      { innerText: 'Choose user ...' },
    ]);
    const selectedUserContainer = createElementWithProperties('div', [styles.selectedUser], undefined, undefined, [
      this.userIcon,
      this.userLogin,
    ]);

    this.messagesArea = createElementWithProperties('div', [styles.messagesArea]);

    this.messageInput = createElementWithProperties('input', [styles.messageInput], MessageInput);
    const messageIcon = createElementWithProperties('span', [styles.messageIcon]);

    this.messageButton = createElementWithProperties('button', [styles.messageButton], { type: 'submit' }, undefined, [
      messageIcon,
    ]);

    this.form = createElementWithProperties(
      'form',
      [styles.messageForm],
      { novalidate: 'novalidate', method: '' },
      undefined,
      [this.messageInput, this.messageButton]
    );

    this.appendChildren([selectedUserContainer, this.messagesArea, this.form]);
  }

  public getMessageInputValue(): string {
    const message = this.messageInput.value;
    this.messageInput.value = '';
    return message;
  }

  public setUser(data: UserAuthResponse): void {
    this.userLogin.innerText = data.login;
    this.userIcon.className = `selected-icon selected-icon_${data.isLogined}`;
  }
}
