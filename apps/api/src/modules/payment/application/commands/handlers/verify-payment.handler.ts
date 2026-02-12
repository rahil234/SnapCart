import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

import { PaymentService } from '../../../domain/services';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { VerifyPaymentCommand } from '../verify-payment.command';
import { OrderStatus, PaymentStatus } from '@/modules/order/domain/enums';

@CommandHandler(VerifyPaymentCommand)
export class VerifyPaymentHandler implements ICommandHandler<VerifyPaymentCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PaymentService')
    private readonly paymentService: PaymentService,
  ) {}

  async execute(command: VerifyPaymentCommand): Promise<{ orderId: string }> {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = command;

    // Verify payment signature only if signature is provided (frontend verification)
    // For webhook verification, signature will be empty as webhook signature is verified separately
    if (razorpaySignature) {
      const isValidSignature = this.paymentService.verifyRazorpayPayment(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      );

      if (!isValidSignature) {
        throw new BadRequestException('Payment verification failed');
      }
    }

    // Find and update the order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Update order status to processing (payment successful)
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.PROCESSING,
      },
    });

    // Clear cart after successful Razorpay payment
    if (order.customerId) {
      try {
        await this.prisma.cart.update({
          where: { customerId: order.customerId as string },
          data: {
            items: {
              deleteMany: {},
            },
          },
        });
      } catch (error) {
        // Log but don't fail the payment verification if cart clearing fails
        console.warn('Failed to clear cart after payment verification:', error);
      }
    }

    return { orderId };
  }
}
