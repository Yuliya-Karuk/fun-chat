import { ResponseTypes } from '../../types/enums';
import { UserAuthResponse } from './auth';

export interface UsersActiveRequest {
  id: string;
  type: ResponseTypes;
  payload: null;
}

export interface UsersActiveResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    users: UserAuthResponse[];
  };
}

export interface UsersInactiveRequest {
  id: string;
  type: ResponseTypes;
  payload: null;
}

export interface UsersInactiveResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    users: UserAuthResponse[];
  };
}
