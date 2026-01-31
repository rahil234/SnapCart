import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductStatus } from '@/domain/product/entities/product.entity';
import { ProductRepository } from '@/domain/product/repositories/product.repository';
import {
  ProductPriceChangedEvent,
  ProductUpdatedEvent,
} from '@/domain/product/events/product.events';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Find a product by ID
   * @param id - Product ID
   * @returns Product or null if not found
   */
  async findById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  /**
   * Find a product by ID or throw NotFoundException
   * @param id - Product ID
   * @returns Product
   * @throws NotFoundException if product not found
   */
  async findByIdOrFail(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Check if a product exists
   * @param id - Product ID
   * @returns true if product exists
   */
  async exists(id: string): Promise<boolean> {
    return await this.productRepository.existsById(id);
  }

  /**
   * Find products by category
   * @param categoryId - Category ID
   * @returns Array of products
   */
  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.productRepository.findByCategory(categoryId);
  }

  /**
   * Calculate bulk discount for multiple products
   * Domain logic for quantity-based discounts
   * @param totalQuantity - Total quantity of items
   * @returns Discount percentage
   */
  calculateBulkDiscount(totalQuantity: number): number {
    if (totalQuantity >= 100) return 15;
    if (totalQuantity >= 50) return 10;
    if (totalQuantity >= 20) return 5;
    if (totalQuantity >= 10) return 2;
    return 0;
  }

  /**
   * Calculate total price with discounts for multiple products
   * @param products - Array of products with quantities
   * @returns Total price after discounts
   */
  calculateTotalPrice(
    products: Array<{ product: Product; quantity: number }>,
  ): number {
    const subtotal = products.reduce((total, { product, quantity }) => {
      return total + product.getFinalPrice() * quantity;
    }, 0);

    const totalQuantity = products.reduce(
      (sum, { quantity }) => sum + quantity,
      0,
    );
    const bulkDiscount = this.calculateBulkDiscount(totalQuantity);

    return subtotal * (1 - bulkDiscount / 100);
  }

  /**
   * Check if a product is available for purchase
   * @param product - Product entity
   * @returns true if available
   */
  isAvailableForPurchase(product: Product): boolean {
    return product.isActive();
  }

  /**
   * Validate product for order creation
   * @param product - Product entity
   * @throws Error if product cannot be ordered
   */
  validateForOrder(product: Product): void {
    if (!product.isActive()) {
      throw new Error(
        `Product "${product.getName()}" is not available for purchase`,
      );
    }

    if (product.getStatus() === ProductStatus.DISCONTINUED) {
      throw new Error(
        `Product "${product.getName()}" has been discontinued`,
      );
    }

    if (product.getStatus() === ProductStatus.OUT_OF_STOCK) {
      throw new Error(`Product "${product.getName()}" is out of stock`);
    }
  }

  /**
   * Apply seasonal discount to products
   * Business rule for seasonal promotions
   * @param productIds - Array of product IDs
   * @param seasonalDiscountPercent - Discount percentage
   */
  async applySeasonalDiscount(
    productIds: string[],
    seasonalDiscountPercent: number,
  ): Promise<void> {
    if (seasonalDiscountPercent < 0 || seasonalDiscountPercent > 100) {
      throw new Error('Discount percent must be between 0 and 100');
    }

    for (const productId of productIds) {
      const product = await this.findByIdOrFail(productId);
      const oldPrice = product.getPrice();

      product.applyDiscount(seasonalDiscountPercent);

      await this.productRepository.update(productId, {
        discountPercent: seasonalDiscountPercent,
      });

      // Emit domain event
      this.eventBus.publish(
        new ProductPriceChangedEvent(
          productId,
          oldPrice,
          product.getFinalPrice(),
        ),
      );

      this.eventBus.publish(
        new ProductUpdatedEvent(productId, {
          discountPercent: seasonalDiscountPercent,
        }),
      );
    }
  }

  /**
   * Remove products that are discontinued and inactive for a long time
   * Business rule for cleanup
   * @param daysSinceUpdate - Number of days since last update
   */
  async cleanupDiscontinuedProducts(daysSinceUpdate: number = 365): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceUpdate);

    // This would typically query products that are discontinued and old
    // For now, this is a placeholder for the business logic
    // The actual implementation would be in a command handler
  }

  /**
   * Check if a product can be tried on (AR/Virtual Try-on feature)
   * @param product - Product entity
   * @returns true if try-on is enabled
   */
  canTryOn(product: Product): boolean {
    return product.isTryOnEnabled() && product.isActive();
  }

  /**
   * Calculate profit margin
   * Business logic for analytics
   * @param sellingPrice - Selling price
   * @param costPrice - Cost price
   * @returns Profit margin percentage
   */
  calculateProfitMargin(sellingPrice: number, costPrice: number): number {
    if (costPrice <= 0) {
      throw new Error('Cost price must be greater than 0');
    }
    return ((sellingPrice - costPrice) / costPrice) * 100;
  }

  /**
   * Determine if a product should be marked as out of stock
   * This is domain logic that can be used by inventory management
   * @param stockLevel - Current stock level
   * @param threshold - Minimum threshold
   * @returns true if should be marked as out of stock
   */
  shouldMarkOutOfStock(stockLevel: number, threshold: number = 0): boolean {
    return stockLevel <= threshold;
  }

  /**
   * Check if a product is eligible for promotion
   * Business rule for marketing campaigns
   * @param product - Product entity
   * @param minimumPrice - Minimum price for promotion
   * @returns true if eligible
   */
  isEligibleForPromotion(product: Product, minimumPrice: number = 100): boolean {
    return (
      product.isActive() &&
      product.getPrice() >= minimumPrice &&
      !product.hasDiscount()
    );
  }
}
