import express, { Express } from 'express';
import { start } from '@payment/server';
import { databaseConnection } from '@payment/database';

const initialize = (): void => {
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();
