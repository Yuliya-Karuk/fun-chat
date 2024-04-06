import { ChatView } from './chatView';

export class Chat {
  public view: ChatView;

  constructor() {
    this.view = new ChatView();

    this.renderStaticParts();
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }
}
