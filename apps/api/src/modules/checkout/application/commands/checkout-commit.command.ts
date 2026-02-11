import { CheckoutSource } from '../../domain/enums';

/**
 * CheckoutCommitCommand
 * Commits the checkout and creates an order
 * Revalidates all pricing before creating order
 */
export class CheckoutCommitCommand {
  constructor(
    public readonly userId: string,
    public readonly source: CheckoutSource,
    public readonly couponCode: string | undefined,
    public readonly shippingAddressId: string,
    public readonly paymentMethod: string,
  ) {}
}
