import { gigsServiceController } from '@gigs/services/gigs.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class GigsDeleteController {
  delete = async (req: Request, res: Response): Promise<void> => {
    await gigsServiceController.deleteGig(req.params.gigId, req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: 'Gig deleted successfully.' });
  };
}

export const gigsDeleteController = new GigsDeleteController();
