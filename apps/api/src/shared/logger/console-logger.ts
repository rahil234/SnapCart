import {
  LoggerService,
  ConsoleLogger as ConsoleLoggerBase,
} from '@nestjs/common';

export class ConsoleLogger extends ConsoleLoggerBase implements LoggerService {
  log(message: string, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
  }

  verbose(message: string, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
  }
}
