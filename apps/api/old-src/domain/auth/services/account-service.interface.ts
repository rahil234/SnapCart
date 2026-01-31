import { AuthMethod } from '@/domain/auth/enums';
import { AuthAccount } from '@/domain/auth/types';

export interface IAccountService {
  create(data: {
    email?: string;
    name?: string;
    phone?: string;
    authMethod: AuthMethod;
    password?: string;
  }): Promise<AuthAccount>;
  findByEmail(email: string): Promise<AuthAccount | null>;
  findById(id: string): Promise<AuthAccount>;
}
