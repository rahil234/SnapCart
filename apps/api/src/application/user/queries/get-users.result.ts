import { User } from '@/domain/user/entities';

export class GetUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
