
var   fs                = require('fs')
    , util              = require('util')
    , sh                = require('execSync')
    , exec              = require('child_process').exec
    , prompt            = require("prompt")
    /* CONSTANTS */
    , CONFIG_FILENAME   = ".config.json";

prompt.message = "mkdoc";
prompt.start();

/* Latex class */
var Latex = function (type) {

    function init() {
        fs.readdir(process.cwd(), function (err, files) {
            if (err) { throw err; }

            if (files.length > 0) {
                console.log("[ERROR] directory is not empty.");
                return;
            }

            var src_template = util.format("%s/templates/%s.tex", __dirname, type);
            var template = util.format("%s/main.tex", process.cwd());
            fs.readFile(src_template, function (err, data) {
                if (err) { throw err; }

                fs.writeFile(template, data, function() {
                    if (err) { throw err; }
                });
            });

            // create content.md file
            var content = util.format("%s/content.md", process.cwd());
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

    function view() {
        var config_filename = util.format("%s/%s", process.cwd(), CONFIG_FILENAME);
        fs.readFile(config_filename, function (err, data) {
            if (err) { throw err; }

            var config = JSON.parse(data);
            if (! config.chapters) {
                config.chapters = false;
            }
            var cmd = _safeListMarkdowFiles();
            exec(cmd, {cwd: process.cwd()}, function(err, stdout, stderr) {
                if (err) { throw err; }

                _compileBibtex();

                var files = stdout.trim().split("\n");
                for (var index in files) {
                    var basename = files[index].substr(0, files[index].length - 3); // path.basename(files[index], '.md');
                    sh.run(util.format(
                        "pandoc %s -t %s %s.md -o %s.tex",
                        (config.chapters ? "--chapters" : ""), config.type, basename, basename));
                }
                sh.run("pdflatex -shell-escape -interaction=nonstopmode main.tex");
                sh.run("xdg-open main.pdf");
                console.log("[ INFO] done.");
            });
        });
    }

    function cleanup() {
        // list all auxiliary files
        var ls = "ls | grep -E '\\.(aux|log|nav|out|snm|toc)$'";
        exec(ls, {cwd: process.cwd()}, function(err, stdout, stderr) {
            if (err) { throw err; }

            // show files to be deleted
            console.log(stdout);
            var args = stdout.trim().split("\n");

            prompt.get({
                properties: {
                    opt: {
                        message: "are you sure? y/[n]"
                    }
                }
            }, function(err, result) {
                // default option: no
                var opt = result.opt || "n";
                if (opt === "y") {
                    // TODO: check to see if any of the args have spaces in filename!
                    var rm = util.format("cd %s && rm %s", process.cwd(), args.join(' '));
                    sh.run(rm);
                }
            });
        });
    }

    /* private functions */

    /**
     * compile any existing bibtex files
     */
    function _compileBibtex() {
        var cmd = util.format("ls %s/*.bib", process.cwd());
        var code = sh.run(cmd); // exists any bibtex file?
        if (code === 0) {
            sh.run("bibtex main");
        }
    }

    /**
    * Get a ls command that's safe from dir not found error
    */
    function _safeListMarkdowFiles() {
        var cmd = "ls *.md";
        var result = sh.exec("ls chapters | grep -E '\\.(md)$' | wc -l");
        var count = parseInt(result.stdout);
        if (count > 0) {
            cmd += " chapters/*.md";
        }
        return cmd;
    }

    /* end of private functions */

    /* public functions */
    return {
        init: init,
        view: view,
        cleanup: cleanup
    };
};

exports = module.exports = Latex('latex');

exports.Latex = module.exports.Latex = Latex;
