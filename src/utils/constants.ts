import { DomElementAttribute } from '../types/interfaces';
import { Inputs } from '../types/types';

export const AuthInputs: Record<Inputs, DomElementAttribute> = {
  name: {
    id: 'name',
    type: 'text',
    name: 'name',
    required: 'required',
    minlength: '3',
    pattern: '^[A-Z][a-zA-Z\\-]+$',
    autocomplete: 'off',
  },
  password: {
    id: 'password',
    type: 'password',
    name: 'password',
    required: 'required',
    minlength: '6',
    pattern: '^[a-zA-Z0-9]+$',
    autocomplete: 'off',
  },
};
