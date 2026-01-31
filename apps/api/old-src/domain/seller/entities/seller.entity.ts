import { AccountStatus } from '@/domain/auth/types';

export class Seller {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public status: AccountStatusType,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
