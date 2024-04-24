import { UserAuthResponse } from '../../app/model/auth';
import { MessageReadResponse } from '../../app/model/message';
import { MessageInput } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './chatArea.module.scss';

export class ChatArea extends BaseComponent {
  public messageForm: HTMLFormElement;
  public messagesArea: HTMLDivElement;
  private userIcon: HTMLDivElement;
  private userLogin: HTMLDivElement;
  public messageInput: HTMLInputElement;
  public messageButton: HTMLButtonElement;
  public messagesHistory: HTMLDivElement;
  private startHistory: HTMLDivElement;

  private delimiter: HTMLDivElement;
  private isDelimiterSet: boolean = false;

  constructor() {
    super('div', [styles.chatArea]);

    this.renderContent();
  }

  private renderContent(): void {
    this.delimiter = createElementWithProperties('div', [styles.messagesDelimiter]);

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

  public enableMessageInput(): void {
    this.messageInput.removeAttribute('disabled');
    this.clearMessageInput();
  }

  public clearMessageInput(): void {
    this.messageInput.value = '';
  }

  public enableMessageButton(): void {
    this.messageButton.removeAttribute('disabled');
  }

  public disableMessageButton(): void {
    this.messageButton.setAttribute('disabled', 'disabled');
  }

  public getMessageInputValue(): string {
    const message = this.messageInput.value;
    this.clearMessageInput();
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

  public renderNewMessage(msg: HTMLElement): void {
    if (this.messagesHistory.contains(this.startHistory)) {
      this.messagesHistory.removeChild(this.startHistory);
    }

    this.messagesHistory.prepend(msg);

    if (!this.isDelimiterSet) {
      msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.delimiter.scrollIntoView(true);
    }
  }

  public clearPreviousUser(): void {
    this.messagesArea.classList.remove('messages-area_chosen');
    this.removeMessagesHistory();

    this.userLogin.innerText = '';
    this.userIcon.className = `selected-icon`;
  }

  public setDelimiter(): void {
    if (!this.isDelimiterSet) {
      this.messagesHistory.prepend(this.delimiter);
      this.isDelimiterSet = true;
    }
  }

  public removeDelimiter(data: MessageReadResponse): void {
    if (this.messagesHistory.contains(this.delimiter) && data.id) {
      this.messagesHistory.removeChild(this.delimiter);
      this.isDelimiterSet = false;
    }
  }

  public setMessageInputValue(text: string): void {
    this.messageInput.value = text;
    this.messageInput.focus();
  }

  public disableMessageForm(): void {
    this.messageInput.setAttribute('disabled', 'disabled');
    this.messageButton.setAttribute('disabled', 'disabled');
  }
}
