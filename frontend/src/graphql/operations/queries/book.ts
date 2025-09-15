import { gql } from '@apollo/client';
import { BOOK_DETAILS } from '../fragments/book';

export const ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const ALL_GENRES = gql`
  query {
    allBooks {
      genres
    }
  }
`;
