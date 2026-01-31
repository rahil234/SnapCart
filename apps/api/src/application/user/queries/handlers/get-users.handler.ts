import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUsersQuery, GetUsersResult } from '@/application/user/queries';
import { UserRepository } from '@/domain/user/repositories/user.repository';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<GetUsersResult> {
    const { page, limit, search, status } = query;

    const skip = (page - 1) * limit;

    const { users, total } = await this.userRepository.findAll(
      skip,
      limit,
      search,
      status,
    );

    const hasNextPage = page * limit < total;
    const hasPrevPage = page > 1;

    return {
      users,
      total,
      page,
      limit,
      hasNextPage,
      hasPrevPage,
    };
  }
}
