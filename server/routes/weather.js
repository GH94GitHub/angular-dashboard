const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get("", async (req, res) => {
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

module.exports = router;
