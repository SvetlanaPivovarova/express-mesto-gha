const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.send(
    `<html>
        <body>
            <p>Ответ на сигнал из далёкого космоса</p>
        </body>
        </html>`
  );
});

app.get("*", (req, res) => {
  res.status(404).send( { message: "Not found"} );
});

app.listen(PORT, async () => {
  // подключаемся к серверу mongo
  mongoose.connection.on('connected', function () {
    console.log('mongodb connected!!!');
  });
  await mongoose.connect(
    'mongodb://localhost:27017/mestodb',
  );
  console.log(`App listening on port ${PORT}`);
});