import logoPath from '../../img/logo.png';
import { Routes } from '../../router/router.types';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './header.module.scss';

export class Header extends BaseComponent {
  private projectName: string = 'Fun Chat';
  public aboutLink: HTMLAnchorElement;
  public logoutLink: HTMLAnchorElement;
  private userName: HTMLHeadingElement;

  constructor() {
    super('header', [styles.header]);

    this.createContent();
  }

  private createContent(): void {
    const headerLogo = createElementWithProperties('div', [styles.headerLogo], undefined, undefined, [
      createElementWithProperties('img', [], {
        alt: 'logo image',
        src: `${logoPath}`,
      }),
      createElementWithProperties('h1', [styles.headerTitle], undefined, [{ innerText: `${this.projectName}` }]),
    ]);

    this.userName = createElementWithProperties('h2', [styles.headerName]);

    this.aboutLink = createElementWithProperties('a', ['btn'], { href: Routes.About }, [{ innerText: 'About' }]);
    this.logoutLink = createElementWithProperties('a', ['btn'], { href: Routes.Auth }, [{ innerText: 'Logout' }]);

    const headerWrapper = createElementWithProperties('div', [styles.headerWrapper], undefined, undefined, [
      this.userName,
      headerLogo,
      this.aboutLink,
      this.logoutLink,
    ]);

    this.node.append(headerWrapper);
  }

  public setUserName(userName: string): void {
    this.userName.innerText = userName;
  }
}
