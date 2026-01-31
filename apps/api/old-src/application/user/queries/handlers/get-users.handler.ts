import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUsersQuery } from '../get-users.query';
import { UserDto } from '../../dtos/user.dto';
import { MediaService } from '@/domain/media/services/media.service';
import type { IUserRepository } from '@/infrastructure/user/repositories/user.repository';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<{ total: number; data: UserDto[] }> {
    const { page = 1, limit = 10, search, status } = query;

    const queryParams = { page, limit, search, status };
    const users = await this.userRepository.find(queryParams);
    const userDtos = users.length ? users.map((u) => new UserDto(u)) : [];
    const total = await this.userRepository.count();

    return {
      total,
      data: userDtos,
    };
  }
}
