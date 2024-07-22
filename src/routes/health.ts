import { health } from '@payment/controllers/health';
import express, { Router } from 'express';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/payment-health', health);

  return router;
};

export { healthRoutes };
