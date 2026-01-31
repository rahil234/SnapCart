import { CartApi, CreateCartDto, UpdateCartDto } from '@/api/generated';
import { apiConfig } from '@/api/client';

const cartApi = new CartApi(apiConfig);

export const CartService = {
  getCart: () => cartApi.cartControllerGetUserCart(),
  addToCart: (dto: CreateCartDto) => cartApi.cartControllerAddToCart(dto),
  updateCart: (itemId: string, dto: UpdateCartDto) =>
    cartApi.cartControllerUpdateQuantity(itemId, dto),
  removeItem: (itemId: string) => cartApi.cartControllerRemoveItem(itemId),
};
