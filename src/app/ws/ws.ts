import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { AuthRequest } from '../model/auth';
import { MessageRequest } from '../model/message';
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

  public handleMessage(e: MessageEvent): void {
    const { data } = e;
    const response = JSON.parse(data);
    console.log(response);

    if (response.type === ResponseTypes.ERROR) {
      eventBus.emit('authError', response.payload.error);
    }

    if (response.type === ResponseTypes.USER_LOGIN) {
      if (!StorageService.isSavedUser()) {
        eventBus.emit('saveUserData', response);
      }

      eventBus.emit('authorizeUser', response);
    }

    if (response.type === ResponseTypes.USER_LOGOUT) {
      eventBus.emit('goToLoginPage', response);
    }

    if (response.type === ResponseTypes.USER_ACTIVE) {
      eventBus.emit('getActiveUsers', response);
    }

    if (response.type === ResponseTypes.USER_INACTIVE) {
      eventBus.emit('getInactiveUsers', response);
    }

    if (response.type === ResponseTypes.USER_EXTERNAL_LOGIN || response.type === ResponseTypes.USER_EXTERNAL_LOGOUT) {
      eventBus.emit('changeActivityUsers', response);
    }

    if (response.type === ResponseTypes.MSG_SEND) {
      eventBus.emit('getSentMessage', response);
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
}

export const WS = new WebSocketHandler();
