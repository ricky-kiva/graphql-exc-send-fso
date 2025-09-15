import { BookWithAuthor } from '../../../db/types/populated';

export type PubSubEvents = {
  BOOK_ADDED: {
    bookAdded: BookWithAuthor
  }
};
