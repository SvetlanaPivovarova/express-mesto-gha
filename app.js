const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '62b287c446796a14239943d2',
  };

  next();
});

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
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
