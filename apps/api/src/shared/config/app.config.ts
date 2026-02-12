import {
  INestApplication,
  RawBodyRequest,
  ValidationPipe,
} from '@nestjs/common';
import morgan from 'morgan';
import { Request } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@/app.module';
import { Logger } from '@/shared/logger/winston-logger';
import { setupSwagger } from '@/shared/config/swagger.config';
import { GlobalExceptionFilter } from '@/shared/filters/http-exception.filter';

export async function setupApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: Logger,
  });

  const configService = app.get(ConfigService);

  app.use(cookieParser());

  app.use(
    bodyParser.json({
      limit: '50mb',
      verify: (req: RawBodyRequest<Request>, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const origins = configService.getOrThrow<string>('CORS_ORIGINS').split(',');

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(morgan('dev'));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  setupSwagger(app);

  return app;
}
