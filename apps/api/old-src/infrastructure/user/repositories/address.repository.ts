import { Address } from '@/domain/user/entities/address.entity';

export interface IAddressRepository {
  create(
    userId: string,
    data: Partial<Address>,
    isPrimary: boolean,
  ): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  update(id: string, data: Partial<Address>): Promise<Address | null>;
  delete(id: string): Promise<void>;
}
