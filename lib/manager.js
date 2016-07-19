/* MANAGER
 *
 * Adds new packs, checks for updates to packs, etc.
 */

var jetpack = require("fs-jetpack"),
	S = require("string"),
	md5 = require("js-md5");

var BASE_DIR = __dirname + "/../data";
var PACKS_DIR = BASE_DIR + "/packs";

var data = {
	packs: []
}

var manager = {
	"packs": {
		"add": function(name, base) {

		},
		"get": function() {
			return data.packs;
		},
		"find": function(slug) {
			for (var i = data.packs.length - 1; i >= 0; i--) {
				if (data.packs[i].slug == slug)
					return data.packs[i];
			}

			return null;
		},
		"load": function() {
			var packs = jetpack.cwd(PACKS_DIR);

			console.log("Loading packs...");

			packs.listAsync().then(function(list) {
				data.packs = list.map(function(p) {
					var pack = packs.dir(p),
						mods = pack.dir("mods"),
						config = pack.dir("config");

					var modList = mods.list().map(function(mod) {
						return {
							name: mod,
							hash: md5(mods.read(mod, "buffer"))
						}
					});

					var confList = config.list().map(function(conf) {
						return {
							name: mod,
							hash: md5(config.read(conf, "utf8"))
						}
					})

					var packD = {
						title: p,
						slug: S(p).slugify().s,
						mods: modList,
						configs: confList
					}

					console.log("Loaded pack " + packD.title + ", slug " + packD.slug);

					return packD;
				})
			})
		},
		"file": function(p, type, file) {
			var pack = manager.packs.find(p);
			var packFiles = jetpack.cwd(PACKS_DIR).dir(pack.title);

			return packFiles.dir(type).createReadStream(file);
		}
	}
};

module.exports = manager;
