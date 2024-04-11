import { BaseComponent } from '../../components/baseComponent';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { Main } from '../../components/main/main';
import { SearchForm } from '../../components/searchForm/searchForm';
import { createElementWithProperties } from '../../utils/utils';
import styles from './chat.module.scss';

export class ChatView extends BaseComponent {
  public carsBlock: HTMLDivElement;
  public header: Header = new Header();
  private footer: Footer = new Footer();
  private main: Main = new Main();
  private searchForm: SearchForm = new SearchForm();
  public contacts: HTMLDivElement;

  constructor() {
    super('div', [styles.chat]);
  }

  public renderContent(): void {
    this.appendChildren([this.header.getNode(), this.main.getNode(), this.footer.getNode()]);

    this.renderMainContent();
  }

  private renderMainContent(): void {
    this.contacts = createElementWithProperties('div', [styles.contacts]);
    const contactsContainer = createElementWithProperties('div', [styles.contactsContainer], undefined, undefined, [
      this.searchForm.getNode(),
      this.contacts,
    ]);
    const chatArea = createElementWithProperties('div', [styles.chatArea]);
    this.main.appendChildren([contactsContainer, chatArea]);
  }

  public setUserName(userName: string): void {
    this.header.setUserName(userName);
  }
}
