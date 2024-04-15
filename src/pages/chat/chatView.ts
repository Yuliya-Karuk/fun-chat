import { BaseComponent } from '../../components/baseComponent';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { Main } from '../../components/main/main';
import { PagesNames } from '../../types/enums';
import styles from './chat.module.scss';

export class ChatView extends BaseComponent {
  public header: Header = new Header(PagesNames.Chat);
  private footer: Footer = new Footer();
  private main: Main = new Main();

  constructor() {
    super('div', [styles.chat]);
  }

  public renderContent(contacts: HTMLElement, chatArea: HTMLElement): void {
    this.main.appendChildren([contacts, chatArea]);
    this.appendChildren([this.header.getNode(), this.main.getNode(), this.footer.getNode()]);
  }

  public setUserName(userName: string): void {
    this.header.setUserName(userName);
  }

  public setHeaderLinks(isLoginedUser: boolean): void {
    this.header.setLinks(isLoginedUser);
  }
}
