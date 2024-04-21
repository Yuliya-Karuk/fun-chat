import { UserAuthRequest } from '../../app/model/auth';
import { Routes } from '../../router/router.types';
import { AuthInputs } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './authForm.module.scss';

export class AuthForm extends BaseComponent {
  public nameInput: HTMLInputElement;
  public passwordInput: HTMLInputElement;
  public nameError: HTMLSpanElement;
  public passwordError: HTMLSpanElement;
  public aboutLink: HTMLAnchorElement;
  public submitButton: HTMLButtonElement;

  constructor() {
    super('form', [styles.authForm], { novalidate: 'novalidate', method: '' });

    this.renderContent();
  }

  private renderContent(): void {
    this.nameInput = createElementWithProperties('input', [styles.authInput], AuthInputs.name);
    this.passwordInput = createElementWithProperties('input', [styles.authInput], AuthInputs.password);

    const nameLabel = createElementWithProperties('label', [styles.authLabel], { for: 'name' }, [
      { innerText: 'Name' },
    ]);
    const surnameLabel = createElementWithProperties('label', [styles.authLabel], { for: 'password' }, [
      { innerText: 'Password' },
    ]);

    this.nameError = createElementWithProperties('span', [styles.authError]);
    this.passwordError = createElementWithProperties('span', [styles.authError]);

    const title = createElementWithProperties('h2', [styles.authTitle], undefined, [{ innerText: 'Authorization' }]);

    this.appendChildren([
      title,
      nameLabel,
      this.nameInput,
      this.nameError,
      surnameLabel,
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
    if (this.nameInput.checkValidity() && this.passwordInput.checkValidity()) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'disabled');
    }
  }

  public getInputsValues(): UserAuthRequest {
    const login = String(this.nameInput.value);
    const password = String(this.passwordInput.value);
    return { login, password };
  }

  public clearInputsValues(): void {
    this.nameInput.value = '';
    this.passwordInput.value = '';
  }
}
