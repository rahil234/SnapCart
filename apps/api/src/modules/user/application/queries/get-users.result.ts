import { User } from '@/modules/user/domain/entities';

export class GetUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
