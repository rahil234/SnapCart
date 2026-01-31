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
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { Logger } from '@/shared/logger/winston-logger';
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

  const config = new DocumentBuilder()
    .setTitle('Cloudberry API')
    .setDescription('API documentation for the Cloudberry E-commerce Api')
    .setVersion('1.0')
    .addServer('http://localhost:4000', 'Local Server')
    .setContact(
      'Rahil K',
      'https://www.linkedin.com/in/rahil234/',
      'rahilsardar234@gmail.com',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    ui: true,
    swaggerOptions: {},
  });

  SwaggerModule.setup('api/docs-json', app, document, {
    ui: false,
  });

  return app;
}
