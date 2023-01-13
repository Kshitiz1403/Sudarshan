import { Router } from 'express';
import auth from './routes/auth';
import dustbin from './routes/dustbin';
import map from './routes/map';
import report from './routes/report';
import trip from './routes/trip';
import user from './routes/user';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  map(app);
  dustbin(app);
  trip(app);
  report(app);
  return app;
};
