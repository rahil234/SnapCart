import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteVariantImageCommand } from '../delete-variant-image.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

/**
 * Delete Variant Image Handler
 *
 * Removes an image from a variant and optionally from Cloudinary
 */
@CommandHandler(DeleteVariantImageCommand)
export class DeleteVariantImageHandler implements ICommandHandler<DeleteVariantImageCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteVariantImageCommand): Promise<void> {
    const { variantId, position } = command;

    // Verify variant exists
    const variant = await this.productRepository.findVariantById(variantId);
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    // Delete from database
    await this.productRepository.deleteVariantImage(variantId, position);

    // TODO: Optionally delete from Cloudinary
    // You might want to add Cloudinary deletion here if needed
  }
}
