import { Command } from '@nestjs/cqrs';
import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';

/**
 * Generate Presigned Image Upload Command
 *
 * Generates Cloudinary presigned credentials for client-side image upload
 */
export class GeneratePresignedImageUploadCommand extends Command<UploadDescriptor> {
  constructor(
    public readonly variantId: string,
    public readonly fileName: string = 'variant-image',
  ) {
    super();
  }
}
