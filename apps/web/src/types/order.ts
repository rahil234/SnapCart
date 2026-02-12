export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'canceled'
  | 'return_requested'
  | 'return_approved'
  | 'return_rejected'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  totalPrice: number;
  attributes: object;
  imageUrl: string | null;
}

export interface CustomerInfo {
  customerId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: CustomerInfo;
  items: Array<OrderItem>;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  offerDiscount: number;
  shippingCharge: number;
  tax: number;
  total: number;
  appliedCouponCode: string | null;
  appliedOfferIds: Array<string>;
  shippingAddress: any;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  metadata: object;
  cancelReason: string | null;
  refundAmount: number | null;
  placedAt: string;
  deliveredAt: string | null;
  cancelledAt: string | null;
  updatedAt: string;
}
