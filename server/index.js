const express = require('express');

// Variables
const port = process.env.PORT;
const server = require('./app');


//Listen
server  .listen(port, () => console.log("Server listening on port: " + port));
