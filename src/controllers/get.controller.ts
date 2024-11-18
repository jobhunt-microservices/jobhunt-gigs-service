import { gigsCache } from '@gigs/redis/gigs.cache';
import { gigsServiceController } from '@gigs/services/gigs.service';
import { searchService } from '@gigs/services/search.service';
import { ISearchResult, ISellerGig } from '@jobhunt-microservices/jobhunt-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class GigGetController {
  gigById = async (req: Request, res: Response): Promise<void> => {
    const gig: ISellerGig = await gigsServiceController.getGigById(req.params.gigId);
    res.status(StatusCodes.OK).json({ message: 'Get gig by id', gig });
  };

  sellerGigs = async (req: Request, res: Response): Promise<void> => {
    const gigs: ISellerGig[] = await gigsServiceController.getSellerGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: 'Seller gigs', gigs });
  };

  sellerInactiveGigs = async (req: Request, res: Response): Promise<void> => {
    const gigs: ISellerGig[] = await gigsServiceController.getSellerPausedGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: 'Seller gigs', gigs });
  };

  topRatedGigsByCategory = async (req: Request, res: Response): Promise<void> => {
    const category = await gigsCache.getUserSelectedGigCategory(`selectedCategories:${req.params.username}`);
    const resultHits: ISellerGig[] = [];
    const gigs: ISearchResult = await searchService.getTopRatedGigsByCategory(`${category}`);
    for (const item of gigs.hits) {
      resultHits.push(item._source as ISellerGig);
    }
    res.status(StatusCodes.OK).json({ message: 'Search top gigs results', total: gigs.total, gigs: resultHits });
  };

  gigsByCategory = async (req: Request, res: Response): Promise<void> => {
    const category = await gigsCache.getUserSelectedGigCategory(`selectedCategories:${req.params.username}`);
    const resultHits: ISellerGig[] = [];
    const gigs: ISearchResult = await searchService.gigsSearchByCategory(`${category}`);
    for (const item of gigs.hits) {
      resultHits.push(item._source as ISellerGig);
    }
    res.status(StatusCodes.OK).json({ message: 'Search gigs category results', total: gigs.total, gigs: resultHits });
  };

  moreLikeThis = async (req: Request, res: Response): Promise<void> => {
    const resultHits: ISellerGig[] = [];
    const gigs: ISearchResult = await searchService.getMoreGigsLikeThis(req.params.gigId);
    for (const item of gigs.hits) {
      resultHits.push(item._source as ISellerGig);
    }
    res.status(StatusCodes.OK).json({ message: 'More gigs like this result', total: gigs.total, gigs: resultHits });
  };
}

export const gigGetController = new GigGetController();
