import { AuthData } from '../app/model/auth';
import { type About } from '../pages/about/about';
import { type Auth } from '../pages/auth/auth';
import { type Chat } from '../pages/chat/chat';
import { Routes } from '../router/router.types';
import { eventBus } from '../utils/eventBus';

export class AppController {
  private body: HTMLElement;
  private page: Auth | About | Chat;
  private pages: { auth?: Auth; about?: About; chat?: Chat };
  private data: AuthData;

  constructor(body: HTMLElement) {
    this.body = body;
    this.pages = {};

    eventBus.subscribe('goToChatPage', (data: AuthData) => this.setData(data));
  }

  public async setPage(location: Routes): Promise<void> {
    this.body.replaceChildren();

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
          this.pages.chat = new Chat(this.data);
        }

        this.page = this.pages.chat;
    }
    // this.page.loadPage();
    this.body.append(this.page.view.getNode());
  }

  private setData(data: AuthData): void {
    this.data = data;
  }
}
