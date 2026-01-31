import { Module } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { OtpService } from '@/domain/otp/services/otp.service';
import { RedisModule } from '@/common/redis/redis.module';
import { REDIS_CLIENT } from '@/common/redis/redis.provider';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: OtpService,
      useFactory: (redisClient: RedisClientType) => new OtpService(redisClient),
      inject: [REDIS_CLIENT],
    },
  ],
  exports: [OtpService],
})
export class OtpDomainModule {}
