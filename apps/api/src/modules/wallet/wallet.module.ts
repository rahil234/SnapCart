import { Module } from '@nestjs/common';

import { WalletHttpModule } from './interfaces/http/wallet-http.module';

@Module({
  imports: [WalletHttpModule],
})
export class WalletModule {}
