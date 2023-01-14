import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import Container from 'typedi';
import { ReportController } from '../controllers/reportController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: ReportController = Container.get(ReportController);

  app.use('/reports', route);

  route.post('/feedback', middlewares.isAuth, ctrl.addFeedback);

  route.get('/previous', middlewares.isAuth, ctrl.getPreviousWalks);
};
