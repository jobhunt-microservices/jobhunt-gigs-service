import { searchService } from '@gigs/services/search.service';
import { IPaginateProps, ISearchResult, ISellerGig } from '@jobhunt-microservices/jobhunt-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sortBy } from 'lodash';

class GigsSearchController {
  search = async (req: Request, res: Response): Promise<void> => {
    const { from, size, type } = req.params;
    let resultHits: ISellerGig[] = [];
    const paginate: IPaginateProps = { from, size: parseInt(`${size}`), type };
    const gigs: ISearchResult = await searchService.gigsSearch(
      `${req.query.query}`,
      paginate,
      `${req.query.delivery_time}`,
      parseInt(`${req.query.minprice}`),
      parseInt(`${req.query.maxprice}`)
    );
    for (const item of gigs.hits) {
      resultHits.push(item._source as ISellerGig);
    }
    if (type === 'backward') {
      resultHits = sortBy(resultHits, ['sortId']);
    }
    res.status(StatusCodes.OK).json({ message: 'Search gigs results', total: gigs.total, gigs: resultHits });
  };
}

export const gigsSearchController = new GigsSearchController();
