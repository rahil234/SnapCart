import { Address } from '@/domain/user/entities/address.entity';

export class User {
  constructor(
    public id: string,
    public name: string | null,
    public email: string | null,
    public phone: string | null,
    public dob: Date | null,
    public gender: 'male' | 'female' | 'other' | null,
    public password: string | null,
    public tryOnLimit: number,
    public address: Address[],
    public status: 'active' | 'suspended',
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
