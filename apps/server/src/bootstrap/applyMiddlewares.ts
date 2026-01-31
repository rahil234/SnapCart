import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import type { Express } from 'express';
import cookieParser from 'cookie-parser';

import logger from '@/middleware/logger';
import limiter from '@/config/rateLimmiter';

export function applyMiddlewares(app: Express) {
  /* Security */
  app.use(helmet());

  /* CORS */
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  /* Rate limit only in prod */
  if (process.env.NODE_ENV === 'production') {
    app.use(limiter());
  }

  /* Core middlewares */
  app.use(logger());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
