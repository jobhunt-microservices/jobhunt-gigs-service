import { gigsProducer } from '@gigs/queues/producers/gigs.producer';
import { gigsChannel } from '@gigs/server';
import { ExchangeNames, RoutingKeys } from '@jobhunt-microservices/jobhunt-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class GigsSeedController {
  createSeedData = async (req: Request, res: Response): Promise<void> => {
    const { count } = req.params;
    await gigsProducer.publishDirectMessage(
      gigsChannel,
      ExchangeNames.GIG,
      RoutingKeys.GET_SELLERS,
      JSON.stringify({ type: 'getSellers', count }),
      'Gig seed message sent to user service.'
    );
    res.status(StatusCodes.CREATED).json({ message: 'Gig created successfully' });
  };
}

export const gigsSeedController = new GigsSeedController();
