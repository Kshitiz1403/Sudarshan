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

  route.patch(
    '/details',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        dob: Joi.date().required(),
        gender: Joi.string().valid('Male', 'Female', 'Other').required(),
        weightKG: Joi.number().required(),
        heightCM: Joi.number().required(),
      }),
    }),
    ctrl.completeDetails,
  );
};
