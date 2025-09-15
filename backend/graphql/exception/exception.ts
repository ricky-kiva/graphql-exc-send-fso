import { GraphQLError } from 'graphql';

export function throwBadUserInput(message: string): never {
  throw new GraphQLError(message, {
    extensions: {
      code: "BAD_USER_INPUT"
    }
  });
}
