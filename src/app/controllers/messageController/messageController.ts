import { MessageView } from '../../../components/message/message';
import { eventBus } from '../../../utils/eventBus';
import { checkEventTarget, prepareDateFormat } from '../../../utils/utils';
import { Message, MessageEditResponse, MessageReadResponse } from '../../model/message';

export class MessageController {
  public view: MessageView = new MessageView();
  public id: string;
  private from: string;
  public to: string;
  private text: string;
  private datetime: number;
  public isDelivered: boolean;
  public isReaded: boolean;
  private isEdited: boolean;
  private isOwn: boolean;
  private contextMenuIsShown: boolean = false;

  constructor(message: Message, isOwn: boolean) {
    this.id = message.id;
    this.from = message.from;
    this.to = message.to;
    this.text = message.text;
    this.datetime = message.datetime;
    this.isDelivered = message.status.isDelivered;
    this.isReaded = message.status.isReaded;
    this.isEdited = message.status.isEdited;
    this.isOwn = isOwn;

    this.setView();

    eventBus.subscribe('setMessageRead', (data: MessageReadResponse) => this.setMessageRead(data));
    eventBus.subscribe('setMessageEdited', (data: MessageEditResponse) => this.setMessageEdited(data));

    this.bindListeners();
  }

  private bindListeners(): void {
    if (this.isOwn) {
      this.view.getNode().addEventListener('click', () => this.handleShowContextMenu());
      this.view.editButton.addEventListener('click', () => this.handleEditing());
      this.view.deleteButton.addEventListener('click', () => this.handleDeleting());
      document.addEventListener('click', (e: Event) => this.handleContextMenu(e));
    }
  }

  private handleShowContextMenu(): void {
    this.view.showContextMenu();
    this.contextMenuIsShown = true;
  }

  private handleContextMenu(e: Event): void {
    if (!this.view.getNode().contains(checkEventTarget(e.target)) && this.contextMenuIsShown) {
      this.view.hideContextMenu();
      this.contextMenuIsShown = false;
    }
  }

  private handleEditing(): void {
    eventBus.emit('editMessage', { id: this.id, text: this.text });
  }

  private handleDeleting(): void {
    eventBus.emit('deleteMessage', { id: this.id });
  }

  private setView(): void {
    const dateString = prepareDateFormat(this.datetime);
    this.view.setContent(this.from, this.isOwn, dateString, this.text, this.isDelivered, this.isReaded, this.isEdited);
  }

  public setMessageDelivered(): void {
    this.isDelivered = true;
    this.view.setDeliveredStatus();
  }

  public setMessageRead(data: MessageReadResponse): void {
    if (data.payload.message.id === this.id) {
      this.isReaded = true;
      this.view.setReadStatus();
    }
  }

  private setMessageEdited(data: MessageEditResponse): void {
    if (data.payload.message.id === this.id) {
      this.isEdited = data.payload.message.status.isEdited;
      this.text = data.payload.message.text;
      this.view.setEditedMessage(this.isEdited, this.text);
    }
  }
}
