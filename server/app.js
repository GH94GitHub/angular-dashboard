const express = require('express');
const path = require('path');
const fs = require('fs');
const weatherAPI = require('./routes/weather');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "dist", "my-dashboard")));

// APIs
app.use("/api/weather", weatherAPI);

app.get('*', (req, res) => {
  const resp = fs.createReadStream(path.join(__dirname, "..", "dist", "my-dashboard", "index.html"));

  res.writeHead(200, {"Content-Type": "text/html"});
  resp.pipe(res);
});

module.exports = app;
