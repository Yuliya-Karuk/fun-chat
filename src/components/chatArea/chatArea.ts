import { UserAuthResponse } from '../../app/model/auth';
import { MessageResponse } from '../../app/model/message';
import { MessageInput } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './chatArea.module.scss';

export class ChatArea extends BaseComponent {
  public messageForm: HTMLFormElement;
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
    this.userLogin = createElementWithProperties('div', [styles.selectedLogin]);
    const selectedUserContainer = createElementWithProperties('div', [styles.selectedUser], undefined, undefined, [
      this.userIcon,
      this.userLogin,
    ]);

    const startMessage = createElementWithProperties('div', [styles.startMessage], undefined, [
      { innerText: 'Choose user to chat ...' },
    ]);
    this.messagesArea = createElementWithProperties('div', [styles.messagesArea], undefined, undefined, [startMessage]);

    this.messageInput = createElementWithProperties('input', [styles.messagesInput], MessageInput);
    const messageIcon = createElementWithProperties('span', [styles.messagesIcon]);
    this.messageButton = createElementWithProperties('button', [styles.messagesButton], { type: 'submit' }, undefined, [
      messageIcon,
    ]);
    this.messageForm = createElementWithProperties(
      'form',
      [styles.messagesForm],
      { novalidate: 'novalidate', method: '' },
      undefined,
      [this.messageInput, this.messageButton]
    );

    this.appendChildren([selectedUserContainer, this.messagesArea, this.messageForm]);
  }

  public getMessageInputValue(): string {
    const message = this.messageInput.value;
    this.messageInput.value = '';
    return message;
  }

  public setUser(data: UserAuthResponse): void {
    this.userLogin.innerText = data.login;
    this.userIcon.className = `selected-icon selected-icon_${data.isLogined}`;

    this.messagesArea.classList.add('messages-area_chosen');
  }

  public renderMessage(data: MessageResponse, isOwn: boolean): void {
    const message = createElementWithProperties('div', [styles.message, `${styles.message}_${isOwn}`], undefined, [
      { innerText: data.payload.message.text },
    ]);
    this.messagesArea.append(message);
  }
}
