import { SellerProfile } from '@/domain/user/entities';

export interface SellerProfileRepository {
  save(profile: SellerProfile): Promise<SellerProfile>;
  update(profile: SellerProfile): Promise<SellerProfile>;
  findById(id: string): Promise<SellerProfile | null>;
  findByUserId(userId: string): Promise<SellerProfile | null>;
  delete(id: string): Promise<void>;
}
