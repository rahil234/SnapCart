import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaymentService } from '../../../domain/services';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { CreatePaymentCommand } from '../create-payment.command';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<CreatePaymentCommand> {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PaymentService')
    private readonly paymentService: PaymentService,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<any> {
    const { orderId } = command;

    // Find the order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Create Razorpay order
    const razorpayOrder = await this.paymentService.createRazorpayOrder(
      orderId,
      order.total * 100, // Convert to paise
    );

    return razorpayOrder;
  }
}
