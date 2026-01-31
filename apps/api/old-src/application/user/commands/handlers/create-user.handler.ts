import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { CreateUserCommand } from '../create-user.command';
import { UserDto } from '../../dtos/user.dto';
import { MediaService } from '@/domain/media/services/media.service';
import type { IUserRepository } from '@/infrastructure/user/repositories/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserDto> {
    const { email, phone } = command;

    if (!email && !phone) {
      throw new BadRequestException('Either email or phone is required');
    }

    const user = await this.userRepository.create({
      email,
      phone,
    });

    return new UserDto(user);
  }
}
