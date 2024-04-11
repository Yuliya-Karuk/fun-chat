import { AuthResponse } from '../app/model/auth';
import { About } from '../pages/about/about';
import { Auth } from '../pages/auth/auth';
import { Chat } from '../pages/chat/chat';
import { router } from '../router/router';
import { Routes } from '../router/router.types';
import { eventBus } from '../utils/eventBus';

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

    eventBus.subscribe('authorizeUser', (data: AuthResponse) => this.handleAuthorization(data));
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
    console.log(this.page);
    this.body.append(this.page.view.getNode());
  }

  private handleAuthorization(data: AuthResponse): void {
    if (this.page instanceof Auth || this.page instanceof Chat) {
      router.navigateTo(Routes.Chat);
      eventBus.emit('goToChatPage', data);
    }
  }
}
