import { IUserDetails } from '@/interfaces/IUser';
import UserService from '@/services/userService';
import { NextFunction, Response } from 'express';
import { Inject } from 'typedi';
import { Logger } from 'winston';
import { INextFunction, IRequest } from '../types/express';
import { Result } from '../util/result';

export class UserController {
  protected logger: Logger;
  protected userServiceInstance: UserService;
  constructor(@Inject('logger') logger: Logger, userService: UserService) {
    this.userServiceInstance = userService;
    this.logger = logger;
  }

  public getUserDetails = async (req: IRequest, res: Response, next: INextFunction) => {
    this.logger.debug('Calling get user details endpoint with query: %o', req.query);
    try {
      const user = await this.userServiceInstance.getUserDetails(req.currentUser.userId);
      return res.status(200).json(Result.success(user));
    } catch (e) {
      return next(e);
    }
  };

  public isProfileComplete = async (req: IRequest, res: Response, next: NextFunction) => {
    this.logger.debug('Calling isProfileComplete endpoint with query: %o', req.query);
    try {
      const isProfileComplete = await this.userServiceInstance.isProfileComplete(req.currentUser.userId);
      return res.status(200).json(Result.success(isProfileComplete));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  public completeDetails = async (req: IRequest, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Complete Details endpoint with body: %o', {
      body: JSON.parse(JSON.stringify(req.body)),
    });
    try {
      const user = await this.userServiceInstance.completeDetails(req.currentUser.userId, req.body as IUserDetails);
      return res.status(200).json(Result.success(user));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  public uploadImage = async (req: IRequest & { file: any }, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Upload Image endpoint with file: %o', { file: req.file });
    try {
      const data = await this.userServiceInstance.uploadProfilePic(req.currentUser.userId, req.file);
      return res.status(200).json(Result.success(data));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
