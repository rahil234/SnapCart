import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserByEmailQuery } from '../get-user-by-email.query';
import { UserDto } from '../../dtos/user.dto';
import { MediaService } from '@/domain/media/services/media.service';
import type { IUserRepository } from '@/infrastructure/user/repositories/user.repository';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<UserDto | null> {
    const user = await this.userRepository.findByEmail(query.email);
    if (!user) return null;
    return new UserDto(user);
  }
}
