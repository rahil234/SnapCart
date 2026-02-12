import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import QueryHandlers from './queries/handlers';
import CommandHandlers from './commands/handlers';
import { PrismaOfferRepository } from '@/modules/offer/infrastructure/persistence/repositories/prisma-offer.repository';

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: 'OfferRepository',
      useClass: PrismaOfferRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: ['OfferRepository'],
})
export class OfferApplicationModule {}
