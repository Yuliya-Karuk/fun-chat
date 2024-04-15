import { ResponseTypes } from '../../types/enums';

export interface MessageRequest {
  id: string;
  type: ResponseTypes;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}

export interface MessageResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    message: {
      id: string;
      from: string;
      to: string;
      text: string;
      datetime: number;
      status: {
        isDelivered: boolean;
        isReaded: boolean;
        isEdited: boolean;
      };
    };
  };
}
