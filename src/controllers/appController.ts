import { About } from '../pages/about/about';
import { Auth } from '../pages/auth/auth';
import { Chat } from '../pages/chat/chat';
import { Routes } from '../router/router.types';

export class AppController {
  private body: HTMLElement;
  private page: Auth | About | Chat;
  private auth: Auth;
  private about: About;
  private chat: Chat;

  constructor(body: HTMLElement) {
    this.body = body;
    this.auth = new Auth();
    this.about = new About();
    this.chat = new Chat();
  }

  public async setPage(location: Routes): Promise<void> {
    this.body.replaceChildren();

    switch (location) {
      case Routes.Auth:
        this.page = this.auth;
        break;
      case Routes.About:
        this.page = this.about;
        break;
      default:
        this.page = this.chat;
    }
    // this.page.loadPage();
    this.body.append(this.page.view.getNode());
  }
}
