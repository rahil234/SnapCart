import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateVariantCommand } from '../create-variant.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { ProductVariant } from '@/modules/product/domain/entities/product-variant.entity';
import {
  SELLER_IDENTITY_PORT,
  SellerIdentityPort,
} from '@/modules/product/application/ports/seller-identity.port';

@CommandHandler(CreateVariantCommand)
export class CreateVariantHandler implements ICommandHandler<CreateVariantCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(SELLER_IDENTITY_PORT)
    private readonly sellerIdentityPort: SellerIdentityPort,
  ) {}

  async execute(command: CreateVariantCommand): Promise<ProductVariant> {
    const {
      productId,
      variantName,
      price,
      stock,
      userId,
      discountPercent,
      attributes,
    } = command;

    const sellerProfileId =
      await this.sellerIdentityPort.getSellerProfileId(userId);

    // Verify product exists
    const productExists = await this.productRepository.productExists(productId);
    if (!productExists) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Create domain entity using factory method (with business validation)
    const variant = ProductVariant.create(
      productId,
      variantName,
      price,
      stock,
      sellerProfileId,
      discountPercent,
      attributes,
    );

    // Persist the variant
    return this.productRepository.saveVariant(variant);
  }
}
