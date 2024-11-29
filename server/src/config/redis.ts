import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const client = createClient({
  url: redisUrl,
});

const connectToRedis = async () => {
  try {
    client.on('connect', () => {
      console.log('Redis ✅: Connected to Redis ' + redisUrl);
    });

    client.on('error', (err) => {
      console.error('Redis ❌: Redis connection error:', err);
    });

    await client.connect();
  } catch (err) {
    console.error('Redis ❌: Redis connection error:', err);
  }
};
export default connectToRedis;
