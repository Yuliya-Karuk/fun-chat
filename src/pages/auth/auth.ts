import { AuthView } from './authView';

export class Auth {
  public view: AuthView;

  constructor() {
    this.view = new AuthView();

    this.renderStaticParts();
  }

  private renderStaticParts(): void {
    this.view.renderContent();
  }
}
