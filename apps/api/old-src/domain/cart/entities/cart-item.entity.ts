export class CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CartItem>) {
    Object.assign(this, partial);
  }
}
