export class CouponUsedEvent {
  constructor(
    public readonly couponId: string,
    public readonly couponCode: string,
    public readonly userId: string,
    public readonly discountApplied: number,
    public readonly orderId?: string,
  ) {}
}
