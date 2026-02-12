import { Injectable, ConsoleLogger, LoggerService } from '@nestjs/common';
import { LoggerFactory } from './logger-factory.interface';

@Injectable()
export class ConsoleLoggerFactory implements LoggerFactory {
  create(context: string): LoggerService {
    return new ConsoleLogger({
      context,
    });
  }
}
