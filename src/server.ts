import http from 'http';

import 'express-async-errors';
import { Logger } from 'winston';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { Channel } from 'amqplib';
import { CustomError, IErrorResponse, winstonLogger } from '@miges-libertad/library-shared';

import { IAuthPayload } from './interfaces/auth.interface';
import { config } from './config';
import { appRoutes } from './routes';

const SERVER_PORT = 4007;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'payemntServer', 'debug');
let reviewChannel: Channel;

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  // startQueues();
  // startElasticSearch();
  paymentErrorHandler(app);
  startServer(app);
};

const securityMiddleware = (app: Application): void => {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
};

const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
};

const routesMiddleware = (app: Application): void => {
  appRoutes(app);
};

// const startQueues = async (): Promise<void> => {
//   reviewChannel = await createConnection() as Channel;
// };

// const startElasticSearch = (): void => {
//   checkConnection();
// };

const paymentErrorHandler = (app: Application): void => {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `PaymentService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
};

const startServer = async (app: Application): Promise<void> => {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Payement server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Payement server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'PayementService startServer() method error:', error);
  }
};

export { start, reviewChannel };
