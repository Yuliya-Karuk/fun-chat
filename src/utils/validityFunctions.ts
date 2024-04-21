import { AuthInputs } from './constants';

export type ValidationFunction = (input: HTMLInputElement, inputName: string) => string;

export function isInputTooShort(input: HTMLInputElement, inputName: string): string {
  let errorMessage = '';
  if (input.validity.tooShort) {
    errorMessage += `Your ${inputName} should contain minimum ${inputName === AuthInputs.login.name ? AuthInputs.login.minlength : AuthInputs.password.minlength} letters. `;
  }
  return errorMessage;
}

export function isInputEmpty(input: HTMLInputElement, inputName: string): string {
  let errorMessage = '';
  if (input.validity.valueMissing) {
    errorMessage += `Your ${inputName} should not be empty. `;
  }
  return errorMessage;
}

export function isContainForbiddenLetters(input: HTMLInputElement, inputName: string): string {
  let errorMessage = '';

  if (!input.value.match(AuthInputs.login.pattern) && inputName === AuthInputs.login.id) {
    errorMessage += `Only English letters, numbers and “-” are allowed.`;
  }
  if (!input.value.match(AuthInputs.password.pattern) && inputName === AuthInputs.password.id) {
    errorMessage += `Only English letters and numbers are allowed.`;
  }

  return errorMessage;
}

export const validationFunctions: ValidationFunction[] = [isInputTooShort, isInputEmpty, isContainForbiddenLetters];
