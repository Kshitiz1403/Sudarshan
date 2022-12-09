import { IUserInputDTO } from '@/interfaces/IUser';
import AuthService from '@/services/authService';
import { NextFunction, Request, Response } from 'express';
import { Inject } from 'typedi';
import { Logger } from 'winston';
import { Result } from '../util/result';

export class AuthController {
  protected logger: Logger;
  protected authServiceInstance: AuthService;

  constructor(@Inject('logger') logger: Logger, authService: AuthService) {
    this.logger = logger;
    this.authServiceInstance = authService;
  }

  public signup = async (req: Request, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
    try {
      const { user, token } = await this.authServiceInstance.signUp(req.body as IUserInputDTO);
      return res.status(201).json(Result.success({ user, token }));
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  public signin = async (req: Request, res: Response, next: NextFunction) => {
    this.logger.debug('Calling Sign-In endpoint with body: %o', req.body);
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authServiceInstance.signIn(email, password);
      return res.json(Result.success<Object>({ user, token })).status(200);
    } catch (error) {
      return next(error);
    }
  };
}
