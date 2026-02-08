import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';

import { ProductUpdatedEvent } from '@/modules/product/domain/events';
import { UpdateProductCommand } from '@/modules/product/application/commands';
import { ProductStatus } from '@/modules/product/domain/entities/product.entity';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import {
  ProductPolicy,
  ProductUpdateIntent,
} from '@/modules/product/domain/policies';
import {
  SELLER_IDENTITY_PORT,
  SellerIdentityPort,
} from '@/modules/product/application/ports/seller-identity.port';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly productPolicy: ProductPolicy,
    private readonly eventBus: EventBus,
    @Inject(SELLER_IDENTITY_PORT)
    private readonly sellerIdentityPort: SellerIdentityPort,
  ) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const {
      productId,
      intent,
      userId,
      name,
      description,
      brand,
      categoryId,
      status,
    } = command;

    const sellerProfileId =
      await this.sellerIdentityPort.getSellerProfileId(userId);

    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Enforce authorization based on intent
    if (intent === ProductUpdateIntent.SELLER_UPDATE) {
      // Seller update - check ownership
      const variants =
        await this.productRepository.findVariantsByProductId(productId);

      this.productPolicy.enforceSellerUpdate(
        sellerProfileId,
        product,
        variants,
      );

      // Seller can only update identity fields (not status)
      if (status !== undefined) {
        throw new Error(
          'Sellers cannot directly change product status. Use activate/deactivate endpoints.',
        );
      }
    } else if (intent === ProductUpdateIntent.ADMIN_STATUS_UPDATE) {
      // Admin update - can only change status
      this.productPolicy.enforceAdminStatusUpdate(product);

      if (
        name !== undefined ||
        description !== undefined ||
        brand !== undefined ||
        categoryId !== undefined
      ) {
        throw new Error(
          'Admins can only update product status, not identity fields',
        );
      }
    }

    // Update identity information (seller only)
    if (
      name !== undefined ||
      description !== undefined ||
      brand !== undefined
    ) {
      product.updateInfo(
        name ?? product.getName(),
        description ?? product.getDescription(),
        brand !== undefined ? brand : product.getBrand(),
      );
    }

    // Change category (seller only, with business rules)
    if (categoryId !== undefined && categoryId !== product.getCategoryId()) {
      product.changeCategory(categoryId);
    }

    // Update status (admin only)
    if (status !== undefined && status !== product.getStatus()) {
      switch (status) {
        case ProductStatus.ACTIVE:
          product.activate();
          break;
        case ProductStatus.INACTIVE:
          product.deactivate();
          break;
        case ProductStatus.DISCONTINUED:
          product.discontinue();
          break;
      }
    }

    // Persist aggregate
    await this.productRepository.updateProduct(product);

    // Emit event
    await this.eventBus.publish(
      new ProductUpdatedEvent(product.id, {
        name,
        description,
        brand,
        categoryId,
        status,
      }),
    );
  }
}
