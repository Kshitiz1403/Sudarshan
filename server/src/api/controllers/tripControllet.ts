import { ITripStartInputDTO } from '@/interfaces/ITrip';
import { TripService } from '@/services/tripService';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

@Service()
export class TripController {
  protected tripServiceInstance: TripService;
  protected logger: Logger;

  constructor(tripService: TripService, @Inject('logger') logger: Logger) {
    this.tripServiceInstance = tripService;
    this.logger = logger;
  }

  public startTrip = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling start trip endpoint with body %o', req.body);

    try {
      const dustbinId = req.body.dustbinId as ITripStartInputDTO['dustbinId'];
      const source = req.body.sourceLocation as ITripStartInputDTO['source'];
      const destinationLocation = req.body.destinationLocation as ITripStartInputDTO['destination'];
      const distance = req.body.distance as ITripStartInputDTO['distanceMeter'];

      const trip = await this.tripServiceInstance.startTrip({
        destination: destinationLocation,
        userId: req.currentUser.userId,
        distanceMeter: distance,
        dustbinId,
        source,
      });
      return res.status(200).json(Result.success(trip));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
