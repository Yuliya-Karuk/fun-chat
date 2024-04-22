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
  MessageIsDeletedResponse,
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

    eventBus.subscribe('chooseRecipient', (data: UserAuthResponse) => this.setChosenUser(data));
    eventBus.subscribe('getSentMessage', (data: MessageResponse) => this.renderSentMessage(data));
    eventBus.subscribe('getReceivedMessage', (data: MessageResponse) => this.renderReceivedMessage(data));
    eventBus.subscribe('receivedHistory', (data: MessageHistoryResponse) => this.renderHistoryMessage(data));
    eventBus.subscribe('changeMessagesDelivered', (data: ContactAuthResponse) => this.setMessageDelivered(data));
    eventBus.subscribe('ReceivedMSGIsRead', () => this.view.removeDelimiter());
    eventBus.subscribe('goToLoginPage', () => this.clearPreviousUser());
    eventBus.subscribe('editMessage', (data: MessageEdit) => this.handleMessageEditing(data));
    eventBus.subscribe('deleteMessage', (data: MessageDelete) => this.handleMessageDeleting(data));
    eventBus.subscribe('MSGDelete', (data: MessageDeleteResponse) => this.deleteMessage(data));
    eventBus.subscribe('ReceivedMSGIsDeleted', (data: MessageIsDeletedResponse) => this.deleteMessage(data));
  }

  private clearPreviousUser(): void {
    this.view.clearPreviousUser();
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

    WS.getHistory(request);
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

    WS.sendUserMessage(request);
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

    WS.sendEditedMessage(request);
  }

  private renderSentMessage(data: MessageResponse): void {
    const newMsg = new MessageController(data.payload.message, true);

    stateStorage.pushMessageToHistory(newMsg);
    this.view.renderNewMessage(newMsg.view.getNode());
  }

  private renderReceivedMessage(data: MessageResponse): void {
    const chosenUser = stateStorage.getChosenRecipient();

    if (chosenUser && data.payload.message.from === chosenUser) {
      this.view.setDelimiter();
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

      WS.sendMessageRead(request);
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

    WS.sendDeletedMessage(request);
  }

  private deleteMessage(data: MessageIsDeletedResponse | MessageDeleteResponse): void {
    const history = stateStorage.getHistory();

    const deletedMsg = history.filter(msg => msg.id === data.payload.message.id)[0];
    if (deletedMsg) {
      this.view.messagesHistory.removeChild(deletedMsg.view.getNode());
    }
    stateStorage.filterMessageHistory(data.payload.message.id);
  }
}
