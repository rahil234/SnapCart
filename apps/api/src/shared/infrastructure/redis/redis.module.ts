import { Global, Module } from '@nestjs/common';

import redisProvider from '@/shared/infrastructure/redis/redis.provider';

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
