import { IRateLimit } from '@/interfaces/IRateLimit';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import Container from 'typedi';
import cache from '@/loaders/cache';

const rateLimit = ({ secondsWindow = 60, allowedHits = 10 }: IRateLimit) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const pathUrl = `${req.method} - ${req.baseUrl}${req.path}`;
    const key = `${pathUrl}${ip}`;

    const requests = await cache.incr(key);

    let ttl;

    if (requests === 1) {
      await cache.expire(key, secondsWindow);
      ttl = 60;
    } else {
      ttl = await cache.ttl(key);
    }

    if (requests > allowedHits) {
      const logger: Logger = Container.get('logger');
      logger.warn(`Rate limiting the ip ${ip} for ${pathUrl}`);

      return next({ status: 429, message: `You have been rate limited, please try again in ${ttl} seconds.` });
    }
    return next();
  };
};

export default rateLimit;
