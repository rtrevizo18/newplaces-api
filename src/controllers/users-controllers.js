const uuid = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");

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
  const createdUser = new User({
    name,
    email,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Guy_Sebastian_2014.jpg/500px-Guy_Sebastian_2014.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError(err + "Something went wrong, Could not sign up user", 500)
    );
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

  if (!foundUser || foundUser.password !== password) {
    return next(
      new HttpError("Email or password is incorrect. Please try again", 401)
    );
  }

  res.status(200).json({ user: foundUser });
};

exports.getUsers = getUsers;
exports.signUpUser = signUpUser;
exports.logInUser = logInUser;
