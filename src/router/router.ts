import { Callback } from '../types/types';
import { checkRoute } from '../utils/utils';
import { Routes } from './router.types';

export class Router {
  private setPage: Callback<string>;
  public currentPage: Routes;

  constructor() {
    window.onpopstate = (): void => {
      this.handleLocation();
    };
  }

  public handleLocation(): void {
    const route = window.location.pathname;
    console.log(route);
    this.currentPage = checkRoute(route);

    this.setPage(this.currentPage);
  }

  public navigateTo(location: string): void {
    window.history.pushState({}, '', location);
    this.setPage(location);
  }

  public setCallback(setPageContent: Callback<string>): void {
    this.setPage = setPageContent;
  }
}

export const router = new Router();
