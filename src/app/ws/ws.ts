/* eslint-disable max-lines-per-function */
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { AuthRequest } from '../model/auth';
import {
  MessageDeleteRequest,
  MessageEditRequest,
  MessageHistoryRequest,
  MessageReadRequest,
  MessageRequest,
} from '../model/message';
import { UsersActiveRequest, UsersInactiveRequest } from '../model/users';

export class WebSocketHandler {
  public ws: WebSocket;

  constructor() {
    this.ws = new WebSocket('ws://127.0.0.1:4000');

    this.bindSocketListeners();
  }

  private bindSocketListeners(): void {
    this.ws.addEventListener('message', (e: MessageEvent) => this.handleMessage(e));
  }

  public sendAuthMessage(message: AuthRequest): void {
    if (this.ws.readyState === 0) {
      this.ws.addEventListener('open', () => {
        this.ws.send(JSON.stringify(message));
      });
    } else {
      this.ws.send(JSON.stringify(message));
    }
  }

  // сделать нормальный маппинг по массиву!!!!!
  public handleMessage(e: MessageEvent): void {
    const { data } = e;
    const response = JSON.parse(data);
    // console.log(response);

    if (response.type === ResponseTypes.ERROR) {
      eventBus.emit('authError', response.payload.error);
    }

    if (response.type === ResponseTypes.USER_LOGIN) {
      if (!StorageService.isSavedUser()) {
        eventBus.emit('saveUserData', response);
        eventBus.emit('clearState', response);
      }

      eventBus.emit('authorizeUser', response);
    }

    if (response.type === ResponseTypes.USER_LOGOUT) {
      eventBus.emit('goToLoginPage', response);
    }

    if (response.type === ResponseTypes.USER_ACTIVE) {
      eventBus.emit('receivedActiveUsers', response);
    }

    if (response.type === ResponseTypes.USER_INACTIVE) {
      eventBus.emit('receivedInactiveUsers', response);
    }

    if (response.type === ResponseTypes.USER_EXTERNAL_LOGIN || response.type === ResponseTypes.USER_EXTERNAL_LOGOUT) {
      eventBus.emit('changeActivityUsers', response);
    }

    if (response.type === ResponseTypes.USER_EXTERNAL_LOGIN) {
      eventBus.emit('changeMessagesDelivered', response);
    }

    if (response.type === ResponseTypes.MSG_SEND && response.id !== null) {
      eventBus.emit('getSentMessage', response);
    }

    if (response.type === ResponseTypes.MSG_SEND && response.id === null) {
      eventBus.emit('getReceivedMessage', response);
    }

    if (response.type === ResponseTypes.MSG_FROM_USER) {
      eventBus.emit('receivedHistory', response);
    }

    if (response.type === ResponseTypes.MSG_DELIVER) {
      eventBus.emit('MSGDelivered', response);
    }

    if (response.type === ResponseTypes.MSG_READ && response.id !== null) {
      eventBus.emit('ReceivedMSGIsRead', response);
    }

    if (response.type === ResponseTypes.MSG_READ && response.id === null) {
      eventBus.emit('MSGRead', response);
    }

    if (response.type === ResponseTypes.MSG_EDIT && response.id !== null) {
      eventBus.emit('MSGEdit', response);
    }

    if (response.type === ResponseTypes.MSG_EDIT && response.id === null) {
      eventBus.emit('ReceivedMSGIsEdited', response);
    }

    if (response.type === ResponseTypes.MSG_DELETE && response.id !== null) {
      eventBus.emit('MSGDelete', response);
    }

    if (response.type === ResponseTypes.MSG_DELETE && response.id === null) {
      eventBus.emit('ReceivedMSGIsDeleted', response);
    }
  }

  public getActiveUsers(message: UsersActiveRequest): void {
    this.ws.send(JSON.stringify(message));
  }

  public getInactiveUsers(message: UsersInactiveRequest): void {
    this.ws.send(JSON.stringify(message));
  }

  public sendUserMessage(message: MessageRequest): void {
    this.ws.send(JSON.stringify(message));
  }

  public getHistory(message: MessageHistoryRequest): void {
    this.ws.send(JSON.stringify(message));
  }

  public sendMessageRead(message: MessageReadRequest): void {
    this.ws.send(JSON.stringify(message));
  }

  public sendEditedMessage(message: MessageEditRequest): void {
    this.ws.send(JSON.stringify(message));
  }

  public sendDeletedMessage(message: MessageDeleteRequest): void {
    this.ws.send(JSON.stringify(message));
  }
}

export const WS = new WebSocketHandler();
