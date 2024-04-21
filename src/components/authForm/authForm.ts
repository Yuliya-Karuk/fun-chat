import { UserAuthRequest } from '../../app/model/auth';
import { Routes } from '../../router/router.types';
import { AuthInputs } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './authForm.module.scss';

export class AuthForm extends BaseComponent {
  public loginInput: HTMLInputElement;
  public passwordInput: HTMLInputElement;
  public loginError: HTMLSpanElement;
  public passwordError: HTMLSpanElement;
  public aboutLink: HTMLAnchorElement;
  public submitButton: HTMLButtonElement;

  constructor() {
    super('form', [styles.authForm], { novalidate: 'novalidate', method: '' });

    this.renderContent();
  }

  private renderContent(): void {
    this.loginInput = createElementWithProperties('input', [styles.authInput], AuthInputs.login);
    this.passwordInput = createElementWithProperties('input', [styles.authInput], AuthInputs.password);

    const loginLabel = createElementWithProperties('label', [styles.authLabel], { for: 'login' }, [
      { innerText: 'Login' },
    ]);
    const passwordLabel = createElementWithProperties('label', [styles.authLabel], { for: 'password' }, [
      { innerText: 'Password' },
    ]);

    this.loginError = createElementWithProperties('span', [styles.authError]);
    this.passwordError = createElementWithProperties('span', [styles.authError]);

    const title = createElementWithProperties('h2', [styles.authTitle], undefined, [{ innerText: 'Authorization' }]);

    this.appendChildren([
      title,
      loginLabel,
      this.loginInput,
      this.loginError,
      passwordLabel,
      this.passwordInput,
      this.passwordError,
      this.renderButtons(),
    ]);
  }

  private renderButtons(): HTMLDivElement {
    this.submitButton = createElementWithProperties(
      'button',
      ['btn', styles.authButton],
      { type: 'submit', disabled: 'disabled' },
      [{ innerText: 'Log in' }]
    );

    this.aboutLink = createElementWithProperties('a', ['btn', styles.authButton], { href: Routes.About }, [
      { innerText: 'About' },
    ]);

    const buttonsContainer = createElementWithProperties('div', [styles.authButtons], undefined, undefined, [
      this.aboutLink,
      this.submitButton,
    ]);

    return buttonsContainer;
  }

  public setSubmitButton(): void {
    if (this.loginInput.checkValidity() && this.passwordInput.checkValidity()) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'disabled');
    }
  }

  public getInputsValues(): UserAuthRequest {
    const login = String(this.loginInput.value);
    const password = String(this.passwordInput.value);
    return { login, password };
  }

  public clearInputsValues(): void {
    this.loginInput.value = '';
    this.passwordInput.value = '';
  }
}
