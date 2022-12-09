import { Jwt, JwtPayload, verify } from 'jsonwebtoken';
import config from '@/config';
import { Logger } from 'winston';
import Container from 'typedi';
import { IToken } from '@/interfaces/IToken';
import { INextFunction, IRequest, IResponse } from '@/api/types/express';

const getTokenFromHeader = (req): string => {
  console.log(req.headers.authorization)
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export const checkToken = (token: string, isAuth=true): IToken => {
  const Logger: Logger = Container.get('logger');
  if (!token && isAuth) throw "Token malformed";
  try{
    const decoded = verify(token, config.jwtSecret, {algorithms:[config.jwtAlgorithm]});
    return decoded;

  }catch(err){
    if (err.name === "TokenExpiredError"){
      /** @TODO here, we reissue the token using the refresh token from the database  */
    }
    
    Logger.error('🔥 Error in verifying token: %o', err);
    throw err;
  };
};

const isAuth = async (req: IRequest, res: IResponse, next: INextFunction) => {
  const Logger: Logger = Container.get('logger');
  
  try{
    const tokenFromHeader = getTokenFromHeader(req);
    const token = checkToken(tokenFromHeader);
    Logger.debug('User authenticated %o',token);

    req.currentUser = token;
    return next();
  }
  catch(e){
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default isAuth;
