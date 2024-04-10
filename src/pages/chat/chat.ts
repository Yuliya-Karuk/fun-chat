import { AuthData } from '../../app/model/auth';
import { ChatView } from './chatView';

export class Chat {
  public view: ChatView;
  private data: AuthData;

  constructor(data: AuthData) {
    this.view = new ChatView();
    this.data = data;
    console.log(data);

    this.renderStaticParts();
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }
}
