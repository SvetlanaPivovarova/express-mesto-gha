const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  ERROR_BAD_REQUEST, ERROR_AUTH, ERROR_NOT_FOUND, ERROR_DEFAULT,
} = require('../utils/utils');

const JWT_SECRET = 'SECRET_PROJECT';

// возвращает всех пользователей
const getAllUsers = (req, res) => {
  User.find()
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по _id
const getUserById = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: `Данные некорректны ${err.message}. Проверьте id пользователя` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

// создаёт пользователя
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const saltRounds = 10;

  if (!password || !email) {
    return res.status(ERROR_BAD_REQUEST).send({ message: 'Укажите e-mail и пароль' });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(ERROR_AUTH).send({ message: 'Такой пользователь уже существует' });
      }

      return bcrypt.hash(password, saltRounds)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        })
        // вернём записанные в базу данные
          .then(() => res.status(201).send({ data: user }))
        // данные не записались, вернём ошибку
          .catch((err) => {
            if (err.name === 'ValidationError') {
              return res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя ${err.message}` });
            }
            return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
          }));
    });
};

// получает из запроса почту и пароль и проверяет их
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(ERROR_BAD_REQUEST).send({ message: 'Укажите e-mail и пароль' });
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
    .catch((err) => {
      res.status(ERROR_AUTH).send({ message: err.message });
    });
};

// получает информацию о пользователе
const getUserInfo = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: `Данные некорректны ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

// обновляет профиль
const updateUserProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные при создании пользователя ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// обновляет аватар
const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    });
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
