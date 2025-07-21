const uuid = require("uuid");
const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Ricardo Trevizo",
    email: "ricardotrevizo18@gmail.com",
    password: "mexico18",
  },
  {
    id: "u2",
    name: "Jenny Trevizo",
    email: "jennytrevizo18@gmail.com",
    password: "monsali",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signUpUser = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    return next(
      new HttpError("Email already exists, could not create user", 422)
    );
  }

  const createdUser = {
    id: uuid.v4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const logInUser = (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = DUMMY_USERS.find((p) => p.email === email);

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
