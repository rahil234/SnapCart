import { CustomerProfile } from '@/domain/user/entities';

export interface CustomerProfileRepository {
  save(profile: CustomerProfile): Promise<CustomerProfile>;
  update(profile: CustomerProfile): Promise<CustomerProfile>;
  findById(id: string): Promise<CustomerProfile | null>;
  findByUserId(userId: string): Promise<CustomerProfile | null>;
  delete(id: string): Promise<void>;
}
