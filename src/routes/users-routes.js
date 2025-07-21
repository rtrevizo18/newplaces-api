const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isStrongPassword(),
  ],
  usersControllers.signUpUser
);

router.post("/login", usersControllers.logInUser);

module.exports = router;
