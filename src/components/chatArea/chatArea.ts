import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import { MessageForm } from '../messageForm/messageForm';
import styles from './chatArea.module.scss';

export class ChatArea extends BaseComponent {
  public form: MessageForm = new MessageForm();
  public selectedUser: HTMLDivElement;
  public messagesArea: HTMLDivElement;

  constructor() {
    super('div', [styles.chatArea]);

    this.renderContent();
  }

  public renderContent(): void {
    this.selectedUser = createElementWithProperties('div', [styles.selectedUser]);

    this.messagesArea = createElementWithProperties('div', [styles.messagesArea]);

    this.appendChildren([this.selectedUser, this.messagesArea, this.form.getNode()]);
  }
}
