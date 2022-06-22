const User = require('../models/user');

// возвращает всех пользователей
const usersController = (req, res) => {
  User.find()
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по _id
const userController = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Данные некорректны ${err.message}. Проверьте id пользователя` });
      }
      return res.status(500).send({ message: 'Сервер не может обработать запрос' });
    });
};

// создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err.message}` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// обновляет профиль
const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params._id, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err.message}` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// обновляет аватар
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params._id, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(201).send({ data: user });
      //.then((user) => res.status(201).send({ data: user }))
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные при создании пользователя ${err.message}` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  userController,
  usersController,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
