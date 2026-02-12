import { Module } from '@nestjs/common';

import { OfferApplicationModule } from './application/offer-application.module';
import { OfferHttpModule } from './interfaces/http/offer.http.module';

@Module({
  imports: [OfferApplicationModule, OfferHttpModule],
})
export class OfferModule {}
