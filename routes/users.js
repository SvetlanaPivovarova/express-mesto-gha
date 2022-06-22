const router = require("express").Router();


//router.get('/users', );

//router.get('/users/:id', );

const {
  userController,
  usersController,
  createUser,
  updateUserProfile
} = require("../controllers/users");

router.get("/", usersController);

router.get("/:id", userController);

router.post("/", createUser);

module.exports = router;

//PATCH /users/me — обновляет профиль
//PATCH /users/me/avatar — обновляет аватар