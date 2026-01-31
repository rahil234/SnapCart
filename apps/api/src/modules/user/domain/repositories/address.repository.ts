import { Address } from '@/modules/user/domain/entities';

export interface AddressRepository {
  save(address: Address): Promise<Address>;
  update(address: Address): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findByUserId(userId: string): Promise<Address[]>;
  delete(id: string): Promise<void>;
}
