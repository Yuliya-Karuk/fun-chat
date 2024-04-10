import { WS } from '../../app/ws/ws';
import { ResponseTypes } from '../../types/enums';
import { eventBus } from '../../utils/eventBus';
import { isNotNullable } from '../../utils/utils';
import { validationFunctions } from '../../utils/validityFunctions';
import { AuthView } from './authView';

export class Auth {
  public view: AuthView;

  constructor() {
    this.view = new AuthView();

    eventBus.subscribe('auth', () => this.handleAuthorization());

    this.renderStaticParts();
  }

  private renderStaticParts(): void {
    this.view.renderContent();
    this.bindListeners();
  }

  private bindListeners(): void {
    this.view.authForm.nameInput.addEventListener('input', () => this.validateLoginInput(this.view.authForm.nameInput));

    this.view.authForm.passwordInput.addEventListener('input', () =>
      this.validateLoginInput(this.view.authForm.passwordInput)
    );
    this.view.authForm.authButton.addEventListener('click', () => eventBus.emit('auth'));
  }

  private validateLoginInput(input: HTMLInputElement): void {
    const errorSpan = isNotNullable(input.nextSibling);
    const inputName = input.id;
    errorSpan.textContent = '';

    for (let i = 0; i < validationFunctions.length; i += 1) {
      errorSpan.textContent += validationFunctions[i](input, inputName);
    }

    this.view.authForm.setAuthButton();
  }

  private handleAuthorization(): void {
    const userData = this.view.authForm.getInputsValues();
    const request = {
      id: crypto.randomUUID(),
      type: ResponseTypes.USER_LOGIN,
      payload: {
        user: userData,
      },
    };

    WS.sendAuthMessage(request);
  }
}
