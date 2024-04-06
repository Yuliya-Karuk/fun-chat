import { AppController } from '../controllers/appController';
import { Router } from '../router/router';
import { checkRoute } from '../utils/utils';

export class App {
  private router: Router;
  private controller: AppController;

  constructor(body: HTMLElement) {
    this.router = new Router(this.setPageContent.bind(this));
    this.controller = new AppController(body);
  }

  public init(): void {
    this.router.handleLocation();
  }

  private setPageContent(location: string): void {
    this.controller.setPage(checkRoute(location));
  }
}
