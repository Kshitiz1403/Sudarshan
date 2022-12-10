import { Router } from 'express';
import auth from './routes/auth';
import map from './routes/map';
import user from './routes/user';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  map(app);

  return app;
};
