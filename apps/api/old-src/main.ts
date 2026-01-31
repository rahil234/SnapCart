import { Server } from 'node:http';
import { ConfigService } from '@nestjs/config';

import { setupApp } from '@/common/config/app.config';
import { logger } from '@/common/logger/winston-logger';

async function bootstrap() {
  const app = await setupApp();

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port).then((value: Server) => {
    const serverAddress = JSON.parse(JSON.stringify(value.address())) as {
      port: number;
      family: string;
      address: string;
    };

    logger.info(`Server Started Listening: ${serverAddress.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Error during application bootstrap:', error);
  process.exit(1);
});
