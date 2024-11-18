import { gigsCreateController } from '@gigs/controllers/create.controller';
import { gigsDeleteController } from '@gigs/controllers/delete.controller';
import { gigGetController } from '@gigs/controllers/get.controller';
import { gigsSearchController } from '@gigs/controllers/search.controller';
import { gigsSeedController } from '@gigs/controllers/seed.controller';
import { gigsUpdateController } from '@gigs/controllers/update.controller';
import express, { Router } from 'express';

class GigsRoute {
  router: Router;
  constructor() {
    this.router = express.Router();
  }

  routes = (): Router => {
    this.router.get('/:gigId', gigGetController.gigById);
    this.router.get('/seller/:sellerId', gigGetController.sellerGigs);
    this.router.get('/seller/pause/:sellerId', gigGetController.sellerInactiveGigs);
    this.router.get('/search/:from/:size/:type', gigsSearchController.search);
    this.router.get('/category/:username', gigGetController.gigsByCategory);
    this.router.get('/top/:username', gigGetController.topRatedGigsByCategory);
    this.router.get('/similar/:gigId', gigGetController.moreLikeThis);
    this.router.post('/create', gigsCreateController.create);
    this.router.put('/:gigId', gigsUpdateController.update);
    this.router.put('/active/:gigId', gigsUpdateController.updateActive);
    this.router.put('/seed/:count', gigsSeedController.createSeedData);
    this.router.delete('/:gigId/:sellerId', gigsDeleteController.delete);
    return this.router;
  };
}

export const gigsRoute = new GigsRoute();
