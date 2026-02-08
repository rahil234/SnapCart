import { apiConfig } from '@/api/client';
import { apiClient } from '@/api/axios';
import { CartApi, AddItemToCartDto, UpdateCartItemDto } from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const cartApi = new CartApi(apiConfig, undefined, apiClient);

export const CartService = {
  getCart: () => handleRequest(() => cartApi.cartControllerGetCart()),
  addToCart: (dto: AddItemToCartDto) =>
    handleRequest(() => cartApi.cartControllerAddItem(dto)),
  updateCart: (itemId: string, dto: UpdateCartItemDto) =>
    handleRequest(() => cartApi.cartControllerUpdateItem(itemId, dto)),
  removeItem: (itemId: string) =>
    handleRequest(() => cartApi.cartControllerRemoveItem(itemId)),
};
