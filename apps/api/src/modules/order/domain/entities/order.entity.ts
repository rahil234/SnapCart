import { OrderStatus, PaymentStatus } from '../enums';
import { OrderItem, CustomerInfo } from '../value-objects';

/**
 * Order Entity
 * Aggregate root for order management
 */
export class Order {
  private constructor(
    public readonly id: string,
    public readonly orderNumber: string,
    private customerId: string,
    private customerInfo: CustomerInfo | null,
    private items: OrderItem[],
    private subtotal: number,
    private discount: number,
    private couponDiscount: number,
    private offerDiscount: number,
    private shippingCharge: number,
    private tax: number,
    private total: number,
    private appliedCouponCode: string | null,
    private appliedOfferIds: string[],
    private shippingAddressJson: any,
    private paymentMethod: string | null,
    private paymentStatus: PaymentStatus,
    private orderStatus: OrderStatus,
    private metadata: any,
    private cancelReason: string | null,
    private refundAmount: number | null,
    public readonly placedAt: Date,
    private deliveredAt: Date | null,
    private cancelledAt: Date | null,
    public readonly updatedAt: Date,
  ) {
    this.validateInvariants();
  }

  /**
   * Factory method for reconstruction from persistence
   */
  static from(
    id: string,
    orderNumber: string,
    customerId: string,
    customerInfo: CustomerInfo | null,
    items: any[],
    subtotal: number,
    discount: number,
    couponDiscount: number,
    offerDiscount: number,
    shippingCharge: number,
    tax: number,
    total: number,
    appliedCouponCode: string | null,
    appliedOfferIds: string[],
    shippingAddressJson: any,
    paymentMethod: string | null,
    paymentStatus: PaymentStatus,
    orderStatus: OrderStatus,
    metadata: any,
    cancelReason: string | null,
    refundAmount: number | null,
    placedAt: Date,
    deliveredAt: Date | null,
    cancelledAt: Date | null,
    updatedAt: Date,
  ): Order {
    const orderItems = items.map((item) => OrderItem.fromJSON(item));

    return new Order(
      id,
      orderNumber,
      customerId,
      customerInfo,
      orderItems,
      subtotal,
      discount,
      couponDiscount,
      offerDiscount,
      shippingCharge,
      tax,
      total,
      appliedCouponCode,
      appliedOfferIds,
      shippingAddressJson,
      paymentMethod,
      paymentStatus,
      orderStatus,
      metadata,
      cancelReason,
      refundAmount,
      placedAt,
      deliveredAt,
      cancelledAt,
      updatedAt,
    );
  }

  private validateInvariants(): void {
    if (this.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    if (this.total < 0) {
      throw new Error('Total cannot be negative');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getOrderNumber(): string {
    return this.orderNumber;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getCustomerInfo(): CustomerInfo | null {
    return this.customerInfo;
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  getSubtotal(): number {
    return this.subtotal;
  }

  getDiscount(): number {
    return this.discount;
  }

  getCouponDiscount(): number {
    return this.couponDiscount;
  }

  getOfferDiscount(): number {
    return this.offerDiscount;
  }

  getShippingCharge(): number {
    return this.shippingCharge;
  }

  getTax(): number {
    return this.tax;
  }

  getTotal(): number {
    return this.total;
  }

  getAppliedCouponCode(): string | null {
    return this.appliedCouponCode;
  }

  getAppliedOfferIds(): string[] {
    return [...this.appliedOfferIds];
  }

  getShippingAddressJson(): any {
    return this.shippingAddressJson;
  }

  getPaymentMethod(): string | null {
    return this.paymentMethod;
  }

  getPaymentStatus(): PaymentStatus {
    return this.paymentStatus;
  }

  getOrderStatus(): OrderStatus {
    return this.orderStatus;
  }

  getMetadata(): any {
    return this.metadata;
  }

  getCancelReason(): string | null {
    return this.cancelReason;
  }

  getRefundAmount(): number | null {
    return this.refundAmount;
  }

  getDeliveredAt(): Date | null {
    return this.deliveredAt;
  }

  getCancelledAt(): Date | null {
    return this.cancelledAt;
  }

  // Business methods
  canBeCancelled(): boolean {
    return (
      this.orderStatus === OrderStatus.PENDING ||
      this.orderStatus === OrderStatus.PROCESSING
    );
  }

  cancel(reason: string): void {
    if (!this.canBeCancelled()) {
      throw new Error(
        `Order cannot be cancelled in ${this.orderStatus} status`,
      );
    }

    this.orderStatus = OrderStatus.CANCELED;
    this.cancelReason = reason;
    this.cancelledAt = new Date();
  }

  markAsProcessing(): void {
    if (this.orderStatus !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be marked as processing');
    }
    this.orderStatus = OrderStatus.PROCESSING;
  }

  markAsShipping(): void {
    if (this.orderStatus !== OrderStatus.PROCESSING) {
      throw new Error('Only processing orders can be marked as shipping');
    }
    this.orderStatus = OrderStatus.SHIPPING;
  }

  markAsDelivered(): void {
    if (this.orderStatus !== OrderStatus.SHIPPING) {
      throw new Error('Only shipping orders can be marked as delivered');
    }
    this.orderStatus = OrderStatus.DELIVERED;
    this.deliveredAt = new Date();
  }

  requestReturn(): void {
    if (this.orderStatus !== OrderStatus.DELIVERED) {
      throw new Error('Only delivered orders can have return requested');
    }
    this.orderStatus = OrderStatus.RETURN_REQUESTED;
  }

  approveReturn(): void {
    if (this.orderStatus !== OrderStatus.RETURN_REQUESTED) {
      throw new Error('Only return requested orders can be approved');
    }
    this.orderStatus = OrderStatus.RETURN_APPROVED;
  }

  rejectReturn(reason: string): void {
    if (this.orderStatus !== OrderStatus.RETURN_REQUESTED) {
      throw new Error('Only return requested orders can be rejected');
    }
    this.orderStatus = OrderStatus.RETURN_REJECTED;
    this.cancelReason = reason;
  }

  markAsReturned(refundAmount: number): void {
    if (this.orderStatus !== OrderStatus.RETURN_APPROVED) {
      throw new Error('Only return approved orders can be marked as returned');
    }
    this.orderStatus = OrderStatus.RETURNED;
    this.refundAmount = refundAmount;
    this.paymentStatus = PaymentStatus.REFUNDED;
  }

  markPaymentAsPaid(): void {
    this.paymentStatus = PaymentStatus.PAID;
  }

  markPaymentAsFailed(): void {
    this.paymentStatus = PaymentStatus.FAILED;
  }

  markPaymentAsRefunded(): void {
    this.paymentStatus = PaymentStatus.REFUNDED;
  }

  setRefundAmount(amount: number): void {
    this.refundAmount = amount;
    this.paymentStatus = PaymentStatus.REFUNDED;
  }
}
