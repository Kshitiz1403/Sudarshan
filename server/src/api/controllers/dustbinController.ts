import { IDustbin } from '@/interfaces/IDustbin';
import { ILatLng } from '@/interfaces/IPlace';
import DustbinService from '@/services/dustbinService';
import { NextFunction, Response } from 'express';
import { Inject } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest } from '../types/express';
import { Result } from '../util/result';

export class DustbinController {
  protected logger: Logger;
  protected dustbinServiceInstance: DustbinService;
  constructor(@Inject('logger') logger: Logger, dustbinService: DustbinService) {
    this.dustbinServiceInstance = dustbinService;
    this.logger = logger;
  }

  public addDustbin = async (req: IRequest, res: Response, next: INextFunction) => {
    this.logger.debug('Calling add dustbin endpoint with body: %o', req.body);
    try {
      const location = req.body as ILatLng;
      const address = req.body.address as IDustbin['address'];
      const dustbin = await this.dustbinServiceInstance.addDustbin(location, address);

      return res.status(200).json(Result.success(dustbin));
    } catch (e) {
      return next(e);
    }
  };
}
