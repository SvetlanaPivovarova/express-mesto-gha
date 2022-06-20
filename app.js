const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

//GET /users — возвращает всех пользователей
//GET /users/:userId - возвращает пользователя по _id
//POST /users — создаёт пользователя

//app.use('/users', getUsers);
//app.use('/users/:userId', getUser);
//app.use('/users', createUser);

//app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.send(
    `<html>
        <body>
            <p>Ответ на сигнал из далёкого космоса</p>
        </body>
        </html>`
  );
});

app.use('/', userRouter);

app.get("*", (req, res) => {
  res.status(404).send({ message: "Not found"});
})

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mydb');

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
})