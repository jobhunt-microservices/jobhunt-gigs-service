import { SERVICE_NAME } from '@gigs/constants';
import { client } from '@gigs/redis/connection';
import { logger } from '@gigs/utils/logger.util';
import { getErrorMessage } from '@jobhunt-microservices/jobhunt-shared';

const log = logger('gigCache', 'debug');

class GigsCache {
  getUserSelectedGigCategory = async (key: string): Promise<string> => {
    try {
      if (!client.isOpen) {
        await client.connect();
      }
      const response: string = (await client.GET(key)) as string;
      return response;
    } catch (error) {
      log.log('error', SERVICE_NAME + ' GigCache getUserSelectedGigCategory() method error:', getErrorMessage(error));
      return '';
    }
  };
}

export const gigsCache = new GigsCache();
