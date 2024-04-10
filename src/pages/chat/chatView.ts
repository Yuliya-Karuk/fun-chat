import { BaseComponent } from '../../components/baseComponent';
import { Header } from '../../components/header/header';
import styles from './chat.module.scss';

export class ChatView extends BaseComponent {
  public carsBlock: HTMLDivElement;
  private header: Header;

  constructor() {
    super('div', [styles.chat]);

    this.header = new Header();
  }

  public renderContent(): void {
    this.appendChildren([this.header.getNode()]);
  }

  public setUserName(userName: string): void {
    this.header.setUserName(userName);
  }
}
