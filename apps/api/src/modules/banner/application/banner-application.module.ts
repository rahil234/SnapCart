import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import QueryHandlers from './queries/handlers';
import CommandHandlers from './commands/handlers';
import { StorageModule } from '@/shared/infrastructure/storage/storage.module';
import { PrismaBannerRepository } from '@/modules/banner/infrastructure/persistence/repositories/prisma-banner.repository';

@Module({
  imports: [CqrsModule, StorageModule],
  providers: [
    {
      provide: 'BannerRepository',
      useClass: PrismaBannerRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: ['BannerRepository'],
})
export class BannerApplicationModule {}
