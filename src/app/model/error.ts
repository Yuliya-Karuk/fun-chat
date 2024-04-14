import { ResponseTypes } from '../../types/enums';

export interface ErrorResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    error: string;
  };
}
