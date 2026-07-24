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

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT; // 5001 on dev branch

const app = express();

app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://newplaces-e2d77.web.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
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
  .connect(URI)
  .then(() => {
    console.log("Database connection successful!");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
