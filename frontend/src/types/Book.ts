import type { Author } from './Author';

export interface Book {
  id: string;
  title: string;
  author: Author;
  published: number;
  genres: string[]
}
