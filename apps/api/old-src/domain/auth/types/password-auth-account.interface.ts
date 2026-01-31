import { AuthAccount } from './auth-account.interface';

export interface PasswordAuthAccount extends AuthAccount {
  password: string;
}
