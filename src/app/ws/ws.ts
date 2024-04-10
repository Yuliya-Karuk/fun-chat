import { eventBus } from '../../utils/eventBus';
import { AuthData } from '../model/auth';

export class WebSocketHandler {
  public ws: WebSocket;

  constructor() {
    this.ws = new WebSocket('ws://127.0.0.1:4000');

    this.bindSocketListeners();
  }

  private bindSocketListeners(): void {
    this.ws.addEventListener('open', () => console.log('socket open'));
    this.ws.addEventListener('message', (e: MessageEvent) => this.handleMessage(e));
  }

  public sendAuthMessage(message: AuthData): void {
    this.ws.send(JSON.stringify(message));
  }

  public handleMessage(e: MessageEvent): void {
    const { data } = e;
    const response = JSON.parse(data);

    if (response.payload.user.isLogined) {
      eventBus.emit('goToChatPage', data);
    }
  }
}

export const WS = new WebSocketHandler();
