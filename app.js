const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { ERROR_NOT_FOUND } = require('./utils/utils');
const auth = require('./middlewares/auth');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser()); // подключаем парсер cookie

// роуты, не требующие авторизации
app.post('/signup', createUser);
app.post('/signin', login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
});

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message, name } = err; // если у ошибки нет статуса, выставляем 500

  if (name === 'UserAlreadyExists') {
    res.status(statusCode).send({ message });
  }

  if (name === 'CastError') {
    res.status(statusCode).send({ message: `Данные некорректны ${message}` });
  }

  if (name === 'ValidationError') {
    res.status(statusCode).send({ message: `Переданы некорректные данные при создании пользователя ${message}` });
  }

  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, async () => {
  // подключаемся к серверу mongo
  mongoose.connection.on('connected', () => {
    // console.log('mongodb connected!!!');
  });
  await mongoose.connect(
    'mongodb://localhost:27017/mestodb',
  );
  // console.log(`App listening on port ${PORT}`);
});
