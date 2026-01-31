import express from 'express';

import '@/config/configEnv';
import errorHandler from '@/middleware/errorHandler';
import { applyRoutes } from '@/bootstrap/applyRoutes';
import { applyMiddlewares } from '@/bootstrap/applyMiddlewares';

export function createApp() {
  const app = express();

  applyMiddlewares(app);
  applyRoutes(app);

  app.use(errorHandler);
  return app;
}
