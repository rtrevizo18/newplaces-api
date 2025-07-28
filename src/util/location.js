const API_KEY = process.env.GOOGLE_GEOLOCATION_API_KEY;

const axios = require("axios");
const HttpError = require("../models/http-error");

const errorHandling = (data) => {
  switch (data.status) {
    case "ZERO_RESULTS":
    case "INVALID_REQUEST":
      throw new HttpError(
        "Could not find location for specified addresss",
        422
      );
    default:
      throw new HttpError(
        JSON.stringify(data) + "Creating place failed, please try again",
        500
      );
  }
};

const getCoordsForAddress = async (address) => {
  const response =
    await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}
    `);

  const data = response.data;

  if (data.status !== "OK") {
    errorHandling(data);
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAddress;
