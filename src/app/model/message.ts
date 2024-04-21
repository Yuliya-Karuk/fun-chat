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

export interface MessageReadRequest {
  id: string;
  type: ResponseTypes;
  payload: {
    message: Pick<Message, 'id'>;
  };
}

export type MessageRead = Pick<Message, 'id'> & {
  status: Pick<MessageStatus, 'isReaded'>;
};

export interface MessageReadResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    message: MessageRead;
  };
}

export interface MessageIsReadedResponse {
  id: null;
  type: ResponseTypes;
  payload: {
    message: MessageRead;
  };
}

export type MessageEdit = Pick<Message, 'id' | 'text'>;
export type MessageEdited = Pick<Message, 'id' | 'text'> & {
  status: Pick<MessageStatus, 'isEdited'>;
};

export interface MessageEditRequest {
  id: string;
  type: ResponseTypes;
  payload: {
    message: MessageEdit;
  };
}

export interface MessageEditResponse {
  id: string;
  type: ResponseTypes;
  payload: {
    message: MessageEdited;
  };
}

export interface MessageIsEditedResponse {
  id: null;
  type: ResponseTypes;
  payload: {
    message: MessageEdited;
  };
}
