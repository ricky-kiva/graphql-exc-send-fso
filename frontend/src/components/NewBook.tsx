import { useMutation } from '@apollo/client/react';
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { ADD_BOOK } from '../graphql/operations/mutations/book';
import type { AddBookParam } from '../graphql/types/params/book';
import { ALL_AUTHORS } from '../graphql/operations/queries/author';
import { ALL_BOOKS } from '../graphql/operations/queries/book';
import type { AddBookData, AllBooksData } from '../graphql/types/data/book';
import type { AllAuthorsData } from '../graphql/types/data/author';

interface NewBookProps {
  show: boolean;
}

const NewBook: React.FC<NewBookProps> = (props) => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [published, setPublished] = useState<number>(0);
  const [genre, setGenre] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);

  const [ addBook ] = useMutation<AddBookData, AddBookParam>(ADD_BOOK, {
    update: (cache, res) => {
      const newBook = res.data?.addBook;

      cache.updateQuery<AllBooksData>(
        { query: ALL_BOOKS, variables: { genre: null } }, 
        (cacheData) => {
          if (!newBook) return cacheData;
          if (!cacheData) return { allBooks: [newBook] };
          
          return { allBooks: cacheData.allBooks.concat(newBook) };
        }
      );
      
      cache.updateQuery<AllAuthorsData>({ query: ALL_AUTHORS }, (cacheData) => {
        if (!newBook) return cacheData;
        if (!cacheData) return { allAuthors: [newBook.author] };

        const isAuthorExists = cacheData.allAuthors.some((a) => a.id === newBook.author.id);

        if (isAuthorExists) return cacheData;

        return { allAuthors: cacheData.allAuthors.concat(newBook.author) };
      });
    }
  });

  if (!props.show) return null;

  const validateSubmit = (): boolean => {
    if (!title) {
      alert("Title is required");
      return false;
    }

    if (!author) {
      alert("Author is required");
      return false;
    }

    if (genres.length === 0) {
      alert("At least one genre is required");
      return false;
    }

    return true;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateSubmit()) return;

    try {
      await addBook({
        variables: { title, published, author, genres }
      });

      setTitle("");
      setPublished(0);
      setAuthor("");
      setGenres([]);
      setGenre("");

      alert("Book added successfully!");
    } catch(e: unknown) {
      if (e instanceof Error) {
        alert(`Failed to add book: ${e.message}`);
      }
    }
  };

  const addGenre = () => {
    setGenres([...genres, genre]);
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAuthor(e.target.value)
            }
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setPublished(val === "" ? 0 : Number(val));
            }}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setGenre(e.target.value)
            }
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
