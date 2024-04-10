import { AuthInputs } from './constants';

export type ValidationFunction = (input: HTMLInputElement, inputName: string) => string;

export function isInputTooShort(input: HTMLInputElement, inputName: string): string {
  let errorMessage = '';
  if (input.validity.tooShort) {
    errorMessage += `Your ${inputName} should contain minimum ${inputName === 'name' ? AuthInputs.name.minlength : AuthInputs.password.minlength} letters. `;
  }
  return errorMessage;
}

export function isFirstLetterLowerCase(input: HTMLInputElement, inputName: string): string {
  let errorMessage = '';
  if (input.value && input.value[0].toUpperCase() !== input.value[0] && inputName === AuthInputs.name.id) {
    errorMessage += `Your ${inputName} should start with capital letter. `;
  }
  return errorMessage;
}

export function isContainForbiddenLetters(input: HTMLInputElement, inputName: string): string {
  let errorMessage = '';

  if (!input.value.match(AuthInputs.name.pattern) && inputName === AuthInputs.name.id) {
    errorMessage += `Only English letters and “-” are allowed.`;
  }
  if (!input.value.match(AuthInputs.password.pattern) && inputName === AuthInputs.password.id) {
    errorMessage += `Only English letters and numbers are allowed.`;
  }

  return errorMessage;
}

export const validationFunctions: ValidationFunction[] = [
  isInputTooShort,
  isFirstLetterLowerCase,
  isContainForbiddenLetters,
];
