import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '@/modules/user/domain/repositories';
import { IStorageService } from '@/shared/infrastructure/storage/storage.interface';
import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';
import { GenerateProfilePictureUploadUrlCommand } from '@/modules/user/application/commands';

/**
 * Generate Profile Picture Upload URL Handler
 *
 * Generates presigned upload credentials for client-side profile picture upload.
 * The client will use these credentials to upload directly to storage (Cloudinary/Azure),
 * then confirm the upload via SaveProfilePictureCommand.
 */
@CommandHandler(GenerateProfilePictureUploadUrlCommand)
export class GenerateProfilePictureUploadUrlHandler implements ICommandHandler<GenerateProfilePictureUploadUrlCommand> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('STORAGE_SERVICE')
    private readonly storageService: IStorageService,
  ) {}

  async execute(
    command: GenerateProfilePictureUploadUrlCommand,
  ): Promise<UploadDescriptor> {
    const { userId, fileName } = command;

    // Verify user exists and has customer profile
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.hasCustomerProfile()) {
      throw new NotFoundException('Customer profile not found');
    }

    // Generate unique blob name for profile picture
    const blobName = `profile-pictures/${userId}/${fileName}`;

    // Generate presigned upload credentials
    const uploadDescriptor =
      this.storageService.generatePresignedUpload(blobName);

    return uploadDescriptor;
  }
}
