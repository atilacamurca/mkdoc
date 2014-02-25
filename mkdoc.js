#!/usr/bin/env node

var program 	= require('commander'),
	 fs 			= require("fs"),
	 util 		= require("util"),
	 path			= require("path"),
	 exec			= require('child_process').exec,
	 prompt		= require("prompt"),
	 sh 			= require('execSync');

var CONFIG_FILENAME = ".config.json",
	 SUPPORTED_TYPES = ['beamer', 'latex'];

prompt.message = "mkdoc";
prompt.start();

var mkdoc = function() {
	
	function init(type) {
		console.log("[ INFO] initializing project... ");
		type = type || "beamer";
		
		if (SUPPORTED_TYPES.indexOf(type) === -1) {
			console.log("[ERROR] Type %s not supported.", type);
			return;
		}
		
		fs.readdir(process.cwd(), function(err, files) {
			if (err) throw err;
			
			if(files.length === 0) {
				var src_template = util.format("%s/%s.tex", __dirname, type);
				var template = util.format("%s/main.tex", process.cwd());
				var content = util.format("%s/content.md", process.cwd());
				fs.readFile(src_template, function(err, data) {
					if (err) throw err;
					fs.writeFile(template, data, function() {
						if (err) throw err;
					});
				});
				// create content.md file
				fs.writeFile(content, "your text here", function(err) {
					if (err) throw err;
				});
				
				// config file
				var config = {"type": type};
				var config_filename = util.format("%s/%s", process.cwd(), CONFIG_FILENAME);
				fs.writeFile(config_filename, JSON.stringify(config), function(err) {
					if (err) throw err;
					console.log("[ INFO] done.");
				});
			} else {
				console.log("[ERROR] directory is not empty.");
			}
		});
	}
	
	function editor() {
		console.log("[ INFO] opening mkdoc-editor ... ");
		var cmd = util.format("cd %s/editor && nodemon server.js %s", __dirname, process.cwd());
		// FIXME: I change the order because the server block the xdg-open :(
		sh.run("xdg-open http://localhost:9669");
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
						if (err) throw err;
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
			if (err) throw err;
			var config = JSON.parse(data);
			exec("ls *.md", {cwd: process.cwd()}, function(err, stdout, stderr) {
				if (err) throw err;
				compileBibtex();
				var files = stdout.trim().split("\n");
				for (index in files) {
					var basename = path.basename(files[index], '.md');
					sh.run(util.format("pandoc -t %s %s.md -o %s.tex", config.type, basename, basename));
				}
				sh.run("pdflatex -shell-escape -interaction=nonstopmode main.tex");
				sh.run("xdg-open main.pdf");
			});
		});
	}
	
	function compileBibtex() {
		var cmd = util.format("ls %s/*.bib", process.cwd());
		var code = sh.run(cmd); // exists any bibtex file?
		if (code == 0) {
			sh.run("bibtex main");
		}
	}
	
	function docs() {
		console.log("[ INFO] opening docs ...");
		url = util.format("file://%s/editor/docs.html", __dirname);
		sh.run(util.format("xdg-open %s", url));
	}
	
	function cleanup() {
		console.log("[ INFO] cleaning up ...");
        // list all auxiliary files
		var ls = "ls | grep -E '\.(aux|log|nav|out|snm|toc)$'";
		exec(ls, {cwd: process.cwd()}, function(err, stdout, stderr) {
			if (err) throw err;
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
}();

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

if (!program.args.length) program.help();
