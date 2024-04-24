import { About } from '../../pages/about/about';
import { Auth } from '../../pages/auth/auth';
import { Chat } from '../../pages/chat/chat';
import { router } from '../../router/router';
import { Routes } from '../../router/router.types';
import { StorageService } from '../../services/storage.service';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { isNotNullable } from '../../utils/utils';
import { WS } from '../ws/ws';
import { ModalController } from './modalController/modalController';

export class AppController {
  private body: HTMLElement;
  private page: Auth | About | Chat;
  private auth: Auth;
  private about: About;
  private chat: Chat;
  private modalController: ModalController = new ModalController();

  constructor(body: HTMLElement) {
    this.body = body;
    this.auth = new Auth();
    this.about = new About();
    this.chat = new Chat();

    this.setModal();

    eventBus.subscribe('authorizeUser', () => this.handleAuthorization());
    eventBus.subscribe('reauthorizeUser', () => this.reauthorizeUser());
    eventBus.subscribe('logoutUser', () => this.logoutUser());
  }

  private setModal(): void {
    this.body.append(this.modalController.view.getNode());
  }

  private reauthorizeUser(): void {
    if (StorageService.isSavedUser()) {
      const request = {
        id: crypto.randomUUID(),
        type: ResponseTypes.USER_LOGIN,
        payload: {
          user: isNotNullable(StorageService.getUserData()),
        },
      };

      WS.sendRequest(request);
    }
  }

  public async setPage(location: Routes): Promise<void> {
    if (this.page) {
      this.body.removeChild(this.page.view.getNode());
    }

    const isSavedUser = StorageService.isSavedUser();

    if (location === Routes.Chat && !isSavedUser) {
      router.navigateTo(Routes.Auth);
      return;
    }

    if (location === Routes.Auth && !isSavedUser) {
      this.page = this.auth;
    } else if (location === Routes.About) {
      this.page = this.about;
      this.page.setLinks(isSavedUser);
    } else {
      this.page = this.chat;
      this.page.setLinks(isSavedUser);
    }

    this.body.prepend(this.page.view.getNode());
  }

  private handleAuthorization(): void {
    if (this.page instanceof Auth || this.page instanceof Chat) {
      router.navigateTo(Routes.Chat);
      eventBus.emit('goToChatPage', StorageService.getUserData());
    }
  }

  private logoutUser(): void {
    StorageService.removeUserData();

    router.navigateTo(Routes.Auth);
  }
}
