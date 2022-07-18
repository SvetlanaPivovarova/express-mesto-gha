const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-error');

// роуты, не требующие авторизации
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[a-zA-Z\0-9]+\.[\w\d\-._~:?#[\]@!$&'()*+,;=]{2,}#?/),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// авторизация
router.use(auth);

// роуты, которым авторизация нужна
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

module.exports = router;
