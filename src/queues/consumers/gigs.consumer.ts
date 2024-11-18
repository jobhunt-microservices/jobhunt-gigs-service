import { SERVICE_NAME } from '@gigs/constants';
import { createConnection } from '@gigs/queues/connections';
import { gigsServiceController } from '@gigs/services/gigs.service';
import { logger } from '@gigs/utils/logger.util';
import { ExchangeNames, getErrorMessage, QueueNames, RoutingKeys } from '@jobhunt-microservices/jobhunt-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';

const log = logger('gigServiceConsumer', 'debug');

class GigsConsumer {
  consumeGigDirectMessage = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      await channel.assertExchange(ExchangeNames.UPDATE_GIG, 'direct');
      const jobberQueue: Replies.AssertQueue = await channel.assertQueue(QueueNames.UPDATE_GIG, { durable: true, autoDelete: false });
      await channel.bindQueue(jobberQueue.queue, ExchangeNames.UPDATE_GIG, RoutingKeys.UPDATE_GIG);
      channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const { gigReview } = JSON.parse(msg!.content.toString());
        await gigsServiceController.updateGigReview(JSON.parse(gigReview));
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' GigConsumer consumeGigDirectMessage() method error:', getErrorMessage(error));
    }
  };

  consumeSeedDirectMessages = async (channel: Channel): Promise<void> => {
    try {
      if (!channel) {
        channel = (await createConnection()) as Channel;
      }
      const exchangeName = 'jobber-seed-gig';
      const routingKey = 'receive-sellers';
      const queueName = 'seed-gig-queue';
      await channel.assertExchange(exchangeName, 'direct');
      const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
      await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
      channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        const { sellers, count } = JSON.parse(msg!.content.toString());
        await gigsServiceController.seedData(sellers, count);
        channel.ack(msg!);
      });
    } catch (error) {
      log.log('error', SERVICE_NAME + ' GigConsumer consumeGigDirectMessage() method error:', getErrorMessage(error));
    }
  };
}

export const gigsConsumer = new GigsConsumer();
