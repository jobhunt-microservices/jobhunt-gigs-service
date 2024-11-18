import { BASE_PATH } from '@gigs/constants/path';
import { gigsRoute } from '@gigs/routes/gigs.route';
import { healthRoutes } from '@gigs/routes/health.route';
import { verifyGatewayRequest } from '@jobhunt-microservices/jobhunt-shared';
import { Application } from 'express';

const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, healthRoutes.routes());
  app.use(BASE_PATH, verifyGatewayRequest, gigsRoute.routes());
};

export { appRoutes };
