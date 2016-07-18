/* MANAGER
 *
 * Adds new packs, checks for updates to packs, etc.
 */

var fs = require("fs");

var BASE_DIR = __dirname + "/../data";
var PACKS_DIR = BASE_DIR + "/packs";

var data = {
	"packs": [{ "title": "Test Pack", "desc": "A test pack. Yay!", "slug": "test-pack", "mods": [
		{ "title": "Applied Energistics 2", "desc": "A mod about applying energistics." },
		{ "title": "Blood Magic", "desc": "A mod about the darkest of the magic arts." }
	] }] // tmp
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
			fs.readdir(PACKS_DIR, function(err, files) {
				if (err) throw err;

				files.map(function(f) {
					fs.stat(PACKS_DIR + "/" + f, function(err, stats) {
						if (err) throw err;

						
					});
				})
			})
		}
	}
};

module.exports = manager;