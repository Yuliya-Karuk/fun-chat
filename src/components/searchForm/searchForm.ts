import { SearchInput } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './searchForm.module.scss';

export class SearchForm extends BaseComponent {
  public searchInput: HTMLInputElement;
  public searchButton: HTMLButtonElement;

  constructor() {
    super('form', [styles.searchForm], { novalidate: 'novalidate', method: '' });

    this.renderContent();
  }

  private renderContent(): void {
    this.searchInput = createElementWithProperties('input', [styles.searchInput], SearchInput);

    const searchIcon = createElementWithProperties('span', [styles.searchIcon]);

    this.searchButton = createElementWithProperties('button', [styles.searchButton], { type: 'submit' }, undefined, [
      searchIcon,
    ]);

    this.appendChildren([this.searchInput, this.searchButton]);
  }
}
