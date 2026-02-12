import { Global, Module } from '@nestjs/common';

import { ConsoleLoggerFactory } from '@/shared/logger/console-logger.factory';

export const LOGGER_FACTORY = 'LOGGER_FACTORY';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER_FACTORY,
      useClass: ConsoleLoggerFactory,
    },
  ],
  exports: [LOGGER_FACTORY],
})
export class LoggerModule {}
