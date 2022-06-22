const router = require('express').Router();

const {
  userController,
  usersController,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', usersController);

router.get('/:id', userController);

router.post('/', createUser);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
