import { MessageInput } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './messageForm.module.scss';

export class MessageForm extends BaseComponent {
  public messageInput: HTMLInputElement;
  public messageIcon: HTMLSpanElement;
  public messageButton: HTMLButtonElement;

  constructor() {
    super('form', [styles.messageForm], { novalidate: 'novalidate', method: '' });

    this.renderContent();
  }

  private renderContent(): void {
    this.messageInput = createElementWithProperties('input', [styles.messageInput], MessageInput);

    const messageIcon = createElementWithProperties('span', [styles.messageIcon]);

    this.messageButton = createElementWithProperties('button', [styles.messageButton], { type: 'submit' }, undefined, [
      messageIcon,
    ]);

    this.appendChildren([this.messageInput, this.messageButton]);
  }
}
