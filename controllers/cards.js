const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find()
    .then((data) => res.send(data))
    .catch(() => res.status(404).send({message: "No file"}));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  console.log({ name, link, owner });

  Card.create({ name, link, owner })
    // вернём записанные в базу данные
    .then(card => res.send({ data: card }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send(
      { message: 'Произошла ошибка' }
    ));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = { getCards, createCard, deleteCard };