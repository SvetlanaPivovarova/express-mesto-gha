const router = require("express").Router();


//router.get('/users', );

//router.get('/users/:id', );

const {
  userController,
  usersController,
  createUser
} = require("../controllers/users");

router.get("/", usersController);

router.get("/:id", userController);

router.post("/", createUser);

module.exports = router;