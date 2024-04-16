import { ResponseTypes } from '../../types/enums';

export interface MessageHistoryRequest {
  id: string;
  type: ResponseTypes;
  payload: {
    user: {
      login: string;
    };
  };
}

export interface MessageHistoryResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    messages: [];
  };
}

export interface Message {
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
}

export type MessageFromUser = Pick<Message, 'to' | 'text'>;

export interface MessageRequest {
  id: string;
  type: ResponseTypes;
  payload: {
    message: MessageFromUser;
  };
}

export interface MessageResponse {
  id: string | null;
  type: ResponseTypes;
  payload: {
    message: Message;
  };
}
