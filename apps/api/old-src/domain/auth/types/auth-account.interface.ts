export type AccountStatus = 'active' | 'suspended';

export interface AuthAccount {
  id: string;
  email?: string;
  phone?: string;
  password?: string;
  status: AccountStatus;
}
