import { router } from '../router/router';
import { checkRoute } from '../utils/utils';
import { AppController } from './controllers/appController';

export class App {
  private controller: AppController;

  constructor(body: HTMLElement) {
    this.controller = new AppController(body);

    router.setCallback(this.setPageContent.bind(this));
  }

  public init(): void {
    router.handleLocation();
  }

  private setPageContent(location: string): void {
    this.controller.setPage(checkRoute(location));
  }
}
