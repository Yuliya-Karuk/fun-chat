import { AuthRequest, AuthResponse } from '../app/model/auth';
import { WS } from '../app/ws/ws';
import { About } from '../pages/about/about';
import { Auth } from '../pages/auth/auth';
import { Chat } from '../pages/chat/chat';
import { router } from '../router/router';
import { Routes } from '../router/router.types';
import { StorageService } from '../services/storage.service';
import { eventBus } from '../utils/eventBus';
import { isNotNullable } from '../utils/utils';

export class AppController {
  private body: HTMLElement;
  private page: Auth | About | Chat;
  private auth: Auth;
  private about: About;
  private chat: Chat;
  private loginedUser: AuthRequest | null;

  constructor(body: HTMLElement) {
    this.body = body;
    this.auth = new Auth();
    this.about = new About();
    this.chat = new Chat();

    this.checkAuthorizedUser();

    eventBus.subscribe('authorizeUser', (data: AuthResponse) => this.handleAuthorization(data));
  }

  public async setPage(location: Routes): Promise<void> {
    this.body.replaceChildren();
    this.checkAuthorizedUser();

    if (location === Routes.Auth && !this.loginedUser) {
      this.page = this.auth;
    } else if (location === Routes.About) {
      this.page = this.about;
      this.page.setLinks(Boolean(this.loginedUser));
    } else {
      this.page = this.chat;
      this.page.setLinks(Boolean(this.loginedUser));
      WS.sendAuthMessage(isNotNullable(this.loginedUser));
    }
    // this.page.loadPage();
    this.body.append(this.page.view.getNode());
  }

  private checkAuthorizedUser(): void {
    this.loginedUser = StorageService.getUserData();
  }

  private handleAuthorization(data: AuthResponse): void {
    if (this.page instanceof Auth || this.page instanceof Chat) {
      router.navigateTo(Routes.Chat);
      eventBus.emit('goToChatPage', data);
    }
  }
}
