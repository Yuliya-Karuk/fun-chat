import { BaseComponent } from '../../components/baseComponent';
import { createElementWithProperties } from '../../utils/utils';
import styles from './about.module.scss';

export class AboutView extends BaseComponent {
  constructor() {
    super('div', [styles.about]);
  }

  public renderContent(): void {
    const pageName = createElementWithProperties('h2', [styles.heading], undefined, [{ innerText: 'About' }]);
    this.appendChildren([pageName]);
  }
}
