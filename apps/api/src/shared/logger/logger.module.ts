import { Global, Module } from '@nestjs/common';

import { Logger } from '@/shared/logger/winston-logger';

@Global()
@Module({
  providers: [
    {
      provide: 'Logger',
      useValue: Logger,
    },
  ],
  exports: ['Logger'],
})
export class LoggerModule {}
