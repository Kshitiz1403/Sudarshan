import { MapService } from '@/services/mapService';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest, IResponse } from '../types/express';
import { Result } from '../util/result';

@Service()
export class MapController {
  protected mapServiceInstance: MapService;
  protected logger: Logger;
  constructor(mapService: MapService, @Inject('logger') logger: Logger) {
    this.logger = logger;
    this.mapServiceInstance = mapService;
  }

  public getAutoComplete = async (req: IRequest, res: IResponse, next: INextFunction) => {
    this.logger.debug('Calling Auto Complete endpoint with body: %o', req.query);
    try {
      const input = req.query.input as string;
      const lat = +req.query.lat;
      const long = +req.query.lng;

      const predictions = await this.mapServiceInstance.getAutoComplete(input, { latitude: lat, longitude: long });
      return res.status(200).json(Result.success(predictions));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
