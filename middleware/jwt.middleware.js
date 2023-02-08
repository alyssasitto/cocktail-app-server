const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
	// Get the token from the request object

	const token = req.body.token || req.headers.token;

	if (!token) {
		res.status(403).json({ err: "A token is required for authentication." });
		return;
	}

	const decoded = jwt.verify(token, process.env.TOKEN_KEY);

	if (!decoded) {
		res.status(401).json({ err: "Invalid token" });
	} else {
		req.user = decoded;
	}

	return next();
}

module.exports = isAuthenticated;
