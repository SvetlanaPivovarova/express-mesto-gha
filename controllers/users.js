const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthDataError = require('../errors/auth-data-error');
// const ValidationError = require('../errors/validation-error');

const JWT_SECRET = 'SECRET_PROJECT';

// возвращает всех пользователей
const getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// возвращает пользователя по _id
const getUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

// создаёт пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;

  if (!password || !email) {
    throw new BadRequestError('Укажите e-mail и пароль');
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AuthDataError('Такой пользователь уже существует');
      }

      return bcrypt.hash(password, saltRounds)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        })
          // вернём записанные в базу данные
          .then((userData) => {
            res.status(201).send({
              name: userData.name,
              about: userData.about,
              avatar: userData.avatar,
              email: userData.email,
              _id: userData._id,
            })})
          // данные не записались, вернём ошибку
          .catch(next))
        .catch(next);
    });
};

// получает из запроса почту и пароль и проверяет их
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Укажите e-mail и пароль');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
        () => res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
          .status(200).send({ token, _id: user._id }),
      );
      return token;
    })
    .catch(next);
};

// получает информацию о пользователе
const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

// обновляет профиль
const updateUserProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send({ data: user });
    })
    .catch(next);
};

// обновляет аватар
const updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  login,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
};
