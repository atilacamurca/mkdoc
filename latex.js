
var fs = require('fs')
    , util = require('util')
    , CONFIG_FILENAME = ".config.json";

var latex = (function () {

    var type = 'latex';

    function init() {
        fs.readdir(process.cwd(), function (err, files) {
            if (err) { throw err; }

            if (files.length > 0) {
                console.log("[ERROR] directory is not empty.");
            }

            var src_template = util.format("%s/%s.tex", __dirname, type);
            var template = util.format("%s/main.tex", process.cwd());
            var content = util.format("%s/content.md", process.cwd());
            fs.readFile(src_template, function (err, data) {
                if (err) { throw err; }
                fs.writeFile(template, data, function() {
                    if (err) { throw err; }
                });
            });
            // create content.md file
            fs.writeFile(content, "your text here", function (err) {
                if (err) { throw err; }
            });

            // config file
            var config = {
                "type": type,
                "chapters": false
            };
            var config_filename = util.format("%s/%s", process.cwd(), CONFIG_FILENAME);
            fs.writeFile(config_filename, JSON.stringify(config, undefined, ' '), function(err) {
                if (err) { throw err; }
                console.log("[ INFO] done.");
            });
        });
    }

    return {
        init: init
    };
})();

exports = module.exports = latex;
