import winston, { createLogger } from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

const Logger = createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('ArticleFeed', {
      colors: true,
      prettyPrint: true,
      processId: false,
      appName: false,
    }),
  ),
  transports: [new winston.transports.Console()],
});

export const logger = Logger;

export const LoggerInstance = WinstonModule.createLogger({
  instance: Logger,
});
