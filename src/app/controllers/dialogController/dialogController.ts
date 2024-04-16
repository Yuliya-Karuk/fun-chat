import { ChatArea } from '../../../components/chatArea/chatArea';
import { ResponseTypes } from '../../../types/enums';
import { eventBus } from '../../../utils/eventBus';
import { UserAuthRequest, UserAuthResponse } from '../../model/auth';
import { Message, MessageHistoryResponse, MessageResponse } from '../../model/message';
import { WS } from '../../ws/ws';

export class DialogController {
  public view: ChatArea;
  private chosenUser: UserAuthResponse;
  private user: UserAuthRequest;

  constructor() {
    this.view = new ChatArea();

    this.bindListeners();

    eventBus.subscribe('chooseUser', (data: UserAuthResponse) => this.setChosenUser(data));
    eventBus.subscribe('getSentMessage', (data: MessageResponse) => this.renderSentMessage(data));
    eventBus.subscribe('getReceivedMessage', (data: MessageResponse) => this.renderReceivedMessage(data));
    eventBus.subscribe('getHistory', (data: MessageHistoryResponse) => this.renderHistoryMessage(data));
  }

  private bindListeners(): void {
    this.view.messageForm.addEventListener('submit', (e: Event) => this.sendMessageToUser(e));
  }

  public setUserData(userData: UserAuthRequest): void {
    this.user = userData;
  }

  private setChosenUser(data: UserAuthResponse): void {
    this.chosenUser = data;
    this.view.setUser(data);

    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.MSG_FROM_USER,
      payload: {
        user: {
          login: this.chosenUser.login,
        },
      },
    };

    WS.getHistory(request);
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
    console.log(data);
    this.view.renderMessage(data.payload.message, true);
  }

  private renderReceivedMessage(data: MessageResponse): void {
    console.log(data);
    this.view.renderMessage(data.payload.message, false);
  }

  private renderHistoryMessage(data: MessageHistoryResponse): void {
    this.view.enableMessageForm();

    if (data.payload.messages.length !== 0) {
      this.view.removeStartHistory();

      data.payload.messages.forEach((msg: Message) => {
        const author = msg.from === this.user.login;
        this.view.renderMessage(msg, author);
      });
    } else {
      this.view.renderStartHistory();
    }
  }
}
