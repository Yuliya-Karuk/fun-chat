export type ValidationFunction = (input: HTMLInputElement) => string;

export function isInputTooShort(input: HTMLInputElement): string {
  let errorMessage = '';
  if (!input.value || input.validity.tooShort) {
    errorMessage += `Your Car Name should contain minimum 3 letters. `;
  }
  return errorMessage;
}

export function isFirstLetterLowerCase(input: HTMLInputElement): string {
  let errorMessage = '';
  if (!input.value || input.value[0].toUpperCase() !== input.value[0]) {
    errorMessage += `Your Car Name should start with capital letter. `;
  }
  return errorMessage;
}

export function isContainForbiddenLetters(input: HTMLInputElement): string {
  let errorMessage = '';
  if (!input.value.match('^[0-9a-zA-Z\\-\\ ]+$')) {
    errorMessage += `Only English letters, numbers, space and hyphen are allowed.`;
  }
  return errorMessage;
}

export const validationFunctions: ValidationFunction[] = [
  isInputTooShort,
  isFirstLetterLowerCase,
  isContainForbiddenLetters,
];
