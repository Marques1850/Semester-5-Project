import jwt from 'express-jwt';
import config from '../../../config';
import { json } from 'body-parser';
const expressJwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');


/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */
const getTokenFromHeader = req => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    const token = JSON.parse(req.headers.authorization.split(' ')[1]);
   
    return token.__raw;
  }
  return null;
};


const isAuth = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-0fx2f0gsk33505xi.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'g38QDAUhptuo2x8YT9VmfXIecW5sm2WA',
  issuer: 'https://dev-0fx2f0gsk33505xi.eu.auth0.com/',
  algorithms: ['RS256'],
  userProperty: 'token',
  getToken: getTokenFromHeader
});


export default isAuth;
