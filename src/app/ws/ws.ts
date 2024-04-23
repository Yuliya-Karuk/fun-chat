import { ResponseTypes } from '../../types/enums';
import { ConnectionError } from '../../utils/constants';
import { eventBus } from '../../utils/eventBus';
import { checkResponseType } from '../../utils/utils';
import { AuthRequest } from '../model/auth';
import {
  MessageDeleteRequest,
  MessageEditRequest,
  MessageHistoryRequest,
  MessageReadRequest,
  MessageRequest,
} from '../model/message';
import { UsersActiveRequest, UsersInactiveRequest } from '../model/users';

type WebSocketRequest =
  | AuthRequest
  | UsersActiveRequest
  | UsersInactiveRequest
  | MessageRequest
  | MessageHistoryRequest
  | MessageReadRequest
  | MessageEditRequest
  | MessageDeleteRequest;

const WebSocketEvent = {
  [ResponseTypes.ERROR]: ['responseError'],
  [ResponseTypes.USER_LOGIN]: ['authorizeUser'],
  [ResponseTypes.USER_LOGOUT]: ['logoutUser'],
  [ResponseTypes.USER_ACTIVE]: ['receivedActiveUsers'],
  [ResponseTypes.USER_INACTIVE]: ['receivedInactiveUsers'],
  [ResponseTypes.USER_EXTERNAL_LOGIN]: ['changeActivityUsers', 'changeMessagesDelivered'],
  [ResponseTypes.USER_EXTERNAL_LOGOUT]: ['changeActivityUsers'],
  [ResponseTypes.MSG_SEND]: ['setSentMessage'],
  [ResponseTypes.MSG_FROM_USER]: ['receivedHistory'],
  [ResponseTypes.MSG_DELIVER]: ['MSGDelivered'],
  [ResponseTypes.MSG_READ]: ['setMessageRead'],
  [ResponseTypes.MSG_EDIT]: ['setMessageEdited'],
  [ResponseTypes.MSG_DELETE]: ['setMessageDeleted'],
};

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

  public handleMessage(e: MessageEvent): void {
    const { data } = e;
    const response = JSON.parse(data);

    const events = WebSocketEvent[checkResponseType(response.type)];
    events.forEach(event => eventBus.emit(event, response));
  }

  public sendRequest(request: WebSocketRequest): void {
    if (this.ws.readyState === 0) {
      this.ws.addEventListener('open', () => {
        this.ws.send(JSON.stringify(request));
      });
    } else {
      this.ws.send(JSON.stringify(request));
    }
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
