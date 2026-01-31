import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientOptions } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

type SocketOptions = RedisClientOptions['socket'];

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const REDIS_URL = configService.getOrThrow<string>('REDIS_URL');
    const NODE_ENV = configService.getOrThrow<string>('NODE_ENV');

    const reconnectStrategy = (retries: number) => {
      const jitter = Math.floor(Math.random() * 100);

      const delay = Math.min(Math.pow(2, retries) * 50, 3000);

      return delay + jitter;
    };

    const socket: SocketOptions =
      NODE_ENV === 'production'
        ? {
            tls: true,
            reconnectStrategy,
          }
        : {
            tls: false,
            keepAlive: true,
            reconnectStrategy,
          };

    const client = createClient({
      url: REDIS_URL,
      socket,
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    client.on('connect', () => {
      console.log('Redis connected');
    });

    client.on('ready', () => {
      console.log('Redis ready');
    });

    client.on('reconnecting', () => {
      console.warn('Redis reconnecting...');
    });

    client.on('end', () => {
      console.warn('Redis connection closed');
    });

    await client.connect().catch((err) => {
      console.error('Initial Redis connection failed:', err);
    });

    return client;
  },
};

export default redisProvider;
