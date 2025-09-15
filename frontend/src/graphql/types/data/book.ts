import type { Book } from '../../../types/Book';

export interface AllBooksData {
  allBooks: Book[];
}

export interface AllGenresData {
  allBooks: GenresBookData[];
}

export interface AddBookData {
  addBook: Book;
}

export interface BookAddedData {
  bookAdded: Book;
}

interface GenresBookData {
  genres: string[];
}
