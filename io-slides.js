
var   fs                = require('fs')
    , util              = require('util')
    , ncp               = require('ncp').ncp
    , exec              = require('child_process').exec
    //, prompt            = require("prompt")
    /* CONSTANTS */
    , CONFIG_FILENAME   = ".config.json";

var IoSlides = (function() {

    var type = 'io-slides';

    function init() {
        fs.readdir(process.cwd(), function (err, files) {
            if (err) { throw err; }

            if (files.length > 0) {
                console.log("[ERROR] directory is not empty.");
                return;
            }

            // copy files from templates/io-slides
            var sourceDir = util.format('%s/templates/io-slides', __dirname);
            ncp(sourceDir, process.cwd(), function (err) {
                if (err) { throw err; }
            });

            // create content.md file
            var contentFilename = util.format("%s/content.md", process.cwd());
            var defaultContent = "title: Slide Title\n" +
                                 "subtitle: Subtitle\n\n" +
                                 "your text here\n\n---\n\n";
            fs.writeFile(contentFilename, defaultContent, function (err) {
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

    function view() {
        var cmd = util.format("python %s/render-io-slides.py", __dirname);
        exec(cmd, {cwd: process.cwd()}, function (err, stdout /* , stderr */) {
            if (err) { throw err; }

            console.log(stdout);
            // sh("firefox presentation-output.html");
            console.log("[ INFO] done.");
        });
    }

    function cleanup() {
        console.log('[ INFO] Nothing to care about.');
    }

    /* public functions */
    return {
        init: init,
        view: view,
        cleanup: cleanup
    };
})();

module.exports = IoSlides;
