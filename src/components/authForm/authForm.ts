import { UserAuthData } from '../../types/interfaces';
import { AuthInputs } from '../../utils/constants';
import { createElementWithProperties } from '../../utils/utils';
import { BaseComponent } from '../baseComponent';
import styles from './authForm.module.scss';

export class AuthForm extends BaseComponent {
  public nameInput: HTMLInputElement;
  public passwordInput: HTMLInputElement;
  public element: HTMLFormElement;
  public nameError: HTMLSpanElement;
  public passwordError: HTMLSpanElement;
  public authButton: HTMLButtonElement;

  constructor() {
    super('div', [styles.authForm], { novalidate: 'novalidate', method: '' });
  }

  public renderContent(): void {
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

    this.authButton = createElementWithProperties(
      'button',
      ['btn', styles.authButton],
      { type: 'submit', disabled: 'disabled' },
      [{ innerText: 'Log in' }]
    );

    this.appendChildren([
      title,
      nameLabel,
      this.nameInput,
      this.nameError,
      surnameLabel,
      this.passwordInput,
      this.passwordError,
      this.authButton,
    ]);
  }

  public setAuthButton(): void {
    if (this.nameInput.checkValidity() && this.passwordInput.checkValidity()) {
      this.authButton.removeAttribute('disabled');
    } else {
      this.authButton.setAttribute('disabled', 'disabled');
    }
  }

  public getInputsValues(): UserAuthData {
    const login = String(this.nameInput.value);
    const password = String(this.passwordInput.value);
    return { login, password };
  }
}
