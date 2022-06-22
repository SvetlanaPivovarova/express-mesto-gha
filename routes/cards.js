const router = require("express").Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLikeToCard
} = require("../controllers/cards");

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', putLikeToCard);

module.exports = router;

//GET /cards — возвращает все карточки
//POST /cards — создаёт карточку
//DELETE /cards/:cardId — удаляет карточку по идентификатору
//PUT /cards/:cardId/likes — поставить лайк карточке
//DELETE /cards/:cardId/likes — убрать лайк с карточки