import { ChatArea } from '../../../components/chatArea/chatArea';
import { ResponseTypes } from '../../../types/enums';
import { eventBus } from '../../../utils/eventBus';
import { UserAuthResponse } from '../../model/auth';
import { MessageResponse } from '../../model/message';
import { WS } from '../../ws/ws';

export class DialogController {
  public view: ChatArea;
  private chosenUser: UserAuthResponse;

  constructor() {
    this.view = new ChatArea();

    this.bindListeners();

    eventBus.subscribe('chooseUser', (data: UserAuthResponse) => this.setUser(data));
    eventBus.subscribe('getSentMessage', (data: MessageResponse) => this.renderSentMessage(data));
  }

  private bindListeners(): void {
    this.view.messageForm.addEventListener('submit', (e: Event) => this.sendMessageToUser(e));
  }

  private setUser(data: UserAuthResponse): void {
    this.chosenUser = data;
    this.view.setUser(data);
  }

  private sendMessageToUser(e: Event): void {
    e.preventDefault();
    const message = this.view.getMessageInputValue();
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.MSG_SEND,
      payload: {
        message: {
          to: this.chosenUser.login,
          text: message,
        },
      },
    };
    WS.sendUserMessage(request);
  }

  private renderSentMessage(data: MessageResponse): void {
    // this.view.renderMessage(data, true);
    console.log(data);
  }
}
