import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import Container from 'typedi';
import { TripController } from '../controllers/tripControllet';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: TripController = Container.get(TripController);

  app.use('/trips', route);

  route.post(
    '/start',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        dustbinId: Joi.string().required(),
        sourceLocation: Joi.object({ latitude: Joi.number(), longitude: Joi.number() }),
        dustbinLocation: Joi.object({ latitude: Joi.number(), longitude: Joi.number() }),
        destinationLocation: Joi.object({ latitude: Joi.number(), longitude: Joi.number() }),
        distance: Joi.number().required(),
      }),
    }),
    ctrl.startTrip,
  );
};
