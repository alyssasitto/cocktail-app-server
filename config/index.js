const express = require("express");

const logger = require("morgan");

const cookieParser = require("cookie-parser");

const cors = require("cors");

module.exports = (app) => {
	app.use(logger("dev"));

	app.use(
		cors({
			origin: process.env.ORIGIN || "http://localhost:3000",
		})
	);

	app.use(cookieParser());

	app.use(express.urlencoded({ extended: false }));

	app.use(express.json());
};
