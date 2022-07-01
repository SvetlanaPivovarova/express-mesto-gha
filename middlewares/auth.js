const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const ERROR_AUTH = require('../utils/utils');

const JWT_SECRET = 'SECRET_PROJECT';

const auth = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    throw new AuthError('Авторизация не успешна');
    // next(res.status(ERROR_AUTH).send({ error: 'Авторизация не успешна' }));
  } else {
    const token = cookies.jwt;
    let payload;

    // попытаемся верифицировать токен
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // next(err);
      // throw new AuthError('jwt token is not valid');
       next(res.status(ERROR_AUTH).send({ error: 'jwt token is not valid' }));
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;
