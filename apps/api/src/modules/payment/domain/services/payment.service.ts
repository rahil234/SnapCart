/**
 * Payment Service Interface
 * Defines methods for payment processing
 */

export interface PaymentService {
  /**
   * Create a Razorpay order for payment
   */
  createRazorpayOrder(orderId: string, amount: number): Promise<any>;

  /**
   * Verify Razorpay payment signature
   */
  verifyRazorpayPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): boolean;
}
