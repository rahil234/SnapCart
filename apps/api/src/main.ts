import { Server } from 'node:http';
import { ConfigService } from '@nestjs/config';

import { setupApp } from '@/shared/config/app.config';
import { Logger } from '@/shared/logger/winston-logger';

async function bootstrap() {
  const app = await setupApp();

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('PORT');

  const logger = app.get('Logger') as typeof Logger;

  await app.listen(port).then((value: Server) => {
    const serverAddress = JSON.parse(JSON.stringify(value.address())) as {
      port: number;
      family: string;
      address: string;
    };

    logger.log(`Server Started Listening: ${serverAddress.port}`);
  });
}

bootstrap().catch((error) => {
  Logger.error('Error during application bootstrap:', error);
  process.exit(1);
});
