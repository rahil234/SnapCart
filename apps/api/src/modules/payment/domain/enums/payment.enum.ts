/**
 * Payment Domain Enums
 */

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  WALLET = 'wallet',
  COD = 'cod',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}
