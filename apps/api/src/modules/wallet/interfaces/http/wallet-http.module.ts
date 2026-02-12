import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { WalletController } from './controllers/wallet.controller';
import { WalletApplicationModule } from '@/modules/wallet/application/wallet-application.module';

@Module({
  imports: [CqrsModule, WalletApplicationModule],
  controllers: [WalletController],
})
export class WalletHttpModule {}
