import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/prisma/prisma.service';
import {
  CartItemWithDetailsResponseDto,
  CartWithDetailsResponseDto,
  ProductVariantDetailDto,
} from '@/modules/cart/interfaces/http/dto/response/cart-with-details-response.dto';
import { CartReadRepository } from '@/modules/cart/domain/repositories/cart-read.repository';

@Injectable()
export class PrismaCartReadRepository implements CartReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCustomerIdWithDetails(
    customerId: string,
  ): Promise<CartWithDetailsResponseDto | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            ProductVariant: {
              include: {
                product: true,
                images: {
                  where: { position: 1 },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    const items: CartItemWithDetailsResponseDto[] = cart.items.map((item) => {
      const variant = item.ProductVariant;
      const product = variant.product;
      const finalPrice =
        variant.discountPercent && variant.discountPercent > 0
          ? variant.price - (variant.price * variant.discountPercent) / 100
          : variant.price;

      const variantDetail: ProductVariantDetailDto = {
        id: variant.id,
        variantName: variant.variantName,
        price: variant.price,
        discountPercent: variant.discountPercent || 0,
        finalPrice: finalPrice,
        stock: variant.stock,
        status: variant.status,
        productId: product.id,
        productName: product.name,
        productDescription: product.description,
        productBrand: product.brand,
        imageUrl: variant.images[0]?.url,
      };

      return {
        id: item.id,
        cartId: item.cartId,
        productVariantId: item.variantId,
        quantity: item.quantity,
        variant: variantDetail,
        subtotal: finalPrice * item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      customerId: cart.customerId,
      items,
      totalItems,
      uniqueItemsCount: items.length,
      totalAmount,
      isEmpty: items.length === 0,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}
