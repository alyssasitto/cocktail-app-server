const router = require("express").Router();

const yelp = require("yelp-fusion");
const client = yelp.client(process.env.YELP_API_KEY);

router.post("/search", (req, res) => {
	console.log(req.body);

	const searchRequest = {
		term: req.body.searchItem,
		location: req.body.address,
		limit: req.body.limit ? req.body.limit : "20",
	};

	client
		.search(searchRequest)
		.then((response) => {
			res.status(200).json(response.jsonBody);
		})
		.catch((e) => {
			console.log(e);
			res.status(400).json({ err: "something went wrong" });
		});
});

router.get("/business/:id", (req, res) => {
	const id = req.params.id;

	client
		.business(id)
		.then((response) => {
			res.status(200).json(response.jsonBody);
		})
		.catch((err) => {
			res.status(400).json({ err: "Something went wrong" });
		});
});

module.exports = router;
