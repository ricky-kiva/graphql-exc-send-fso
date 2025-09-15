import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from './components/Login';
import { useApolloClient, useSubscription } from '@apollo/client/react';
import Recommendations from './components/Recommendations';
import { BOOK_ADDED } from './graphql/operations/subscriptions/book';
import type { AllBooksData, BookAddedData } from './graphql/types/data/book';
import { ALL_BOOKS } from './graphql/operations/queries/book';
import type { AllAuthorsData } from './graphql/types/data/author';
import { ALL_AUTHORS } from './graphql/operations/queries/author';

const App: React.FC = () => {
  const [page, setPage] = useState<string>("authors");
  const [token, setToken] = useState<string | null>(null);

  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("user-token");
    if (savedToken) setToken(savedToken);
  }, []);

  useSubscription<BookAddedData>(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data?.bookAdded;

      alert(`${addedBook?.title} from ${addedBook?.author.name} added!`);

      client.cache.updateQuery<AllBooksData>(
        { query: ALL_BOOKS, variables: { genre: null } }, 
        (data) => {
          if (!addedBook) return data;
          if (!data) return { allBooks: [addedBook] };

          return { allBooks: data.allBooks.concat(addedBook) };
        }
      );

      client.cache.updateQuery<AllAuthorsData>({ query: ALL_AUTHORS }, (data) => {
          if (!addedBook) return data;
          if (!data) return { allAuthors: [addedBook.author] };

          const isAuthorExists = data.allAuthors.some((a) => a.id === addedBook.author.id);

          if (isAuthorExists) return data;

          return { allAuthors: data.allAuthors.concat(addedBook.author) };
      });
    }
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommend")}>recommend</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <Login show={page === "login"} setToken={setToken} setPage={setPage}/>
      <NewBook show={page === "add"} />
      <Recommendations show={page === "recommend"} />
    </div>
  );
};

export default App;
