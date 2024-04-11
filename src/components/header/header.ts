import logoPath from '../../img/logo.png';
import { Routes } from '../../router/router.types';
import { PagesNames } from '../../types/enums';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './header.module.scss';

export class Header extends BaseComponent {
  private projectName: string = 'Fun Chat';
  public aboutLink: HTMLAnchorElement;
  public logoutLink: HTMLAnchorElement;
  public chatLink: HTMLAnchorElement;
  public loginLink: HTMLAnchorElement;
  private userName: HTMLHeadingElement;
  private pageName: PagesNames;

  constructor(pageName: PagesNames) {
    super('header', [styles.header]);

    this.pageName = pageName;

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

    this.aboutLink = createElementWithProperties('a', ['btn', styles.headerButton], { href: Routes.About }, [
      { innerText: 'About' },
    ]);
    this.chatLink = createElementWithProperties('a', ['btn', styles.headerButton], { href: Routes.Chat }, [
      { innerText: 'Chat' },
    ]);
    this.logoutLink = createElementWithProperties('a', ['btn', styles.headerButton], { href: Routes.Auth }, [
      { innerText: 'Logout' },
    ]);
    this.loginLink = createElementWithProperties('a', ['btn', styles.headerButton], { href: Routes.Auth }, [
      { innerText: 'Login' },
    ]);

    const headerWrapper = createElementWithProperties('div', [styles.headerWrapper], undefined, undefined, [
      this.userName,
      headerLogo,
      this.aboutLink,
      this.chatLink,
      this.logoutLink,
      this.loginLink,
    ]);

    this.node.append(headerWrapper);
  }

  public setLinks(isLoginedUser: boolean): void {
    [this.aboutLink, this.chatLink, this.logoutLink, this.loginLink].forEach(btn =>
      btn.classList.add('header-button_hidden')
    );

    if (isLoginedUser && this.pageName === PagesNames.Chat) {
      this.logoutLink.classList.remove('header-button_hidden');
      this.aboutLink.classList.remove('header-button_hidden');
    } else if (isLoginedUser && this.pageName === PagesNames.About) {
      this.chatLink.classList.remove('header-button_hidden');
      this.logoutLink.classList.remove('header-button_hidden');
    } else {
      this.loginLink.classList.remove('header-button_hidden');
    }
  }

  public setUserName(userName: string): void {
    this.userName.innerText = userName;
  }
}
