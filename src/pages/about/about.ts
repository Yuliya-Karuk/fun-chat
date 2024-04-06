import { AboutView } from './aboutView';

export class About {
  public view: AboutView;

  constructor() {
    this.view = new AboutView();

    this.renderStaticParts();
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }
}
