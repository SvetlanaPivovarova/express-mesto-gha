const Card = require('../models/card');

// возвращает все карточки
const getCards = (req, res) => {
  Card.find()
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Данные не найдены' });
      }
      return res.status(200).send(data);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создаёт карточку
const createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  // const owner = req.user._id;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные при создании карточки ${err.message}` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(400).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

// поставить лайк карточке
const putLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Некорректные данные ${err.message}` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// убрать лайк с карточки
const deleteLikeFromCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Некорректные данные ${err.message}` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikeToCard,
  deleteLikeFromCard,
};
