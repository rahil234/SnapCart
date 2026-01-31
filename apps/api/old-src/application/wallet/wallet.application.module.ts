import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WalletDomainModule } from '../../domain/wallet/wallet.domain.module';
import { WalletController } from '../../infrastructure/wallet/controllers/wallet.controller';

@Module({
  imports: [CqrsModule, WalletDomainModule],
  controllers: [WalletController],
})
export class WalletApplicationModule {}
