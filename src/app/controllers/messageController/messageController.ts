import { MessageView } from '../../../components/message/message';
import { prepareDateFormat } from '../../../utils/utils';
import { Message } from '../../model/message';

export class MessageController {
  public view: MessageView = new MessageView();
  private from: string;
  private to: string;
  private text: string;
  private datetime: number;
  private isDelivered: boolean;
  private isReaded: boolean;
  private isEdited: boolean;
  private isOwn: boolean;

  constructor(message: Message, isOwn: boolean) {
    this.from = message.from;
    this.to = message.to;
    this.text = message.text;
    this.datetime = message.datetime;
    this.isDelivered = message.status.isDelivered;
    this.isReaded = message.status.isReaded;
    this.isEdited = message.status.isEdited;
    this.isOwn = isOwn;

    this.setView();
  }

  private setView(): void {
    const dateString = prepareDateFormat(this.datetime);
    this.view.setContent(this.from, this.isOwn, dateString, this.text, this.isReaded);
  }
}