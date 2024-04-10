import { AppController } from '../controllers/appController';
import { Router } from '../router/router';
import { Routes } from '../router/router.types';
import { eventBus } from '../utils/eventBus';
import { checkRoute } from '../utils/utils';

export class App {
  private router: Router;
  private controller: AppController;

  constructor(body: HTMLElement) {
    this.router = new Router(this.setPageContent.bind(this));
    this.controller = new AppController(body);

    eventBus.subscribe('goToChatPage', () => this.changePage(Routes.Chat));
  }

  public init(): void {
    this.router.handleLocation();
  }

  private setPageContent(location: string): void {
    this.controller.setPage(checkRoute(location));
  }

  private changePage(location: Routes): void {
    this.router.navigateTo(location);
  }
}
