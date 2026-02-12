import { Module } from '@nestjs/common';

import { BannerHttpModule } from './interfaces/http/banner.http.module';
import { BannerApplicationModule } from './application/banner-application.module';

@Module({
  imports: [BannerApplicationModule, BannerHttpModule],
})
export class BannerModule {}
