import { AppImage } from '../../components/appImageBlock/appImage';
import { AuthForm } from '../../components/authForm/authForm';
import { BaseComponent } from '../../components/baseComponent';
import styles from './auth.module.scss';

export class AuthView extends BaseComponent {
  public carsBlock: HTMLDivElement;
  public authForm: AuthForm;
  public appImage: AppImage;

  constructor() {
    super('div', [styles.auth]);

    this.authForm = new AuthForm();
    this.appImage = new AppImage();
  }

  public renderContent(): void {
    this.appendChildren([this.appImage.getNode(), this.authForm.getNode()]);
  }

  public clearInputs(): void {
    this.authForm.clearInputsValues();
  }
}
