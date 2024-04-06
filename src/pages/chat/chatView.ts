import { BaseComponent } from '../../components/baseComponent';
import { createElementWithProperties } from '../../utils/utils';
import styles from './chat.module.scss';

export class ChatView extends BaseComponent {
  public carsBlock: HTMLDivElement;

  constructor() {
    super('div', [styles.chat]);
  }

  public renderContent(): void {
    const pageName = createElementWithProperties('h2', [styles.heading], undefined, [{ innerText: 'Chat' }]);
    this.appendChildren([pageName]);
  }
}
