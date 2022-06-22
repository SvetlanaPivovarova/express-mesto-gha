const Card = require('../models/card');

//возвращает все карточки
const getCards = (req, res) => {
  Card.find()
    .then((data) => res.send(data))
    .catch(() => res.status(404).send({message: "No file"}));
};

//создаёт карточку
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

//удаляет карточку по идентификатору
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

//поставить лайк карточке
const putLikeToCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

//убрать лайк с карточки
const deleteLikeFromCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLikeToCard,
  deleteLikeFromCard
};