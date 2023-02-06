const mongoose = require("mongoose");

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cocktail-app-server";

mongoose
	.connect(MONGODB_URI)
	.then((x) => {
		console.log(
			`Connected to Mongo. Database name: ${x.connections[0].name} ヾ(≧▽≦*)o`
		);
	})
	.catch((err) => {
		console.log("Error connecting to Mongo", err);
	});
