if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { deleteImage } = require("./util/aws");

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PSWD;
const MONGODB_DB = process.env.MONGODB_DB;

const url = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@placescluster0.ydq4ewd.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority&appName=PlacesCluster0`;

const PORT = process.env.PORT; // 5001 on dev branch

const app = express();

app.use(bodyParser.json());

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

app.use(async (error, req, res, next) => {
  if (req.file && req.file.s3key) {
    try {
      await deleteImage(req.file.s3key);
    } catch (err) {
      console.log("Failed to delete image from S3");
    }
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
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
