import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './message.module.scss';

export class MessageView extends BaseComponent {
  private date: HTMLDivElement;
  private author: HTMLDivElement;
  private text: HTMLDivElement;
  private deliveryStatus: HTMLDivElement;
  private editStatus: HTMLDivElement;
  public editButton: HTMLSpanElement;
  public deleteButton: HTMLSpanElement;
  public contextMenu: HTMLDivElement;

  constructor() {
    super('div', [styles.message]);

    this.renderContent();
    this.renderContextMenu();
  }

  private renderContent(): void {
    this.date = createElementWithProperties('div', [styles.messageDate]);
    this.author = createElementWithProperties('div', [styles.messageAuthor]);
    const infoContainer = createElementWithProperties('div', [styles.messageInfoContainer], undefined, undefined, [
      this.author,
      this.date,
    ]);

    this.text = createElementWithProperties('div', [styles.messageText]);

    this.deliveryStatus = createElementWithProperties('div', [styles.deliveryStatus]);
    this.editStatus = createElementWithProperties('div', [styles.editStatus]);
    const statusContainer = createElementWithProperties('div', [styles.messageStatusContainer], undefined, undefined, [
      this.deliveryStatus,
      this.editStatus,
    ]);

    this.appendChildren([infoContainer, this.text, statusContainer]);
  }

  private renderContextMenu(): void {
    this.editButton = createElementWithProperties('span', [styles.contextButton], undefined, [{ innerText: 'Edit' }]);
    this.deleteButton = createElementWithProperties('span', [styles.contextButton], undefined, [
      { innerText: 'Delete' },
    ]);

    this.contextMenu = createElementWithProperties('div', [styles.contextMenu], undefined, undefined, [
      this.editButton,
      this.deleteButton,
    ]);
  }

  public setContent(
    author: string,
    isOwn: boolean,
    date: string,
    text: string,
    isDelivered: boolean,
    isReaded: boolean,
    isEdited: boolean
  ): void {
    this.node.classList.add(`${styles.message}_${isOwn}`);
    this.author.innerText = author;
    this.date.innerText = date;
    this.text.innerText = text;
    this.editStatus.innerText = isEdited ? 'Edited' : '';
    if (isDelivered) {
      this.deliveryStatus.innerText = !isReaded ? 'Delivered' : 'Read';
    } else {
      this.deliveryStatus.innerText = 'Undelivered';
    }
  }

  public setDeliveredStatus(): void {
    this.deliveryStatus.innerText = 'Delivered';
  }

  public setReadStatus(): void {
    this.deliveryStatus.innerText = 'Read';
  }

  public showContextMenu(): void {
    this.appendChildren([this.contextMenu]);
  }

  public hideContextMenu(): void {
    this.node.removeChild(this.contextMenu);
  }

  public setEditedMessage(isEdited: boolean, text: string): void {
    if (isEdited) {
      this.editStatus.innerText = 'Edited';
      this.text.innerText = text;
    }
  }
}
