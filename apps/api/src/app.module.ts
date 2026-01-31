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
import { ProductModule } from '@/modules/product/product.module';
import { CategoryModule } from '@/modules/category/category.module';
import { FeedModule } from '@/modules/feed/feed.module';
import { OfferModule } from '@/modules/offer/offer.module';

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
