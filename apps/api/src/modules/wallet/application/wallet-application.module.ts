import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { WalletQueryHandlers } from './queries/handlers';
import { WalletCommandHandlers } from './commands/handlers';
import { PrismaWalletRepository } from '@/modules/wallet/infrastructure/persistence';
import { UserApplicationModule } from '@/modules/user/application/user-application.module';

@Module({
  imports: [CqrsModule, UserApplicationModule],
  providers: [
    {
      provide: 'WalletRepository',
      useClass: PrismaWalletRepository,
    },
    ...WalletCommandHandlers,
    ...WalletQueryHandlers,
  ],
  exports: ['WalletRepository'],
})
export class WalletApplicationModule {}
