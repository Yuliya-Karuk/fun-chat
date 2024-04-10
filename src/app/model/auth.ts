import { ResponseTypes } from '../../types/enums';

export interface UserAuthData {
  login: string;
  password: string;
  isLogined: boolean;
}

export type UserAuthRequest = Pick<UserAuthData, 'login' | 'password'>;
export type UserAuthResponse = Pick<UserAuthData, 'login' | 'isLogined'>;

export interface AuthRequest {
  id: string;
  type: ResponseTypes.USER_LOGIN;
  payload: {
    user: UserAuthRequest;
  };
}

export interface AuthResponse {
  id: string;
  type: ResponseTypes.USER_LOGIN;
  payload: {
    user: UserAuthResponse;
  };
}
