import { Application } from 'express';

// import { verifyGatewayRequest } from '@miges-libertad/library-shared';
import { healthRoutes } from './routes/health';

// const BASE_PATH = '/api/v1/payment';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  // app.use(BASE_PATH, verifyGatewayRequest, );
};

export { appRoutes };
