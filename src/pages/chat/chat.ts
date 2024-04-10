import { AuthResponse } from '../../app/model/auth';
import { eventBus } from '../../utils/eventBus';
import { ChatView } from './chatView';

export class Chat {
  public view: ChatView;
  private data: AuthResponse;

  constructor() {
    this.view = new ChatView();

    eventBus.subscribe('goToChatPage', (data: AuthResponse) => this.setChatData(data));
    this.renderStaticParts();
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }

  private setChatData(data: AuthResponse): void {
    this.data = data;
    console.log(this.data);
    this.view.setUserName(this.data.payload.user.login);
  }
}
