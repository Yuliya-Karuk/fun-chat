import { UserAuthResponse } from '../../app/model/auth';
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
  private messagesHistory: HTMLDivElement;
  private startHistory: HTMLDivElement;

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
    this.startHistory = createElementWithProperties('div', [styles.startHistory], undefined, [
      { innerText: 'Write your first message ...' },
    ]);
    this.messagesHistory = createElementWithProperties('div', [styles.messagesHistory], undefined, undefined, [
      this.startHistory,
    ]);
    this.messagesArea = createElementWithProperties('div', [styles.messagesArea], undefined, undefined, [
      startMessage,
      this.messagesHistory,
    ]);

    this.messageInput = createElementWithProperties('input', [styles.messagesInput], MessageInput);
    const messageIcon = createElementWithProperties('span', [styles.messagesIcon]);
    this.messageButton = createElementWithProperties(
      'button',
      [styles.messagesButton],
      { type: 'submit', disabled: 'disabled' },
      undefined,
      [messageIcon]
    );
    this.messageForm = createElementWithProperties(
      'form',
      [styles.messagesForm],
      { novalidate: 'novalidate', method: '' },
      undefined,
      [this.messageInput, this.messageButton]
    );

    this.appendChildren([selectedUserContainer, this.messagesArea, this.messageForm]);
  }

  public enableMessageForm(): void {
    this.messageInput.removeAttribute('disabled');
    this.messageButton.removeAttribute('disabled');
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

  public renderStartHistory(): void {
    this.messagesHistory.replaceChildren();
    this.messagesHistory.append(this.startHistory);
  }

  public removeMessagesHistory(): void {
    this.messagesHistory.replaceChildren();
  }

  // public renderMessage(message: Message, isOwn: boolean): void {
  //   const msg = createElementWithProperties('div', [styles.message, `${styles.message}_${isOwn}`], undefined, [
  //     { innerText: message.text },
  //   ]);
  //   this.messagesHistory.append(msg);
  // }

  // public renderNewMessage(message: Message, isOwn: boolean): void {
  //   const msg = createElementWithProperties('div', [styles.message, `${styles.message}_${isOwn}`], undefined, [
  //     { innerText: message.text },
  //   ]);
  //   this.messagesHistory.append(msg);
  //   msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // }

  public renderNewMessage(msg: HTMLElement): void {
    this.messagesHistory.append(msg);
    msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
