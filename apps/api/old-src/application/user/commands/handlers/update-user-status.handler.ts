import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { UpdateUserStatusCommand } from '../update-user-status.command';
import { UserDto } from '../../dtos/user.dto';
import { MediaService } from '@/domain/media/services/media.service';
import type { IUserRepository } from '@/infrastructure/user/repositories/user.repository';

@CommandHandler(UpdateUserStatusCommand)
export class UpdateUserStatusHandler implements ICommandHandler<UpdateUserStatusCommand> {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserStatusCommand): Promise<UserDto> {
    const { userId, status } = command;

    const doc = await this.userRepository.update(userId, { status });

    if (!doc) {
      throw new BadRequestException('User status update failed. User not found');
    }

    return new UserDto(doc);
  }
}
