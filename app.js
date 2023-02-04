const express = require("express");
const app = express();

require("./config")(app);
require("dotenv").config();

module.exports = app;
