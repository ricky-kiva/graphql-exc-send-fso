import { useMutation, useQuery } from '@apollo/client/react';
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { ALL_AUTHORS } from '../graphql/operations/queries/author';
import type { AllAuthorsData } from '../graphql/types/data/author';
import type { Author } from '../types/Author';
import type { EditAuthorParam } from '../graphql/types/params/author';
import { EDIT_AUTHOR } from '../graphql/operations/mutations/author';

interface AuthorsProps {
  show: boolean;
  token: (string | null);
}

interface SetAuthorBornProps {
  authors: Author[];
} 

const Authors: React.FC<AuthorsProps> = (props) => {
  const result = useQuery<AllAuthorsData>(ALL_AUTHORS, {
    skip: !props.show
  });

  if (!props.show) return null;

  if (result.loading) {
    return <div>Loading..</div>;
  }

  if (!result.data) {
    return <div>Failed to fetch Authors data</div>;
  }

  const authors: Author[] = result.data?.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token && <SetAuthorBorn authors={authors} />}
    </div>
  );
};

const SetAuthorBorn: React.FC<SetAuthorBornProps> = (props) => {
  const [name, setName] = useState<string>("");
  const [born, setBorn] = useState<number>(0);

  const [ editAuthor ] = useMutation<Author, EditAuthorParam>(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  });

  const validateSubmit = (): boolean => {
    if (!name) {
      alert("Name is required");
      return false;
    }

    if (!born) {
      alert("Birth Year is required");
      return false;
    }

    return true;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      if (!validateSubmit()) return;
  
      try {
        editAuthor({
          variables: { name, born }
        });
  
        setName("");
        setBorn(0);
  
        alert("Author updated successfully!");
      } catch(e: unknown) {
        if (e instanceof Error) {
          alert(`Failed to update author: ${e.message}`);
        }
      }
    };

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <select
          value={name}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setName(e.target.value)}
          >
            <option value="">-- Select an author --</option>
            {props.authors.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          published
          <input
            type="number"
            value={born}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) setBorn(val === "" ? 0 : Number(val));
            }}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
