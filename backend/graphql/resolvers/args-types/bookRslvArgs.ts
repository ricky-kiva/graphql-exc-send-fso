export interface AllBooksArgs {
  author?: string,
  genre?: string
}

export interface AddBookArgs {
  title: string;
  author: string;
  published: number;
  genres: string[];
}
