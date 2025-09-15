import { authorMutationRslv, authorQueryRslv } from './authorRslv';
import { bookMutationRslv, bookQueryRslv, bookSubscriptionRslv } from './bookRslv';
import { userMutationRslv, userQueryRslv } from './UserRslv';

const dummy = (): number => {
  return Math.floor(Math.random() * 100) + 1;
};

const queryRslv = {
  ...authorQueryRslv,
  ...bookQueryRslv,
  ...userQueryRslv,
  dummy
};

const mutationRslv = {
  ...bookMutationRslv,
  ...authorMutationRslv,
  ...userMutationRslv
};

const subscriptionRslv = {
  ...bookSubscriptionRslv
};

const resolvers = {
  Query: queryRslv,
  Mutation: mutationRslv,
  Subscription: subscriptionRslv,
};

export default resolvers;
