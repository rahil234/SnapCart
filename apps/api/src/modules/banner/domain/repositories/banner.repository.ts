import { Banner } from '@/modules/banner/domain/entities';

export interface BannerRepository {
  save(banner: Banner): Promise<Banner>;
  update(banner: Banner): Promise<Banner>;
  findById(id: string): Promise<Banner | null>;
  findAll(): Promise<Banner[]>;
  findActive(): Promise<Banner[]>;
  findByOrder(order: number): Promise<Banner | null>;
  delete(id: string): Promise<void>;
  updateOrders(banners: { id: string; order: number }[]): Promise<void>;
  getMaxOrder(): Promise<number>;
}
