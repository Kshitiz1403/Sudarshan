import { Router } from 'express';
import Container from 'typedi';
import { MapController } from '../controllers/mapController';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  const ctrl: MapController = Container.get(MapController);
  app.use('/maps', route);

  route.get('/autocomplete', middlewares.isAuth, ctrl.getAutoComplete);

  route.post('/go', middlewares.isAuth, ctrl.goToPlace);
};
