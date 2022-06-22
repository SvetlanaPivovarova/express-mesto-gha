//const path = require("path");

const User = require('../models/user');
//const readFile = require("../utils/read-file");
//const pathToFile = path.join(__dirname, '..', 'data', 'users.json');

const usersController = (_req, res) => {
  User.find()
    .then((data) => res.send(data))
    .catch((_) => res.status(404).send({message: "No file"}));
};

const userController = (req, res) => {
  const { id } = req.params;
  User.findOne({ id })
    .then((data) => {
      if (!data) {
        throw new Error();
      }
      res.send(data)
    })
    .catch(() => res.status(404).send({ message: "No user"}));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log({ name, about, avatar });

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send(
      { message: 'Произошла ошибка' }
    ));
};

//const createUser = (req, res) => {
  //const { name, about, avatar } = req.body;
  //console.log({ name, about, avatar });
  //User.create({ name, about, avatar })
  //  .then((user) => res.send(user))
  //  .catch((err) => {
  //    if (err.name === 'ValidationError') {
   //     return res.status(400).send({ message: `Данные некорректны ${err.message}` });
   //   }
   //   return res.status(401).send({ message: 'Сервер не может обработать запрос' });
   // });
//};

module.exports = { userController, usersController, createUser };
