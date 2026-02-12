import { Module } from '@nestjs/common';

import { CouponHttpModule } from './interfaces/http/coupon.http.module';
import { CouponApplicationModule } from './application/coupon-application.module';

@Module({
  imports: [CouponApplicationModule, CouponHttpModule],
})
export class CouponModule {}
