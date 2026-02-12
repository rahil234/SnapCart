import { Command } from '@nestjs/cqrs';

import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';

export class GenerateBannerUploadUrlCommand extends Command<UploadDescriptor> {
  constructor(public readonly fileName: string) {
    super();
  }
}
