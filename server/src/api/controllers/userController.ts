import { IUserDetails } from '@/interfaces/IUser';
import UserService from '@/services/userService';
import { NextFunction, Response } from 'express';
import { Inject } from 'typedi';
import { Logger } from 'winston';
import { IRequest } from '../types/express';
import { Result } from '../util/result';

export class UserController {
  protected logger: Logger;
  protected userServiceInstance: UserService;
  constructor(@Inject('logger') logger: Logger, userService: UserService) {
    this.userServiceInstance = userService;
    this.logger = logger;
  }

  public completeDetails = async (req: IRequest, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Complete Details endpoint with body: %o', req.body);
    try {
      const user = await this.userServiceInstance.completeDetails(req.currentUser.userId, req.body as IUserDetails);
      return res.status(200).json(Result.success(user));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
