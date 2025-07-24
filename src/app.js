require("dotenv").config();
const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PSWD;
const MONGODB_DB_NAME = "mern";

const url = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@placescluster0.ydq4ewd.mongodb.net/${MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=PlacesCluster0`;

const app = express();

app.use(bodyParser.json());

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "..", "uploads", "images"))
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes); // => /api/places

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log("Error occurred, image deleted");
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(url)
  .then(() => {
    console.log("Database connection successful!");
    app.listen(5001);
  })
  .catch((err) => {
    console.log(err);
  });
