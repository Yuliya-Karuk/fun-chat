import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './appImage.module.scss';

export class AppImage extends BaseComponent {
  constructor() {
    super('div', [styles.appContent]);

    this.renderContent();
  }

  public renderContent(): void {
    const appImage = createElementWithProperties('div', [styles.appImage]);

    const appHeading = createElementWithProperties('div', [styles.appHeading], undefined, [
      { innerText: 'Stay connected with your friends and family' },
    ]);
    const appText = createElementWithProperties('div', [styles.appText], undefined, [
      { innerText: 'Secure, private messaging' },
    ]);
    const appTextContainer = createElementWithProperties('div', [styles.appTextContainer], undefined, undefined, [
      appHeading,
      appText,
    ]);

    this.appendChildren([appImage, appTextContainer]);
  }
}
