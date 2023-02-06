const express = require("express");
const app = express();

require("./config")(app);
require("dotenv").config();
require("./db/index");

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

module.exports = app;
