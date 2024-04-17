import { ChatArea } from '../../../components/chatArea/chatArea';
import { stateStorage } from '../../../services/state.service';
import { ResponseTypes } from '../../../types/enums';
import { eventBus } from '../../../utils/eventBus';
import { isNotNullable } from '../../../utils/utils';
import { ContactAuthResponse, UserAuthResponse } from '../../model/auth';
import { Message, MessageHistoryResponse, MessageResponse } from '../../model/message';
import { WS } from '../../ws/ws';
import { MessageController } from '../messageController/messageController';

export class DialogController {
  public view: ChatArea;

  constructor() {
    this.view = new ChatArea();

    this.bindListeners();

    eventBus.subscribe('goToChatPage', () => this.clearDialog());
    eventBus.subscribe('chooseUser', (data: UserAuthResponse) => this.setChosenUser(data));
    eventBus.subscribe('getSentMessage', (data: MessageResponse) => this.renderSentMessage(data));
    eventBus.subscribe('getReceivedMessage', (data: MessageResponse) => this.renderReceivedMessage(data));
    eventBus.subscribe('getHistory', (data: MessageHistoryResponse) => this.renderHistoryMessage(data));
    eventBus.subscribe('changeMessagesDelivered', (data: ContactAuthResponse) => this.setMessageDelivered(data));
  }

  private clearDialog(): void {
    this.view.clearPreviousUser();
  }

  private bindListeners(): void {
    this.view.messageForm.addEventListener('submit', (e: Event) => this.sendMessageToUser(e));
  }

  private setChosenUser(data: UserAuthResponse): void {
    this.view.setUser(data);

    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.MSG_FROM_USER,
      payload: {
        user: {
          login: data.login,
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
          to: isNotNullable(stateStorage.getChosenUser()).login,
          text: message,
        },
      },
    };
    WS.sendUserMessage(request);
  }

  private renderSentMessage(data: MessageResponse): void {
    const newMsg = new MessageController(data.payload.message, true);

    stateStorage.pushMessageToHistory(newMsg);
    this.view.renderNewMessage(newMsg.view.getNode());
  }

  private renderReceivedMessage(data: MessageResponse): void {
    const chosenUser = stateStorage.getChosenUser();

    if (chosenUser && data.payload.message.from === chosenUser.login) {
      const newMsg = new MessageController(data.payload.message, false);

      stateStorage.pushMessageToHistory(newMsg);
      this.view.renderNewMessage(newMsg.view.getNode());
    }
  }

  private renderHistoryMessage(data: MessageHistoryResponse): void {
    this.view.enableMessageForm();
    this.view.removeMessagesHistory();

    if (data.payload.messages.length !== 0) {
      data.payload.messages.forEach((msg: Message) => {
        const isOwn = msg.from === stateStorage.getUser().login;
        const newMsg = new MessageController(msg, isOwn);

        stateStorage.pushMessageToHistory(newMsg);
        this.view.renderNewMessage(newMsg.view.getNode());
      });
    } else {
      this.view.renderStartHistory();
    }
  }

  private setMessageDelivered(data: ContactAuthResponse): void {
    const chosenUser = stateStorage.getChosenUser();

    if (chosenUser && data.payload.user.login === chosenUser.login) {
      const messages = stateStorage.getUndeliveredMessages();
      messages.forEach(msg => msg.setMessageDelivered());
    }
  }
}
