import { BaseComponent } from '../baseComponent';
import styles from './main.module.scss';

export class Main extends BaseComponent {
  constructor() {
    super('main', [styles.main]);
  }
}
