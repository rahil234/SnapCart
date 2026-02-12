import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../create-product.command';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { Product } from '@/modules/product/domain/entities/product.entity';
import { ProductCreatedEvent } from '@/modules/product/domain/events';
import {
  SELLER_IDENTITY_PORT,
  SellerIdentityPort,
} from '@/modules/product/application/ports/seller-identity.port';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
    @Inject(SELLER_IDENTITY_PORT)
    private readonly sellerIdentity: SellerIdentityPort,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const { name, description, categoryId, brand, userId } = command;

    const sellerProfileId =
      await this.sellerIdentity.getSellerProfileId(userId);

    // Create domain entity using factory method (with business validation)
    const product = Product.create(
      name,
      description,
      categoryId,
      brand,
      sellerProfileId,
    );

    // Persist the product
    const createdProduct = await this.productRepository.saveProduct(product);

    // Emit domain event
    await this.eventBus.publish(
      new ProductCreatedEvent(
        createdProduct.id,
        createdProduct.getName(),
        createdProduct.getCategoryId(),
      ),
    );

    return createdProduct;
  }
}
