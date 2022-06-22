const router = require("express").Router();


//router.get('/users', );

//router.get('/users/:id', );

const {
  userController,
  usersController,
  createUser,
  updateUserProfile,
  updateUserAvatar
} = require("../controllers/users");

router.get("/", usersController);

router.get("/:id", userController);

router.post("/", createUser);

router.patch('/me', updateUserProfile);

router.patch("/me/avatar", updateUserAvatar);

module.exports = router;

//PATCH /users/me — обновляет профиль
//PATCH /users/me/avatar — обновляет аватар