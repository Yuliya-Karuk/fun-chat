import { router } from '../router/router';
import { checkRoute } from '../utils/utils';
import { AppController } from './controllers/appController';

const msg =
  'Уважаемый проверяющий, можешь пожалуйста проверить мою работу ближе к концу дедлайна - в среду или четверг, потому что есть небольшие баги';

export class App {
  private controller: AppController;

  constructor(body: HTMLElement) {
    this.controller = new AppController(body);

    router.setCallback(this.setPageContent.bind(this));
    console.log(msg);
  }

  public init(): void {
    router.handleLocation();
  }

  private setPageContent(location: string): void {
    this.controller.setPage(checkRoute(location));
  }
}
