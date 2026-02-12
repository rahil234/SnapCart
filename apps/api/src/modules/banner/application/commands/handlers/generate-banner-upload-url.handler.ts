import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IStorageService } from '@/shared/infrastructure/storage/storage.interface';
import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';
import { GenerateBannerUploadUrlCommand } from '../generate-banner-upload-url.command';

@CommandHandler(GenerateBannerUploadUrlCommand)
export class GenerateBannerUploadUrlHandler
  implements ICommandHandler<GenerateBannerUploadUrlCommand>
{
  constructor(
    @Inject('STORAGE_SERVICE')
    private readonly storageService: IStorageService,
  ) {}

  async execute(command: GenerateBannerUploadUrlCommand): Promise<UploadDescriptor> {
    const { fileName } = command;

    const timestamp = Date.now();
    const blobName = `banners/${timestamp}-${fileName}`;

    return this.storageService.generatePresignedUpload(blobName);
  }
}
