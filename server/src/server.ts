import { createApp } from '@/app';
import connectToRedis from '@/config/redis';
import connectToDatabase from '@/config/mongoDB';

async function bootstrap() {
  const app = await createApp();

  await connectToDatabase();
  await connectToRedis();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server ✅: Running on port ${PORT}`);
  });
}

bootstrap();
