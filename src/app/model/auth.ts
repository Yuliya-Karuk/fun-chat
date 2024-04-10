import { ResponseTypes } from '../../types/enums';
import { UserAuthData } from '../../types/interfaces';

export interface AuthData {
  id: string;
  type: ResponseTypes.USER_LOGIN;
  payload: {
    user: UserAuthData;
  };
}
