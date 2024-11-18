import { config } from '@gigs/config';
import { database } from '@gigs/database';
import { redisConnect } from '@gigs/redis/connection';
import { UsersServer } from '@gigs/server';
import express, { Express } from 'express';

class Application {
  public initialize() {
    config.cloudinaryConfig();
    database.connection();

    const app: Express = express();
    const server = new UsersServer(app);

    server.start();

    redisConnect();
  }
}

const application = new Application();
application.initialize();
