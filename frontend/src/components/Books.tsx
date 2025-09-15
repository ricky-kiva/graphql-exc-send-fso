import React, { useState } from "react";
import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS, ALL_GENRES } from '../graphql/operations/queries/book';
import type { AllBooksData, AllGenresData } from '../graphql/types/data/book';
import type { Book } from '../types/Book';

interface BooksProps {
  show: boolean;
}

const Books: React.FC<BooksProps> = (props) => {
  const [selectedGenre, setselectedGenre] = useState<string | null>(null);

  const result = useQuery<AllBooksData>(ALL_BOOKS, {
    skip: !props.show,
    variables: { genre: selectedGenre ?? undefined }
  });

  const genreResult = useQuery<AllGenresData>(ALL_GENRES, {
    skip: !props.show
  });

  if (!props.show) return null;
  if (result.loading) return <div>Loading..</div>;
  if (!result.data) return <div>Failed to fetch Books data</div>;

  const books: Book[] = result.data?.allBooks;
  
  const genres: string[] = genreResult.data
    ? Array.from(new Set(genreResult.data.allBooks.flatMap((b) => b.genres)))
    : [];

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && <p>in genre <b>{selectedGenre}</b></p>}
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
      <div>
        {genres.map((g) => <button key={g} onClick={() => setselectedGenre(g)}>{g}</button>)}
        <button onClick={() => setselectedGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
