const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');

// возвращает все карточки
const getCards = (req, res, next) => {
  Card.find()
    .then((data) => res.status(200).send(data))
    .catch(next);
};

// создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

// удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

// поставить лайк карточке
const putLikeToCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

// убрать лайк с карточки
const deleteLikeFromCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikeToCard,
  deleteLikeFromCard,
};
