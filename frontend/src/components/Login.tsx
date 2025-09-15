import { useMutation } from '@apollo/client/react';
import React, { useState, type ChangeEvent, type Dispatch, type FormEvent } from "react";
import type { LoginParam } from '../graphql/types/params/user';
import { LOGIN } from '../graphql/operations/mutations/user';
import type { LoginData } from '../graphql/types/data/user';

interface LoginProps {
  show: boolean;
  setToken: Dispatch<React.SetStateAction<string | null>>;
  setPage: Dispatch<React.SetStateAction<string>>;
}

const Login: React.FC<LoginProps> = (props) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [ login ] = useMutation<LoginData, LoginParam>(LOGIN);

  if (!props.show) return null;

  const validateSubmit = (): boolean => {
    if (!username) {
      alert("Username is required");
      return false;
    }

    if (!password) {
      alert("Password is required");
      return false;
    }

    return true;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateSubmit()) return;

    try {
      const result = await login({
        variables: { username, password }
      });

      setUsername("");
      setPassword("");

      if (result.data) {
        const token = result.data.login.value;

        props.setToken(token);

        localStorage.setItem('user-token', token);

        props.setPage("authors");
      }
    } catch(e: unknown) {
      if (e instanceof Error) {
        alert(`Failed to login: ${e.message}`);
      }
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
        </div>
        <div>
          password
          <input
            value={password}
            type="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
