import { ChatArea } from '../../../components/chatArea/chatArea';
import { stateStorage } from '../../../services/state.service';
import { ResponseTypes } from '../../../types/enums';
import { eventBus } from '../../../utils/eventBus';
import { isNotNullable } from '../../../utils/utils';
import { ContactAuthResponse, UserAuthResponse } from '../../model/auth';
import {
  Message,
  MessageDelete,
  MessageDeleteResponse,
  MessageEdit,
  MessageHistoryResponse,
  MessageReadResponse,
  MessageResponse,
} from '../../model/message';
import { WS } from '../../ws/ws';
import { MessageController } from '../messageController/messageController';

export class DialogController {
  public view: ChatArea;
  private historyRequestId: string;
  private isEditingMessage: boolean = false;
  private editedMessageId: string;
  private deletedMessageId: string;

  constructor() {
    this.view = new ChatArea();

    this.bindListeners();

    eventBus.subscribe('goToChatPage', () => this.clearPreviousUser());
    eventBus.subscribe('chooseRecipient', (data: UserAuthResponse) => this.setChosenUser(data));
    eventBus.subscribe('receivedHistory', (data: MessageHistoryResponse) => this.renderHistoryMessage(data));
    eventBus.subscribe('logoutUser', () => this.view.disableMessageForm());

    eventBus.subscribe('changeMessagesDelivered', (data: ContactAuthResponse) => this.setMessageDelivered(data));
    eventBus.subscribe('changeActivityUsers', (data: ContactAuthResponse) => this.changeActivityChosenUser(data));

    eventBus.subscribe('editMessage', (data: MessageEdit) => this.handleMessageEditing(data));
    eventBus.subscribe('deleteMessage', (data: MessageDelete) => this.handleMessageDeleting(data));

    eventBus.subscribe('setSentMessage', (data: MessageResponse) => this.renderMessage(data));
    eventBus.subscribe('setMessageRead', (data: MessageReadResponse) => this.view.removeDelimiter(data));
    eventBus.subscribe('setMessageDeleted', (data: MessageDeleteResponse) => this.deleteMessage(data));
  }

  private clearPreviousUser(): void {
    this.view.clearPreviousUser();
    stateStorage.clearState();
  }

  private bindListeners(): void {
    this.view.messageInput.addEventListener('input', () => this.handleMessageInput());
    this.view.messageForm.addEventListener('submit', (e: Event) => this.sendMessageToUser(e));
    this.view.messagesHistory.addEventListener('pointerdown', () => this.sendMessagesAreRead());
    this.view.messagesHistory.addEventListener('wheel', () => this.handleScrollMessages());
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

    WS.sendRequest(request);
  }

  private sendMessageToUser(e: Event): void {
    e.preventDefault();

    const message = this.view.getMessageInputValue();

    if (!this.isEditingMessage) {
      this.sendMessagesAreRead();
      this.sendNewMessage(message);
    } else {
      this.sendEditedMessage(message);
      this.isEditingMessage = false;
    }
  }

  private sendNewMessage(message: string): void {
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

    WS.sendRequest(request);
  }

  private sendEditedMessage(message: string): void {
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.MSG_EDIT,
      payload: {
        message: {
          id: this.editedMessageId,
          text: message,
        },
      },
    };

    WS.sendRequest(request);
  }

  private createMessage(messageData: Message, isOwn: boolean): void {
    const newMsg = new MessageController(messageData, isOwn);

    stateStorage.pushMessageToHistory(newMsg);
    this.view.renderNewMessage(newMsg.view.getNode());
  }

  private renderMessage(data: MessageResponse): void {
    if (data.id !== null) {
      this.createMessage(data.payload.message, true);
    } else {
      const chosenUser = stateStorage.getChosenRecipient();

      if (chosenUser && data.payload.message.from === chosenUser) {
        this.view.setDelimiter();
        this.createMessage(data.payload.message, false);
      }
    }
  }

  private renderHistoryMessage(data: MessageHistoryResponse): void {
    if (this.historyRequestId === data.id) {
      this.view.removeMessagesHistory();

      if (data.payload.messages.length !== 0) {
        data.payload.messages.forEach((msg: Message) => {
          const isOwn = msg.from === stateStorage.getChatOwner();
          const newMsg = new MessageController(msg, isOwn);

          if (!isOwn && newMsg.isReaded === false) {
            this.view.setDelimiter();
          }

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

      WS.sendRequest(request);
    });

    eventBus.emit('resetUnreadMessages', stateStorage.getChosenRecipient());
  }

  private handleScrollMessages(): void {
    this.sendMessagesAreRead();
  }

  private handleMessageEditing(data: MessageEdit): void {
    this.editedMessageId = data.id;
    this.isEditingMessage = true;
    this.view.setMessageInputValue(data.text);
  }

  private handleMessageDeleting(data: MessageDelete): void {
    this.deletedMessageId = data.id;
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.MSG_DELETE,
      payload: {
        message: {
          id: this.deletedMessageId,
        },
      },
    };

    WS.sendRequest(request);
  }

  private deleteMessage(data: MessageDeleteResponse): void {
    const history = stateStorage.getHistory();

    const deletedMsg = history.filter(msg => msg.id === data.payload.message.id)[0];
    if (deletedMsg) {
      this.view.messagesHistory.removeChild(deletedMsg.view.getNode());
    }
    stateStorage.filterMessageHistory(data.payload.message.id);
  }

  private changeActivityChosenUser(data: ContactAuthResponse): void {
    if (data.payload.user.login === stateStorage.getChosenRecipient()) {
      this.view.setUser(data.payload.user);
    }
  }
}
