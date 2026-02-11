import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Order } from '@/modules/order/domain/entities';
import { OrderStatus, PaymentStatus } from '@/modules/order/domain/enums';
import { CustomerInfo, OrderItem } from '@/modules/order/domain/value-objects';

export class CustomerInfoResponseDto {
  @ApiProperty({ description: 'Customer profile ID' })
  customerId: string;

  @ApiPropertyOptional({
    description: 'Customer name',
    type: String,
    nullable: true,
  })
  customerName: string | null;

  @ApiPropertyOptional({
    description: 'Customer email',
    type: String,
    nullable: true,
  })
  customerEmail: string | null;

  @ApiPropertyOptional({
    description: 'Customer phone',
    type: String,
    nullable: true,
  })
  customerPhone: string | null;

  static fromDomain(customerInfo: CustomerInfo): CustomerInfoResponseDto {
    return {
      customerId: customerInfo.customerId,
      customerName: customerInfo.customerName,
      customerEmail: customerInfo.customerEmail,
      customerPhone: customerInfo.customerPhone,
    };
  }
}

export class OrderItemResponseDto {
  @ApiProperty({ description: 'Product ID' })
  productId: string;

  @ApiProperty({ description: 'Product name' })
  productName: string;

  @ApiProperty({ description: 'Variant ID' })
  variantId: string;

  @ApiProperty({ description: 'Variant name' })
  variantName: string;

  @ApiProperty({ description: 'Quantity ordered' })
  quantity: number;

  @ApiProperty({ description: 'Base price per item' })
  basePrice: number;

  @ApiProperty({ description: 'Discount percentage applied' })
  discountPercent: number;

  @ApiProperty({ description: 'Final price per item after discount' })
  finalPrice: number;

  @ApiProperty({ description: 'Total price for this item' })
  totalPrice: number;

  @ApiProperty({ description: 'Product variant attributes' })
  attributes: any;

  @ApiProperty({
    description: 'Product image URL',
    nullable: true,
    type: String,
  })
  imageUrl: string | null;

  static fromDomain(orderItem: OrderItem): OrderItemResponseDto {
    return {
      productId: orderItem.productId,
      productName: orderItem.productName,
      variantId: orderItem.variantId,
      variantName: orderItem.variantName,
      quantity: orderItem.quantity,
      basePrice: orderItem.basePrice,
      discountPercent: orderItem.discountPercent,
      finalPrice: orderItem.finalPrice,
      totalPrice: orderItem.getTotalPrice(),
      attributes: orderItem.attributes,
      imageUrl: orderItem.imageUrl,
    };
  }
}

export class OrderResponseDto {
  @ApiProperty({ description: 'Order ID' })
  id: string;

  @ApiProperty({ description: 'Order number' })
  orderNumber: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiPropertyOptional({
    description: 'Customer information',
    type: CustomerInfoResponseDto,
  })
  customer?: CustomerInfoResponseDto;

  @ApiProperty({
    description: 'Order items',
    type: [OrderItemResponseDto],
  })
  items: OrderItemResponseDto[];

  @ApiProperty({ description: 'Subtotal amount' })
  subtotal: number;

  @ApiProperty({ description: 'Discount amount' })
  discount: number;

  @ApiProperty({ description: 'Coupon discount amount' })
  couponDiscount: number;

  @ApiProperty({ description: 'Offer discount amount' })
  offerDiscount: number;

  @ApiProperty({ description: 'Shipping charge' })
  shippingCharge: number;

  @ApiProperty({ description: 'Tax amount' })
  tax: number;

  @ApiProperty({ description: 'Total amount' })
  total: number;

  @ApiProperty({
    description: 'Applied coupon code',
    nullable: true,
    type: String,
  })
  appliedCouponCode: string | null;

  @ApiProperty({ description: 'Applied offer IDs' })
  appliedOfferIds: string[];

  @ApiProperty({ description: 'Shipping address JSON' })
  shippingAddress: any;

  @ApiProperty({ description: 'Payment method', nullable: true, type: String })
  paymentMethod: string | null;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    description: 'Order status',
    enum: OrderStatus,
  })
  orderStatus: OrderStatus;

  @ApiProperty({ description: 'Order metadata' })
  metadata: any;

  @ApiProperty({ description: 'Cancel reason', nullable: true, type: String })
  cancelReason: string | null;

  @ApiProperty({ description: 'Refund amount', nullable: true, type: Number })
  refundAmount: number | null;

  @ApiProperty({ description: 'Order placed date' })
  placedAt: Date;

  @ApiProperty({ description: 'Delivered date', nullable: true, type: Date })
  deliveredAt: Date | null;

  @ApiProperty({ description: 'Cancelled date', nullable: true, type: Date })
  cancelledAt: Date | null;

  @ApiProperty({ description: 'Last updated date' })
  updatedAt: Date;

  static fromDomain(order: Order): OrderResponseDto {
    return {
      id: order.getId(),
      orderNumber: order.getOrderNumber(),
      customerId: order.getCustomerId(),
      customer: order.getCustomerInfo()
        ? CustomerInfoResponseDto.fromDomain(order.getCustomerInfo()!)
        : undefined,
      items: order.getItems().map(OrderItemResponseDto.fromDomain),
      subtotal: order.getSubtotal(),
      discount: order.getDiscount(),
      couponDiscount: order.getCouponDiscount(),
      offerDiscount: order.getOfferDiscount(),
      shippingCharge: order.getShippingCharge(),
      tax: order.getTax(),
      total: order.getTotal(),
      appliedCouponCode: order.getAppliedCouponCode(),
      appliedOfferIds: order.getAppliedOfferIds(),
      shippingAddress: order.getShippingAddressJson(),
      paymentMethod: order.getPaymentMethod(),
      paymentStatus: order.getPaymentStatus(),
      orderStatus: order.getOrderStatus(),
      metadata: order.getMetadata(),
      cancelReason: order.getCancelReason(),
      refundAmount: order.getRefundAmount(),
      placedAt: order.placedAt,
      deliveredAt: order.getDeliveredAt(),
      cancelledAt: order.getCancelledAt(),
      updatedAt: order.updatedAt,
    };
  }
}
