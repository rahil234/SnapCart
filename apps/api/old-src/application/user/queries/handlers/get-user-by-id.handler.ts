import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Inject } from '@nestjs/common';
import { GetUserByIdQuery } from '../get-user-by-id.query';
import { UserDto } from '../../dtos/user.dto';
import { MediaService } from '@/domain/media/services/media.service';
import type { IUserRepository } from '@/infrastructure/user/repositories/user.repository';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<UserDto> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tryOnImage = await this.mediaService.getUserTryOnReadUrl(query.userId);

    return new UserDto(user, tryOnImage);
  }
}
