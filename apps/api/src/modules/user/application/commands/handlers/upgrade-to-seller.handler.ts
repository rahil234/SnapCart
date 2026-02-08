import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';

import { User } from '@/modules/user/domain/entities/user.entity';
import { UpgradeToSellerCommand } from '../upgrade-to-seller.command';
import { SellerProfileCreatedEvent } from '@/shared/events/user.events';
import { UserRepository } from '@/modules/user/domain/repositories/user.repository';

@CommandHandler(UpgradeToSellerCommand)
export class UpgradeToSellerHandler implements ICommandHandler<UpgradeToSellerCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpgradeToSellerCommand): Promise<User> {
    const { userId, storeName, gstNumber } = command;

    // Load user aggregate
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Business rule validation happens in aggregate root
    try {
      const sellerProfile = user.upgradeToSeller(storeName, gstNumber || null);

      // Persist aggregate with new seller profile
      const updatedUser = await this.userRepository.update(user);

      // Emit domain event
      await this.eventBus.publish(
        new SellerProfileCreatedEvent(
          sellerProfile.getId(),
          user.id,
          storeName,
        ),
      );

      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
