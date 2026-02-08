import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SaveVariantImageCommand } from '../save-variant-image.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

/**
 * Save Variant Image Handler
 *
 * Persists image URL after successful Cloudinary upload.
 * Images are stored as URLs in the VariantImage table.
 */
@CommandHandler(SaveVariantImageCommand)
export class SaveVariantImageHandler
  implements ICommandHandler<SaveVariantImageCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: SaveVariantImageCommand): Promise<{ url: string }> {
    const { variantId, publicId, url } = command;

    // Verify variant exists
    const variant = await this.productRepository.findVariantById(variantId);
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    // Check if variant can accept more images (max 6)
    if (!variant.canAddImage()) {
      throw new BadRequestException(
        'Variant has reached maximum of 6 images',
      );
    }

    // Save image to database via repository
    await this.productRepository.saveVariantImage(variantId, publicId, url);

    return { url };
  }
}
