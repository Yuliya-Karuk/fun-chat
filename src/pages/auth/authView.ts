import { BaseComponent } from '../../components/baseComponent';
import { createElementWithProperties } from '../../utils/utils';
import styles from './auth.module.scss';

export class AuthView extends BaseComponent {
  public carsBlock: HTMLDivElement;

  constructor() {
    super('div', [styles.auth]);
  }

  public renderContent(): void {
    const pageName = createElementWithProperties('h2', [styles.heading], undefined, [{ innerText: 'Auth' }]);
    this.appendChildren([pageName]);
  }
}
