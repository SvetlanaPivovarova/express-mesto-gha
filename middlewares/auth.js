const jwt = require('jsonwebtoken');
const { ERROR_AUTH } = require('../utils/utils');

const JWT_SECRET = 'SECRET_PROJECT';

const auth = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies) {
    next(res.status(ERROR_AUTH).send({error: 'Авторизация не успешна'}));
  } else {
    const token = cookies.jwt;
    let payload;

    // попытаемся верифицировать токен
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      next(res.status(ERROR_AUTH).send({error: 'jwt token is not valid'}));
    }
    req.user = payload;
    next();
  }


  // req.user = payload;

}

module.exports = auth;