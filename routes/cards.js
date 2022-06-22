const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard
} = require("../controllers/cards");

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

module.exports = router;

//GET /cards — возвращает все карточки
//POST /cards — создаёт карточку
//DELETE /cards/:cardId — удаляет карточку по идентификатору