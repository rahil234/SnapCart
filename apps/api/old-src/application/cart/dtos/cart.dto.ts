import { Cart } from '@/domain/cart/entities/cart.entity';
import { CartItemDto } from '@/application/cart/dtos/cart-item.dto';
import { ProductDto } from '@/application/product/dtos/product.dto';

export class CartDto {
  id: string;
  items: Array<CartItemDto>;
  userId: string;

  static fromEntity(this: void, cart: Cart, cartItems: CartItemDto[]): CartDto {
    const items = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: (item.product as ProductDto).description,
        price: item.product.price,
        discountPrice: item.product.discountPrice,
        discountPercent: item.product.discountPercent,
        thumbnail: item.product.thumbnail,
        category: item.product.category,
      },
      variant: {
        id: item.variant.id,
        size: item.variant.size,
        stock: item.variant.stock,
        isDeleted: item.variant.isDeleted,
      },
    }));

    return {
      id: cart.id,
      userId: cart.userId,
      items,
    };
  }
}
