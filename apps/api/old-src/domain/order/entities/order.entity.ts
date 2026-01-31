import { Address } from '@/domain/user/entities/address.entity';

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

export type OrderItem = {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  metadata?: Record<string, unknown> | null;
};

export class Order {
  // core fields
  public readonly id: string;
  public readonly orderNumber: string;
  public readonly userId: string;
  public readonly placedAt: Date;
  public readonly updatedAt: Date;
  public readonly deliveredAt?: Date | null;
  public readonly cancelledAt?: Date | null;

  // financials
  public readonly subtotal: number;
  public readonly shippingCharge: number;
  public readonly tax: number;
  public readonly discount: number;
  public readonly total: number;

  // items & metadata
  public readonly items: OrderItem[];
  public readonly metadata?: Record<string, unknown> | null;

  // payment & order status
  public readonly paymentMethod?: string | null;
  public readonly paymentStatus: PaymentStatus;

  public readonly orderStatus: OrderStatus;

  // address
  public readonly shippingAddress: Pick<
    Address,
    'houseNo' | 'street' | 'city' | 'state' | 'country' | 'pincode'
  >;

  // cancellation/refund
  public readonly cancelReason?: string | null;
  public readonly refundAmount?: number | null;

  public readonly isDeleted: boolean;

  constructor(props: {
    id: string;
    orderNumber: string;
    userId: string;
    placedAt?: Date;
    updatedAt: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;

    subtotal: number;
    shippingCharge?: number;
    tax?: number;
    discount?: number;
    total: number;

    items: OrderItem[];
    metadata?: Record<string, unknown>;

    paymentMethod?: string | null;
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;

    shippingAddress: Pick<
      Address,
      'houseNo' | 'street' | 'city' | 'state' | 'country' | 'pincode'
    >;

    cancelReason?: string | null;
    refundAmount?: number | null;

    isDeleted?: boolean;
  }) {
    this.id = props.id;
    this.orderNumber = props.orderNumber;
    this.userId = props.userId;
    this.placedAt = props.placedAt ?? new Date();
    this.updatedAt = props.updatedAt;
    this.deliveredAt = props.deliveredAt ?? null;
    this.cancelledAt = props.cancelledAt ?? null;

    this.subtotal = props.subtotal;
    this.shippingCharge = props.shippingCharge ?? 0;
    this.tax = props.tax ?? 0;
    this.discount = props.discount ?? 0;
    this.total = props.total;

    this.items = props.items;
    this.metadata = props.metadata ?? {};

    this.paymentMethod = props.paymentMethod ?? null;
    this.paymentStatus = props.paymentStatus ?? 'pending';
    this.orderStatus = props.orderStatus ?? 'pending';

    this.shippingAddress = props.shippingAddress;

    this.cancelReason = props.cancelReason ?? null;
    this.refundAmount = props.refundAmount ?? null;

    this.isDeleted = props.isDeleted ?? false;
  }

  public with(patch: Partial<Order>): Order {
    return new Order({
      id: this.id,
      orderNumber: this.orderNumber,
      userId: this.userId,
      placedAt: this.placedAt,

      updatedAt: patch.updatedAt ?? this.updatedAt ?? new Date(),
      deliveredAt: patch.deliveredAt ?? this.deliveredAt ?? undefined,
      cancelledAt: patch.cancelledAt ?? this.cancelledAt ?? undefined,

      subtotal: this.subtotal,
      shippingCharge: this.shippingCharge,
      tax: this.tax,
      discount: this.discount,
      total: this.total,

      items: this.items,
      metadata: this.metadata ?? {},

      paymentMethod: patch.paymentMethod ?? this.paymentMethod,
      paymentStatus: patch.paymentStatus ?? this.paymentStatus,
      orderStatus: patch.orderStatus ?? this.orderStatus,

      shippingAddress: this.shippingAddress,

      cancelReason: patch.cancelReason ?? this.cancelReason,
      refundAmount: patch.refundAmount ?? this.refundAmount,

      isDeleted: patch.isDeleted ?? this.isDeleted,
    });
  }
}
