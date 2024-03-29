import { IRequest, IResponse } from '@/api/types/express';
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import Container from 'typedi';
import { UserController } from '../controllers/userController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: UserController = Container.get(UserController);

  app.use('/users', route);

  route.get('/me', middlewares.isAuth, ctrl.getUserDetails);

  route.get('/profileStatus', middlewares.isAuth, ctrl.isProfileComplete);

  route.patch('/details', middlewares.isAuth, ctrl.completeDetails);

  route.post('/photo', middlewares.isAuth, middlewares.upload.single('photo'), ctrl.uploadImage);
};
