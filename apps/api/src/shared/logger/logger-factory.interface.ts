import { LoggerService } from '@nestjs/common';

export interface LoggerFactory {
  create(context: string): LoggerService;
}
