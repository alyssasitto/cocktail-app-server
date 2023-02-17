const express = require("express");
const app = express();

require("./config")(app);
require("dotenv").config();
require("./db/index");

const authRouter = require("./routes/auth.routes");
app.use("/", authRouter);

const yelpRouter = require("./routes/yelp.routes");
app.use("/", yelpRouter);

module.exports = app;
