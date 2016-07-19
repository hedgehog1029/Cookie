var request = require("request"),
	chalk = require("chalk"),
	jetpack = require("fs-jetpack"),
	md5 = require("js-md5"),
	yargs = require("yargs");

var api = request.defaults({
	baseUrl: "http://cookie.offbeatwit.ch/"
});

yargs
	.command("list", "list available packs", {}, function(argv) {
		console.log(chalk.magenta("Contacting server..."))
		api.get("/packs/list", { json: true }, function(err, status, res) {
			if (!err && status.statusCode == 200 && res.status == "ok") {
				console.log(chalk.green("Got packs list from server."));

				var packs = res.packs.map(function(pack) {
					return " - " + pack.title + "\n	- Slug: " + pack.slug
				})

				console.log(chalk.cyan("Packs:\n") + chalk.magenta(packs.join("\n")));
			}
		})
	})
	.command("download", "download or update a pack", {}, function(argv) {
		if (!argv._[1]) return false;

		var slug = argv._[1],
			pack = jetpack.cwd("dl").dir(slug);

		console.log(chalk.magenta("Contacting server..."))

		api.get("/packs/" + slug, { json: true }, function(err, status, res) {
			if (!err && status.statusCode == 200 && res.status == "ok") {
				console.log(chalk.magenta("Updating modpack " + res.pack.title + "..."));

				var mods = pack.dir("mods");
				res.pack.mods.forEach(function(mod) {
					var local = mods.file(mod.name).read(mod.name, "buffer");

					if (md5(local) != mod.hash) {
						console.log(chalk.yellow("Downloading " + mod.name + "..."));
						api.get("/packs/" + slug + "/mod/" + mod.name).pipe(mods.createWriteStream(mod.name));
					}
				})
			}
		});
	}).demand(1).alias("download", "update")
	.strict()
	.help("h").alias("h", "help").argv;
