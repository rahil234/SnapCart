import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVariantCommand } from '../create-variant.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';

@CommandHandler(CreateVariantCommand)
export class CreateVariantHandler implements ICommandHandler<CreateVariantCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateVariantCommand): Promise<ProductVariant> {
    const {
      productId,
      sku,
      variantName,
      price,
      stock,
      sellerProfileId,
      discountPercent,
      attributes,
      imageUrl,
    } = command;

    // Verify product exists
    const productExists = await this.productRepository.productExists(productId);
    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Verify SKU is unique
    const skuExists = await this.productRepository.skuExists(sku);
    if (skuExists) {
      throw new BadRequestException(`SKU "${sku}" already exists`);
    }

    // Create domain entity using factory method (with business validation)
    const variant = ProductVariant.create(
      productId,
      sku,
      variantName,
      price,
      stock,
      sellerProfileId,
      discountPercent,
      attributes,
      imageUrl,
    );

    // Persist the variant
    const createdVariant = await this.productRepository.saveVariant(variant);

    return createdVariant;
  }
}
