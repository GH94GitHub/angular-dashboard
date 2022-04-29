const express = require('express');
const axios = require('axios');
const fs = require('fs');

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

// router.get("/icon", (req, res) => {

//   axios.get(`https://openweathermap.org/img/wn/${req.query.code}@2x.png`)
//     .then( resp => {
//       console.log(resp);

//       console.log(resp.data);
//       res.status(200).contentType('image/png').end(resp.data);
//     })
//     .catch( err => {
//       console.log(err);
//     });


// });
module.exports = router;
