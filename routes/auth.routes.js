const router = require("express").Router();

const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middleware/jwt.middleware");

// Import User model
const User = require("../models/User.model");

// Import bcrypt for encrypting password
const bcrypt = require("bcryptjs");

router.post("/signup", (req, res) => {
	const { name, email, password } = req.body;

	// Check if any of the fields are an empty string. If any of them are send an error
	if (name === "" || email === "" || password === "") {
		return res
			.status(400)
			.json({ err: "Please add a name, email, and password." });
	}

	// Check if the email is written in a valid email format. If it's not send an error
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	console.log(email);
	if (!emailRegex.test(email)) {
		return res.status(400).json({ err: "Please enter a valid email address." });
	}

	// Check if the password meets all the requirements. If it doesn't send an error
	const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
	if (!passwordRegEx.test(password)) {
		return res.status(400).json({
			err: "Password must include: one uppercase letter, one lowercase letter, more than 8 characters, and at least one special character.",
		});
	}

	// Check if the email already exists in the database. If there's a user that exists send an error
	User.findOne({ email }).then((user) => {
		if (user) {
			return res.status(400).json({ err: "User already exists." });
		}
	});

	// If the user doesn't exist hash the password with bcryptjs
	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = bcrypt.hashSync(password, salt);

	// Create the new user with the hashed password
	User.create({
		name: name,
		email: email,
		password: hashedPassword,
		favorites: [],
	})
		.then(() => {
			return res.status(200).json({ message: "User has been created." });
		})
		.catch(() => {
			return res.status(400).json({ err: "Could not create user." });
		});
});

// Route for logging in
router.post("/login", (req, res) => {
	const { email, password } = req.body;

	if (email === "" || password === "") {
		return res.status(400).json({ err: "Please add an email and password." });
	}

	// Query through database and find user with email
	User.findOne({ email: email })
		.then((user) => {
			// If there is no user send an error
			if (!user) {
				return res.status(401).json({ err: "Could not verify credentials." });
			}

			//  Check if the password user types in matched the encrypted password in the database
			const passwordMatch = bcrypt.compareSync(password, user.password);

			// If password is not correct return an error
			if (!passwordMatch) {
				return res.status(401).json({ err: "Could not verify credentials." });
			}

			// If the password matches make a payload object with the users information
			const payload = {
				name: user.name,
				id: user._id,
				email: user.email,
			};

			// Create an access token with jwt, add the payload, and sign with token secret
			const token = jwt.sign(payload, process.env.TOKEN_KEY, {
				algorithm: "HS256",
				expiresIn: "1m",
			});

			// Create a refresh token with jwt, add the payload, and sign with refresh token secret
			const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
				algorithm: "HS256",
				expiresIn: "1d",
			});

			// Send the client the authorization token
			return res
				.status(200)
				.json({ authToken: token, refreshToken: refreshToken });
		})
		.catch(() => {
			// If there's an error connecting to the database send a server error
			return res.status(500).json({ err: "Server error" });
		});
});

router.get("/refresh", (req, res) => {
	const refreshToken = req.query.refresh_token;

	const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

	const payload = {
		name: decoded.name,
		id: decoded._id,
		email: decoded.email,
	};

	const token = jwt.sign(payload, process.env.TOKEN_KEY, {
		algorithm: "HS256",
		expiresIn: "1m",
	});

	if (!decoded) {
		return res.status(401).json({ err: "Invalid token." });
	}

	return res.status(200).json({ authToken: token });
});

router.get("/verify", isAuthenticated, (req, res) => {
	res.status(200).json(req.user);
});

router.get("/bunny", (req, res) => {
	console.log(req.query.color);
	res.status(200).json({ message: "yay" });
});

module.exports = router;
