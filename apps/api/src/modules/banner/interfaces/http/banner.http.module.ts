import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { BannerController } from './controllers/banner.controller';
import { AdminBannerController } from './controllers/admin-banner.controller';

@Module({
  imports: [CqrsModule],
  controllers: [BannerController, AdminBannerController],
})
export class BannerHttpModule {}
