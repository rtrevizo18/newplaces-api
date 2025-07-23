const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  usersControllers.signUpUser
);

router.post("/login", usersControllers.logInUser);

module.exports = router;
