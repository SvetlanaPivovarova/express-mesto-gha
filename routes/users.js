const router = require('express').Router();

const {
  getUserById,
  getAllUsers,
  getUserInfo,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getUserInfo);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

router.get('/:id', getUserById);

module.exports = router;
