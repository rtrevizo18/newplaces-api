const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendImage } = require("../util/aws");

const JWT_SECRET = process.env.JWT_SECRET;

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not fetch users.", 500)
    );
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs. Please check your data", 422));
  }

  const { name, email, password } = req.body;

  let hasUser;

  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, Could not sign up user", 500)
    );
  }

  if (hasUser) {
    return next(
      new HttpError("Email already exists, could not create user", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  try {
    await sendImage(req);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.s3key,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError(err + "Something went wrong, Could not sign up user", 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return next(
      new HttpError(err + "Something went wrong, Could not sign up user", 500)
    );
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token });
};

const logInUser = async (req, res, next) => {
  const { email, password } = req.body;

  let foundUser;

  try {
    foundUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, Could not log in user", 500)
    );
  }

  if (!foundUser) {
    return next(
      new HttpError("Email or password is incorrect. Please try again", 403)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, foundUser.password);
  } catch (err) {
    return next(new HttpError("Could not log you in, please try again.", 500));
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Email or password is incorrect. Please try again", 403)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  } catch (err) {
    return next(
      new HttpError("Something went wrong, Could not log in user", 500)
    );
  }

  res.status(200).json({ userId: foundUser.id, email: foundUser.email, token });
};

exports.getUsers = getUsers;
exports.signUpUser = signUpUser;
exports.logInUser = logInUser;
