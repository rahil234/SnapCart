import { CheckoutSource } from '../../domain/enums';

/**
 * CheckoutPreviewQuery
 * Get pricing breakdown without committing to order
 * Idempotent - safe to call multiple times
 * No database writes
 */
export class CheckoutPreviewQuery {
  constructor(
    public readonly userId: string,
    public readonly source: CheckoutSource,
    public readonly couponCode?: string,
  ) {}
}
