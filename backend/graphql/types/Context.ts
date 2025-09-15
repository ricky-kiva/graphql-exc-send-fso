import { UserDocument } from '../../db/schemas/User';

export interface Context {
  currentUser?: UserDocument | null;
};
