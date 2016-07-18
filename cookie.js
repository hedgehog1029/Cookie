var express = require("express"),
    crypto = require("crypto");

var manager = require("./lib/manager.js");

var app = express();

app.use(function(req, res, next) {
	res.set("Access-Control-Allow-Origin", "*");
	next();
});

app.get("/packs/list", function(req, res) {
	res.json({ status: "ok", packs: manager.packs.get() });
});

app.get("/packs/:slug", function(req, res) {
	var slug = req.params.slug;
	var pack = manager.packs.find(slug);

	if (pack == null)
		res.json({ status: "err", msg: "No pack exists with slug " + slug + "." });
	else
		res.json({ status: "ok", pack: pack });
});

app.listen(1343);
console.log("[Cookie] Listening web on ::1343");