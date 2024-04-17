import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './message.module.scss';

export class MessageView extends BaseComponent {
  private date: HTMLDivElement;
  private author: HTMLDivElement;
  private text: HTMLDivElement;
  private status: HTMLDivElement;
  private statusIcon: HTMLDivElement;

  constructor() {
    super('div', [styles.message]);

    this.renderContent();
  }

  private renderContent(): void {
    this.date = createElementWithProperties('div', [styles.messageDate]);
    this.author = createElementWithProperties('div', [styles.messageAuthor]);
    const infoContainer = createElementWithProperties('div', [styles.messageInfoContainer], undefined, undefined, [
      this.author,
      this.date,
    ]);

    this.text = createElementWithProperties('div', [styles.messageText]);

    this.status = createElementWithProperties('div', [styles.messageStatus]);
    this.statusIcon = createElementWithProperties('div', [
      styles.messageStatusIcon,
      `${styles.messageStatusIcon}_delivered`,
    ]);
    const statusContainer = createElementWithProperties('div', [styles.messageStatusContainer], undefined, undefined, [
      this.status,
      this.statusIcon,
    ]);

    this.appendChildren([infoContainer, this.text, statusContainer]);
  }

  public setContent(author: string, isOwn: boolean, date: string, text: string, isReaded: boolean): void {
    this.node.classList.add(`${styles.message}_${isOwn}`);
    this.author.innerText = author;
    this.date.innerText = date;
    this.text.innerText = text;
    this.status.innerText = !isReaded ? 'Delivered' : 'Read';
  }
}
