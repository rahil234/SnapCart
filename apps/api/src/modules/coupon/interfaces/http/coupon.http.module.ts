import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CouponController } from './controllers/coupon.controller';
import { AdminCouponController } from './controllers/admin-coupon.controller';

@Module({
  imports: [CqrsModule],
  controllers: [CouponController, AdminCouponController],
})
export class CouponHttpModule {}
