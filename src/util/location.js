require("dotenv").config();
const API_KEY = process.env.GOOGLE_GEOLOCATION_API_KEY;

const axios = require("axios");
const HttpError = require("../models/http-error");

const getCoordsForAddress = async (address) => {
  const response =
    await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}
    `);

  const data = response.data;

  if (!data || data.status === "ZERO RESULTS") {
    const error = new HttpError(
      "Could not find location for specified addresss",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAddress;
