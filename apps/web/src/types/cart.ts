export interface CartItem {
  id: string;
  cartId: string;
  quantity: number;
  variant: {
    id: string;
    variantName: string;
    productName: string;
    price: number;
    imageUrl: string;
  };
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  totalPrice: number;
}
