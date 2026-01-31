import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { client } from '@/config/redis';

const limiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args: string[]) => client.sendCommand(args),
    }),
  });
};

export default limiter;
