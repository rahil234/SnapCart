import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

const connectToRedis = async () => {
  try {
    client.on('connect', () => {
      console.log('Redis ✅: Connected to Redis');
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
