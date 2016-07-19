var express = require("express");

var manager = require("./lib/manager.js");

var app = express();

manager.packs.load();

app.use(function(req, res, next) {
	res.set("Access-Control-Allow-Origin", "*");
	next();
});

app.get("/cookie/reload", function(req, res) {
	manager.packs.load();

	res.send({ status: "ok", msg: "Packs reloaded successfully." });
})

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

app.get("/packs/:slug/mod/:file", function(req, res) {
	var slug = req.params.slug,
		file = req.params.file;

	manager.packs.file(slug, "mods", file).pipe(res);
});

app.listen(1343);
console.log("[Cookie] Listening web on ::1343");
