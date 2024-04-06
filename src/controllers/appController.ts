import { type About } from '../pages/about/about';
import { type Auth } from '../pages/auth/auth';
import { type Chat } from '../pages/chat/chat';
import { Routes } from '../router/router.types';

export class AppController {
  private body: HTMLElement;
  private page: Auth | About | Chat;
  private pages: { auth?: Auth; about?: About; chat?: Chat };

  constructor(body: HTMLElement) {
    this.body = body;
    this.pages = {};
  }

  public async setPage(location: Routes): Promise<void> {
    switch (location) {
      case Routes.Auth:
        if (!this.pages.auth) {
          const { Auth } = await import('../pages/auth/auth');
          this.pages.auth = new Auth();
        }

        this.page = this.pages.auth;
        break;
      case Routes.About:
        if (!this.pages.about) {
          const { About } = await import('../pages/about/about');
          this.pages.about = new About();
        }

        this.page = this.pages.about;
        break;
      default:
        if (!this.pages.chat) {
          const { Chat } = await import('../pages/chat/chat');
          this.pages.chat = new Chat();
        }

        this.page = this.pages.chat;
    }

    // this.page.loadPage();
    this.body.append(this.page.view.getNode());
  }
}
