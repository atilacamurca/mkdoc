#!/usr/bin/env node

var program 	= require('commander'),
	 fs 		= require("fs"),
	 util 		= require("util"),
	 path		= require("path"),
	 exec		= require('child_process').exec,
	 prompt		= require("prompt"),
	 sh 		= require('execSync');

var CONFIG_FILENAME = ".config.json",
	 SUPPORTED_TYPES = ['beamer', 'latex', 'io-slides'];

prompt.message = "mkdoc";
prompt.start();

var mkdoc = (function() {

	function init(type) {
		console.log("[ INFO] initializing project... ");
		type = type || "beamer";

		if (SUPPORTED_TYPES.indexOf(type) === -1) {
			console.log("[ERROR] Type %s not supported.", type);
			return;
		}

		var callback = _presentationType(type);
		callback.init();
	}

	function editor() {
		console.log("[ INFO] opening mkdoc-editor ... ");
		// FIXME: I change the order because the server block the xdg-open :(
		// TODO: make a callback function to call xdg-open before server starts!
		var cmd = util.format("xdg-open http://localhost:9669 && cd %s/editor && nodemon server.js %s", __dirname, process.cwd());
		sh.run(cmd);
	}

	function edit(file) {
		file = file || "content.md";
		console.log("[ INFO] editing '%s' ...", file);

		var extname = path.extname(file);
		if (extname !== ".md" && file !== "main.tex")	{
			console.log("[ INFO] you should open only markdown files (.md)");
		}

		fs.exists(file, function (exists) {
			if (exists) {
				prompt.get({
					properties: {
						app: {
							description: "open with [blank for default]"
						}
					}
				}, function(err, result) {
					result.app = result.app || "xdg-open";
					// TODO: look for another way to detach the process from the console
					// gedit detach himself :)
					var cmd = util.format("%s %s &", result.app, file);
					exec(cmd, function(err, stdout, stderr) {
						if (err) { throw err; }
					});
				});
			} else {
				console.log(util.format("[ERROR] file '%s' not found.", file));
			}
		});
	}

	function view() {
		console.log("[ INFO] compiling project ...");
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
				compileBibtex();
				var files = stdout.trim().split("\n");
				for (var index in files) {
					console.log("file:", files[index]);
					var basename = files[index].substr(0, files[index].length - 3); // path.basename(files[index], '.md');
					console.log("basename:", basename);
					sh.run(util.format(
						"pandoc %s -t %s %s.md -o %s.tex",
						(config.chapters ? "--chapters":""), config.type, basename, basename));
				}
				sh.run("pdflatex -shell-escape -interaction=nonstopmode main.tex");
				sh.run("xdg-open main.pdf");
			});
		});
	}

	function compileBibtex() {
		var cmd = util.format("ls %s/*.bib", process.cwd());
		var code = sh.run(cmd); // exists any bibtex file?
		if (code === 0) {
			sh.run("bibtex main");
		}
	}

	function docs() {
		console.log("[ INFO] opening docs ...");
		var url = util.format("file://%s/editor/docs.html", __dirname);
		sh.run(util.format("xdg-open %s", url));
	}

	function cleanup() {
		console.log("[ INFO] cleaning up ...");
        // list all auxiliary files
		var ls = "ls | grep -E '\\.(aux|log|nav|out|snm|toc)$'";
		exec(ls, {cwd: process.cwd()}, function(err, stdout, stderr) {
			if (err) { throw err; }
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

	function template() {
		edit("main.tex");
	}

	/* private functions */

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

	/**
	 * call require based on type, if type is undefined read the .config.json file.
	 * @param {[String]} type [presentation file (optional)]
	 */
	function _presentationType(type) {
		if (!type) {
			var config_filename = util.format("%s/%s", process.cwd(), CONFIG_FILENAME);
			var data = fs.readFileSync(config_filename);
			var config = JSON.parse(data);
			type = config.type;
		}
		return require("./" + type + ".js");
	}

	/* end of private functions */

	/* public functions */
	return {
		init: init,
		editor: editor,
		edit: edit,
		view: view,
		docs: docs,
		cleanup: cleanup,
		template: template,
	};
})();

program.version("1.0.0");
program.command("init [type]")
		.description("start a new project in an empty directory")
		.action(mkdoc.init);
program.command("editor")
		.description("open a web editor")
		.action(mkdoc.editor);
program.command("edit [file]")
		.description("open file to edit")
		.action(mkdoc.edit);
program.command("template")
		.description("open template file to edit")
		.action(mkdoc.template);
program.command("view")
		.description("compile files and open pdf")
		.action(mkdoc.view);
program.command("docs")
		.description("show the documentation of mkdoc in the browser")
		.action(mkdoc.docs);
program.command("cleanup")
		.description("remove log and aux files")
		.action(mkdoc.cleanup);

program.parse(process.argv);

if (!program.args.length) { program.help();}
