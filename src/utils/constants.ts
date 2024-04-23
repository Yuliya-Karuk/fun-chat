import { DomElementAttribute } from '../types/interfaces';
import { Inputs } from '../types/types';

export const AuthInputs: Record<Inputs, DomElementAttribute> = {
  login: {
    id: 'login',
    type: 'text',
    name: 'login',
    required: 'required',
    minlength: '3',
    pattern: '^[a-zA-Z0-9\\-]+$',
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

export const SearchInput = {
  id: 'search',
  type: 'text',
  name: 'search',
  required: 'required',
  minlength: '3',
  placeholder: 'Search',
  autocomplete: 'off',
};

export const MessageInput = {
  id: 'message',
  type: 'text',
  name: 'message',
  required: 'required',
  minlength: '1',
  placeholder: 'Message',
  autocomplete: 'off',
  disabled: 'disabled',
};

export const AboutParagraphs = {
  0: 'Welcome to Fun Chat',
  1: 'What could be better than chatting with your friends using a chat app?',
  2: 'Fun Chat is a simple, fast and secure messaging app that can be used on multiple devices simultaneously.',
  3: 'Made by Yuliya Karuk, beginner enthusiastic front-end developer, in 2024.',
};

export const ConnectionError =
  'The connection to the server was suddenly lost. We are trying to reconnect, wait a moment, please';
