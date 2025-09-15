import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { HttpLink } from '@apollo/client';
import { ApolloLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import type { SplitQuery } from './graphql/types/apollo/apollo';

const authLink = new SetContextLink(() => {
  const token = localStorage.getItem("user-token");
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000"
});

const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:4000' })
);

const splitLink = ApolloLink.split(
  ({ query }: SplitQuery) => {
    const def = getMainDefinition(query);
    return (def.kind === 'OperationDefinition' && def.operation === 'subscription');
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
