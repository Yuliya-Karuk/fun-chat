import { ResponseTypes } from '../../types/enums';
import { UserAuthData } from './auth';

export interface MessageHistoryRequest {
  id: string;
  type: ResponseTypes;
  payload: {
    user: Pick<UserAuthData, 'login'>;
  };
}

export interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}

export type MessageFromUser = Pick<Message, 'to' | 'text'>;

export type MessageDelivered = Pick<Message, 'id'> & {
  status: Pick<MessageStatus, 'isDelivered'>;
};

export interface MessageHistoryResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    messages: Message[] | [];
  };
}

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

export interface MessageDeliveredResponse {
  id: null;
  type: ResponseTypes;
  payload: {
    message: MessageDelivered;
  };
}
