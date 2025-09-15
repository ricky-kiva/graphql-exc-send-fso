import { AuthorDocument } from '../schemas/Author';
import { BookDocument } from '../schemas/Book';

export interface BookWithAuthor extends Omit<BookDocument, 'author'> {
  author: AuthorDocument & { bookCount: number };
}
