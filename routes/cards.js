const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLikeToCard,
  deleteLikeFromCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', putLikeToCard);

router.delete('/:cardId/likes', deleteLikeFromCard);

module.exports = router;
