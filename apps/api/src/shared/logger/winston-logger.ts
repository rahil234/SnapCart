import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston, { createLogger } from 'winston';

const instance = createLogger({
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

export const Logger = WinstonModule.createLogger({
  instance,
});
