import { User } from '@/domain/user/entities/user.entity';
import { UserPaginatedQueryDto } from '@/application/user/dtos/request/user-paginated-query.dto';

export interface IUserRepository {
  create(data: {
    email: string | undefined;
    phone: string | undefined;
  }): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  find(query: UserPaginatedQueryDto): Promise<User[]>;
  update(
    id: string,
    data: Partial<Omit<User, 'id' | 'updatedAt' | 'createdAt'>>,
  ): Promise<User | null>;
  count(): Promise<number>;
}
