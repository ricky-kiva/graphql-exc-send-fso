import React from "react";
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS } from '../graphql/operations/queries/book';
import type { AllBooksData } from '../graphql/types/data/book';
import type { Book } from '../types/Book';
import type { MeData } from '../graphql/types/data/user';
import { ME } from '../graphql/operations/queries/user';

interface RecommendationsProps {
  show: boolean;
}

const Recommendations: React.FC<RecommendationsProps> = (props) => {
  const meResult = useQuery<MeData>(ME, { skip: !props.show });

  const favGenre = meResult.data?.me.favoriteGenre;

  const result = useQuery<AllBooksData>(ALL_BOOKS, {
    skip: !props.show || !favGenre,
    variables: { genre: favGenre }
  });

  if (!props.show) return null;
  if (result.loading || meResult.loading) return <div>Loading..</div>;
  if (!result.data) return <div>Failed to fetch Books data</div>;

  const books: Book[] = result.data?.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      {<p>books in your favorite genre <b>patterns</b></p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
