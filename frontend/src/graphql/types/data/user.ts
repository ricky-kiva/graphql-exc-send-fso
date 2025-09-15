import type { Token } from '../../../types/Token';
import type { User } from '../../../types/User';

export interface LoginData {
  login: Token
}

export interface MeData {
  me: User;
}
