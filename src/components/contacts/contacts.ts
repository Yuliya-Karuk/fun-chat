import { SearchInput } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './contacts.module.scss';

export class Contacts extends BaseComponent {
  public contacts: HTMLDivElement;
  public searchInput: HTMLInputElement;
  public searchButton: HTMLButtonElement;
  public searchForm: HTMLFormElement;

  constructor() {
    super('div', [styles.contactsContainer]);

    this.renderContent();
  }

  private renderContent(): void {
    this.searchInput = createElementWithProperties('input', [styles.searchInput], SearchInput);

    const searchIcon = createElementWithProperties('span', [styles.searchIcon]);

    this.searchButton = createElementWithProperties('button', [styles.searchButton], { type: 'submit' }, undefined, [
      searchIcon,
    ]);

    this.searchForm = createElementWithProperties(
      'form',
      [styles.searchForm],
      {
        novalidate: 'novalidate',
        method: '',
      },
      undefined,
      [this.searchInput, this.searchButton]
    );

    this.contacts = createElementWithProperties('div', [styles.contacts]);

    this.appendChildren([this.searchForm, this.contacts]);
  }

  public clearContacts(): void {
    this.contacts.replaceChildren();
  }
}
