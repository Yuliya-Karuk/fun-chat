import { MessageView } from '../../../components/message/message';
import { eventBus } from '../../../utils/eventBus';
import { prepareDateFormat } from '../../../utils/utils';
import { Message } from '../../model/message';

export class MessageController {
  public view: MessageView = new MessageView();
  public id: string;
  private from: string;
  public to: string;
  private text: string;
  private datetime: number;
  public isDelivered: boolean;
  private isReaded: boolean;
  private isEdited: boolean;
  private isOwn: boolean;

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

    eventBus.subscribe('deliverMessage', () => this.setMessageDelivered());
  }

  private setView(): void {
    const dateString = prepareDateFormat(this.datetime);
    this.view.setContent(this.from, this.isOwn, dateString, this.text, this.isDelivered, this.isReaded);
  }

  public setMessageDelivered(): void {
    this.view.setDeliveredStatus();
  }
}
