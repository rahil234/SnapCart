import { User } from '@/modules/user/domain/entities';

export interface UserRepository {
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findAll(
    skip?: number,
    take?: number,
    search?: string,
    status?: string,
  ): Promise<{ users: User[]; total: number }>;
  delete(id: string): Promise<void>;
}
