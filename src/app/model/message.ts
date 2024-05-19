import { ResponseTypes } from '../../types/enums';
import { UserAuthData } from './auth';

export interface MessageStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}

export type HistoryRequestUser = Pick<UserAuthData, 'login'>;

export type MessageFromUser = Pick<Message, 'to' | 'text'>;

export type MessageDelivered = Pick<Message, 'id'> & {
  status: Pick<MessageStatus, 'isDelivered'>;
};

export type MessageRead = Pick<Message, 'id'>;
export type MessageIsRead = Pick<Message, 'id'> & {
  status: Pick<MessageStatus, 'isReaded'>;
};

export type MessageEdit = Pick<Message, 'id' | 'text'>;
export type MessageEdited = Pick<Message, 'id' | 'text'> & {
  status: Pick<MessageStatus, 'isEdited'>;
};

export type MessageDelete = Pick<Message, 'id'>;
export type MessageDeleted = Pick<Message, 'id'> & {
  status: Pick<MessageStatus, 'isDeleted'>;
};

interface Response {
  id: string | null;
  type: ResponseTypes;
  payload: {
    message?: Message | MessageDelivered | MessageIsRead | MessageEdited | MessageDeleted;
    messages?: Message[];
  };
}

export interface Request {
  id: string;
  type: ResponseTypes;
  payload: {
    message?: MessageFromUser | MessageRead | MessageEdit | MessageDelete;
    user?: HistoryRequestUser;
  };
}

export interface MessageHistoryRequest extends Request {
  payload: {
    user: HistoryRequestUser;
  };
}

export interface MessageHistoryResponse extends Response {
  payload: {
    messages: Message[] | [];
  };
}

export interface MessageRequest extends Request {
  payload: {
    message: MessageFromUser;
  };
}

export interface MessageResponse extends Response {
  payload: {
    message: Message;
  };
}

export interface MessageDeliveredResponse extends Response {
  payload: {
    message: MessageDelivered;
  };
}

export interface MessageReadRequest extends Request {
  payload: {
    message: MessageRead;
  };
}

export interface MessageReadResponse extends Response {
  payload: {
    message: MessageIsRead;
  };
}

export interface MessageEditRequest extends Request {
  payload: {
    message: MessageEdit;
  };
}

export interface MessageEditResponse extends Response {
  payload: {
    message: MessageEdited;
  };
}

export interface MessageDeleteRequest extends Request {
  payload: {
    message: MessageDelete;
  };
}

export interface MessageDeleteResponse extends Response {
  payload: {
    message: MessageDeleted;
  };
}
