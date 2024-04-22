/* eslint-disable max-lines-per-function */
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { ConnectionError } from '../../utils/constants';
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
  private url: string = 'ws://127.0.0.1:4000';
  public ws: WebSocket;

  constructor() {
    this.ws = new WebSocket(this.url);

    this.bindSocketListeners();
  }

  private bindSocketListeners(): void {
    this.ws.addEventListener('message', (e: MessageEvent) => this.handleMessage(e));
    this.ws.addEventListener('close', () => this.reconnect());
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

    if (response.type === ResponseTypes.ERROR) {
      eventBus.emit('wsError', response);
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

  private reconnect(): void {
    eventBus.emit('connectionError', ConnectionError);
    this.ws = new WebSocket(this.url);

    window.setTimeout(() => {
      if (this.ws.readyState === 3) {
        this.reconnect();
      }
      if (this.ws.readyState === 1) {
        this.bindSocketListeners();
        eventBus.emit('reauthorizeUser');
      }
    }, 1000);
  }
}

export const WS = new WebSocketHandler();
