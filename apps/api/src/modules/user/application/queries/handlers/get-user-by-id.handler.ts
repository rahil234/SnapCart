import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { User } from '@/modules/user/domain/entities';
import { GetUserByIdQuery } from '@/modules/user/application/queries';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
