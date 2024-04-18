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
  private historyRequestId: string;

  constructor() {
    this.view = new ChatArea();

    this.bindListeners();

    eventBus.subscribe('goToChatPage', () => this.clearDialog());
    eventBus.subscribe('chooseRecipient', (data: UserAuthResponse) => this.setChosenUser(data));
    eventBus.subscribe('getSentMessage', (data: MessageResponse) => this.renderSentMessage(data));
    eventBus.subscribe('getReceivedMessage', (data: MessageResponse) => this.renderReceivedMessage(data));
    eventBus.subscribe('receivedHistory', (data: MessageHistoryResponse) => this.renderHistoryMessage(data));
    eventBus.subscribe('changeMessagesDelivered', (data: ContactAuthResponse) => this.setMessageDelivered(data));
  }

  private clearDialog(): void {
    this.view.clearPreviousUser();
  }

  private bindListeners(): void {
    this.view.messageInput.addEventListener('input', () => this.handleMessageInput());
    this.view.messageForm.addEventListener('submit', (e: Event) => this.sendMessageToUser(e));
    this.view.messagesHistory.addEventListener('click', () => this.sendMessagesAreRead());
    // this.view.messagesHistory.addEventListener('scroll', () => this.sendMessagesRead());
  }

  private handleMessageInput(): void {
    if (this.view.messageInput.value === '') {
      this.view.disableMessageButton();
    } else {
      this.view.enableMessageButton();
    }
  }

  private setChosenUser(data: UserAuthResponse): void {
    this.view.setUser(data);
    this.view.enableMessageInput();

    this.historyRequestId = crypto.randomUUID();
    const request = {
      id: this.historyRequestId,
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

    this.sendMessagesAreRead();

    const message = this.view.getMessageInputValue();
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.MSG_SEND,
      payload: {
        message: {
          to: isNotNullable(stateStorage.getChosenRecipient()),
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
    const chosenUser = stateStorage.getChosenRecipient();

    if (chosenUser && data.payload.message.from === chosenUser) {
      const newMsg = new MessageController(data.payload.message, false);

      stateStorage.pushMessageToHistory(newMsg);
      this.view.renderNewMessage(newMsg.view.getNode());
    }
  }

  private renderHistoryMessage(data: MessageHistoryResponse): void {
    if (this.historyRequestId === data.id) {
      this.view.removeMessagesHistory();

      if (data.payload.messages.length !== 0) {
        data.payload.messages.forEach((msg: Message) => {
          const isOwn = msg.from === stateStorage.getChatOwner();
          const newMsg = new MessageController(msg, isOwn);

          stateStorage.pushMessageToHistory(newMsg);
          this.view.renderNewMessage(newMsg.view.getNode());
        });
      } else {
        this.view.renderStartHistory();
      }
    }
  }

  private setMessageDelivered(data: ContactAuthResponse): void {
    const chosenUser = stateStorage.getChosenRecipient();

    if (chosenUser && data.payload.user.login === chosenUser) {
      const messages = stateStorage.getUndeliveredMessages();
      messages.forEach(msg => msg.setMessageDelivered());
    }
  }

  private sendMessagesAreRead(): void {
    const messages = stateStorage.getUnreadMessages();

    messages.forEach(msg => {
      const request = {
        id: crypto.randomUUID(),
        type: ResponseTypes.MSG_READ,
        payload: {
          message: {
            id: msg.id,
          },
        },
      };

      WS.sendMessageRead(request);
    });

    eventBus.emit('resetUnreadMessages', stateStorage.getChosenRecipient());
  }

  // private setMessageRead(data: MessageIsReadedResponse): void {
  //   const msg = stateStorage.getMessageById(data.payload.message.id);
  //   if (msg) {
  //     msg.setMessageRead();
  //   }
  // }
}
