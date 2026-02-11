import { Command } from '@nestjs/cqrs';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferType } from '@/modules/offer/domain/enums';

export class CreateOfferCommand extends Command<Offer> {
  constructor(
    public readonly name: string,
    public readonly type: OfferType,
    public readonly discount: number,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly minPurchaseAmount: number = 0,
    public readonly maxDiscount?: number,
    public readonly priority: number = 0,
    public readonly categories: string[] = [],
    public readonly products: string[] = [],
    public readonly isStackable: boolean = false,
    public readonly description?: string,
  ) {
    super();
  }
}
