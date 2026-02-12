import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { SaveProfilePictureCommand } from '../save-profile-picture.command';
import { UserRepository } from '@/modules/user/domain/repositories';
import { ProfilePictureUpdatedEvent } from '@/shared/events/user.events';

/**
 * Save Profile Picture Handler
 *
 * Saves the profile picture URL to the customer's profile after successful upload.
 * This is called after the client successfully uploads to storage.
 */
@CommandHandler(SaveProfilePictureCommand)
export class SaveProfilePictureHandler
  implements ICommandHandler<SaveProfilePictureCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SaveProfilePictureCommand): Promise<void> {
    const { userId, url } = command;

    // Find user
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify user has customer profile
    if (!user.hasCustomerProfile()) {
      throw new NotFoundException('Customer profile not found');
    }

    // Update profile picture through the aggregate root
    user.updateCustomerProfile(undefined, undefined, undefined);

    // Get customer profile and update profile picture
    const customerProfile = user.getCustomerProfile();
    if (customerProfile) {
      customerProfile.updateProfilePicture(url);
    }

    // Save user
    await this.userRepository.update(user);

    // Emit event for audit/notification purposes
    await this.eventBus.publish(
      new ProfilePictureUpdatedEvent(userId, url),
    );
  }
}
