const jwt = require('jsonwebtoken');
const { ERROR_AUTH } = require('../utils/utils');

const auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  console.log(authorization);
  console.log({"jwt": req.cookies.jwt});

  // убеждаемся, что он есть или начинается с Bearer
  //if (!authorization || !authorization.startsWith('Bearer ')) {
  //  return res
  //    .status(ERROR_AUTH)
  //    .send({ message: 'Необходима авторизация' });
  //}

  // извлечём токен
  //const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(req.cookies.jwt, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(ERROR_AUTH)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
}

module.exports = auth;