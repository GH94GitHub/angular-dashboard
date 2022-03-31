const express = require('express');
const weatherAPI = require('./routes/weather');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs
app.use("/api/weather", weatherAPI);

module.exports = app;
