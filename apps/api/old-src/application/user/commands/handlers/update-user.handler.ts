import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { UpdateUserCommand } from '../update-user.command';
import { UserDto } from '../../dtos/user.dto';
import { MediaService } from '@/domain/media/services/media.service';
import type { IUserRepository } from '@/infrastructure/user/repositories/user.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UserDto> {
    const { userId, ...updateData } = command;

    const doc = await this.userRepository.update(userId, updateData);

    if (!doc) {
      throw new BadRequestException('User update failed. User not found');
    }

    const tryOnImage = await this.mediaService.getUserTryOnReadUrl(userId);

    return new UserDto(doc, tryOnImage);
  }
}
