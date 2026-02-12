import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { OfferController } from './controllers/offer.controller';
import { AdminOfferController } from './controllers/admin-offer.controller';

@Module({
  imports: [CqrsModule],
  controllers: [OfferController, AdminOfferController],
})
export class OfferHttpModule {}
