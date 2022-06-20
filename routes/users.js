const router = require("express").Router();
const path = require("path");

const pathToFile = path.join(__dirname, "..", "data", "users.json")
const readFile = require("../utils/read-file");

router.get('/users', (req, res) => {
  readFile(pathToFile).then((data) => console.log(data));
});

//const {
//  userController,
//  usersController,
//  createUser,
//} = require("../controllers/users");

//router.get("/users", usersController);

//router.get("/users/:id", userController);

//router.post("/users", createUser);

module.exports = router;