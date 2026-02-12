import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IStorageService } from '@/shared/infrastructure/storage/storage.interface';
import { UploadDescriptor } from '@/shared/infrastructure/storage/upload-descriptor';
import { GeneratePresignedImageUploadCommand } from '@/modules/product/application/commands';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

/**
 * Generate Presigned Image Upload Handler
 *
 * Generates Cloudinary-compatible presigned credentials for client-side upload.
 * The client will use these credentials to upload directly to Cloudinary,
 * then confirm the upload via SaveVariantImageCommand.
 */
@CommandHandler(GeneratePresignedImageUploadCommand)
export class GeneratePresignedImageUploadHandler implements ICommandHandler<GeneratePresignedImageUploadCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,

    @Inject('STORAGE_SERVICE')
    private readonly cloudinaryService: IStorageService,
  ) {}

  async execute(
    command: GeneratePresignedImageUploadCommand,
  ): Promise<UploadDescriptor> {
    const { variantId, fileName } = command;

    // Verify variant exists
    const variantExists = await this.productRepository.variantExists(variantId);
    if (!variantExists) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    // Generate unique blob name for Cloudinary
    const timestamp = Date.now();
    const blobName = `variants/${variantId}/${timestamp}-${fileName}`;

    // Generate presigned upload URL (Cloudinary-specific format)
    return this.cloudinaryService.generatePresignedUpload(blobName);
  }
}
