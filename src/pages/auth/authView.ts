import { BaseComponent } from '../../components/baseComponent';
import { LoginForm } from '../../components/loginForm/loginForm';
import { createElementWithProperties } from '../../utils/utils';
import styles from './auth.module.scss';

export class AuthView extends BaseComponent {
  public carsBlock: HTMLDivElement;
  public loginForm: LoginForm;

  constructor() {
    super('div', [styles.auth]);
    this.loginForm = new LoginForm();
  }

  public renderContent(): void {
    this.renderStaticContent();
    this.loginForm.renderContent();
    this.appendChildren([this.loginForm.getNode()]);
  }

  public renderStaticContent(): void {
    const authImage = createElementWithProperties('div', [styles.authImage]);

    const authHeading = createElementWithProperties('div', [styles.authHeading], undefined, [
      { innerText: 'Stay connected with your friends and family' },
    ]);
    const authText = createElementWithProperties('div', [styles.authText], undefined, [
      { innerText: 'Secure, private messaging' },
    ]);
    const authTextContainer = createElementWithProperties('div', [styles.authTextContainer], undefined, undefined, [
      authHeading,
      authText,
    ]);

    const authContent = createElementWithProperties('div', [styles.authContent], undefined, undefined, [
      authImage,
      authTextContainer,
    ]);
    this.appendChildren([authContent]);
  }
}
