import { Router } from 'express';
import Container from 'typedi';
import middlewares from '../middlewares';
import { DustbinController } from '../controllers/dustbinController';

const route = Router();

export default (app: Router) => {
  const ctrl: DustbinController = Container.get(DustbinController);

  app.use('/dustbins', route);

  route.post('/add', middlewares.isAuth, ctrl.addDustbin);

  route.post('/scan', middlewares.isAuth, ctrl.scanQR);
};
