import { Command } from '@nestjs/cqrs';
import { Offer } from '@/modules/offer/domain/entities';
import { OfferType } from '@/modules/offer/domain/enums';

export class UpdateOfferCommand extends Command<Offer> {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly type?: OfferType,
    public readonly discount?: number,
    public readonly minPurchaseAmount?: number,
    public readonly maxDiscount?: number,
    public readonly priority?: number,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly isStackable?: boolean,
    public readonly description?: string,
    public readonly categories?: string[],
    public readonly products?: string[],
  ) {
    super();
  }
}
