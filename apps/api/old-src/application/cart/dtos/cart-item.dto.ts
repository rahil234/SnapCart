import { ProductDto } from '@/application/product/dtos/product.dto';
import { CartItem } from '@/domain/cart/entities/cart-item.entity';
import { VariantDto } from '@/application/product/dtos/variant/variant.dto';
import { ProductVariant } from '@/domain/product/entities';

export class CartItemDto {
  id: string;
  quantity: number;
  product: Pick<
    ProductDto,
    'id' | 'name' | 'price' | 'discountPrice' | 'discountPercent' | 'thumbnail'
  > & {
    category: Pick<ProductDto['category'], 'id' | 'name'>;
  };
  variant: Pick<ProductVariant, 'id' | 'size' | 'stock' | 'isDeleted'>;

  static fromEntity(
    this: void,
    item: CartItem,
    product: ProductDto,
    variant: Omit<VariantDto, 'id'> & { id: string },
  ): CartItemDto {
    return {
      id: item.id,
      quantity: item.quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        discountPercent: product.discountPercent,
        thumbnail: product.thumbnail,
        category: {
          id: product.category.id,
          name: product.category.name,
        },
      },
      variant: {
        id: variant.id,
        size: variant.size,
        stock: variant.stock,
        isDeleted: false,
      },
    };
  }
}
