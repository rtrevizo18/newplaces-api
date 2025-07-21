const express = require("express");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post("/signup", usersControllers.signUpUser);

router.post("/login", usersControllers.logInUser);

module.exports = router;
