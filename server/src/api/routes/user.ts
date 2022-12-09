import { IRequest, IResponse } from '@/api/types/express';
import { Router } from 'express';
import Container from 'typedi';
import { UserController } from '../controllers/userController';
import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {
  const ctrl: UserController = Container.get(UserController);
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, (req: IRequest, res: IResponse) => {
    return res.json({ user: req.currentUser }).status(200);
  });

  route.patch('/details', middlewares.isAuth, ctrl.completeDetails);
};
