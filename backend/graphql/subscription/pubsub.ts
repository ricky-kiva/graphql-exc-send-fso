import { PubSub } from 'graphql-subscriptions';
import { PubSubEvents } from './types/PubSubEvents';

export const pubsub = new PubSub<PubSubEvents>();
