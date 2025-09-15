import { gql } from '@apollo/client';
import { BOOK_DETAILS } from '../fragments/book';

export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      ...BookDetails   
    }
  }
  ${BOOK_DETAILS}
`;
