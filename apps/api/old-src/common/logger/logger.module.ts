import { Global, Module } from '@nestjs/common';

import { LOGGER } from '@/common/logger/logger.token';
import { logger } from '@/common/logger/winston-logger';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useValue: logger,
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}
