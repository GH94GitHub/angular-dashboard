const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get("/", async (req, res) => {
  const weatherResponse = await axios.get(process.env.OPENWEATHERAPI_URL, {
    params: {
      appId: process.env.OPENWEATHERAPI_KEY,
      lat: req.query.latitude,
      lon: req.query.longitude,
      units: 'imperial'
    }
  }).catch(err => {
    return res.status(500).json(err.response.data.message);
  });

  return res.json(weatherResponse.data);
});

router.get("/icon", async (req, res) => {
  // icon url: https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png
  const currentWeatherIconStream = await axios.get(`https://openweathermap.org/img/wn/${req.query.code}@2x.png`);
  currentWeatherIconStream.pipe(res);
});
module.exports = router;
