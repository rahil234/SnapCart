import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientOptions } from 'redis';
import { LOGGER_FACTORY } from '@/shared/logger/logger.module';
import { LoggerFactory } from '@/shared/logger/logger-factory.interface';

export const REDIS_CLIENT = 'REDIS_CLIENT';

type SocketOptions = RedisClientOptions['socket'];

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService, LOGGER_FACTORY],
  useFactory: async (
    configService: ConfigService,
    loggerFactory: LoggerFactory,
  ) => {
    const REDIS_URL = configService.getOrThrow<string>('REDIS_URL');

    const logger = loggerFactory.create('RedisProvider');

    const reconnectStrategy = (retries: number) => {
      const jitter = Math.floor(Math.random() * 100);

      const delay = Math.min(Math.pow(2, retries) * 50, 3000);

      return delay + jitter;
    };

    const socket: SocketOptions = {
      tls: false,
      keepAlive: true,
      reconnectStrategy,
    };

    const client = createClient({
      url: REDIS_URL,
      socket,
    });

    client.on('error', (err) => {
      logger.error('Redis error:', err);
    });

    client.on('connect', () => {
      logger.log('Redis connected');
    });

    client.on('ready', () => {
      logger.log('Redis ready');
    });

    client.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });

    client.on('end', () => {
      logger.warn('Redis connection closed');
    });

    await client.connect().catch((err) => {
      logger.error('Initial Redis connection failed:', err);
    });

    return client;
  },
};

export default redisProvider;
