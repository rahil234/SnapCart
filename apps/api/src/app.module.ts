import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { SharedModule } from '@/shared/shared.module';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { LoggerModule } from '@/shared/logger/logger.module';
import { PrismaModule } from '@/shared/prisma/prisma.module';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { JwtModule } from '@/shared/infrastructure/jwt/jwt.module';
import { RedisModule } from '@/shared/infrastructure/redis/redis.module';

// Feature Modules
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { FeedModule } from '@/modules/feed/feed.module';
import { CartModule } from '@/modules/cart/cart.module';
import { OfferModule } from '@/modules/offer/offer.module';
import { ProductModule } from '@/modules/product/product.module';
import { CategoryModule } from '@/modules/category/category.module';
import { CouponModule } from '@/modules/coupon/coupon.module';

@Module({
  imports: [
    SharedModule,
    PrismaModule,
    LoggerModule,
    JwtModule,
    RedisModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    UserModule,
    FeedModule,
    OfferModule,
    CouponModule,
    CartModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
