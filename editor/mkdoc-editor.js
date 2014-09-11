
var exec = require('child_process').exec,
	fs = require('fs'),
	querystring = require('qs');

exports.view = function(curdir) {
	exec('mkdoc view', {cwd: curdir}, function(err, stdout, stderr) {
		if (err) {
			console.log(err);
		}
		return JSON.stringify({
			error: err,
			stdout: stdout
		});
	});
};

exports.save = function(curdir, raw_data) {
	var json = querystring.parse(raw_data);
	var filepath = curdir + '/' + json.file;
	var filepathbkp = filepath + "~";

	var exists = fs.existsSync(filepath);
	if (!exists) {
		return JSON.stringify({
			error: "Error: " + filepath + " not found!"
		});
	}

	var exists_bkp = fs.existsSync(filepathbkp);
	if (exists_bkp) {
		fs.unlinkSync(filepathbkp);
	}
	fs.linkSync(filepath, filepathbkp);
	fs.writeFileSync(filepath, json.content);

	return JSON.stringify({
		content: json.content
	});
};

exports.load = function(curdir, raw_data) {
	var json = querystring.parse(raw_data.toString());
	var content = fs.readFileSync(curdir + '/' + json.file, {encoding: 'utf-8'});
	return JSON.stringify({
		content: content
	});
};

exports.listPictures = function(curdir) {
	var imgdir = curdir + '/img';
	var exists_imgdir = fs.existsSync(imgdir);
	if (exists_imgdir) {
		var contents = fs.readdirSync(imgdir);
		var list = [];
		for (var i = 0; i < contents.length; i++) {
			if (/(\.png|\.jpg|\.jpeg)$/.test(contents[i])) {
				list.push(toListItemImgLink(contents[i]));
			}

			stats = fs.lstatSync(imgdir + "/" + contents[i]);
			if (stats.isDirectory()) {
				var subcontents = fs.readdirSync(imgdir + "/" + contents[i]);
				for (var j = 0; j < subcontents.length; j++) {
					if (/(\.png|\.jpg|\.jpeg)$/.test(subcontents[j])) {
						list.push(toListItemImgLink(contents[i] + "/" + subcontents[j]));
					}
				}
			}
		}
		return JSON.stringify({
			items: list
		});
	} else {
		fs.mkdirSync(imgdir, '0666');
		return JSON.stringify({
			error: 'No images found at ' + imgdir
		});
	}
}

function toListItemImgLink(filename) {
	return '<li><a href="#" onclick="return false;" class="picture">' + filename + '</a></li>';
}

exports.listFiles = function(curdir) {
	var exists = fs.existsSync(curdir);
	if (exists) {
		var files = fs.readdirSync(curdir);
		var list = [];
		for (var i = 0; i < files.length; i++) {
			if (/(\.md|\.bib)$/.test(files[i])
					|| "main.tex" === files[i]) {
				list.push(files[i]);
			}
		}

		var existsChapterFolder = fs.existsSync(curdir + "/chapters");
		if (existsChapterFolder) {
			var chapterFiles = fs.readdirSync(curdir + "/chapters");
			for (var i = 0; i < chapterFiles.length; i++) {
				if (/(\.md)$/.test(chapterFiles[i])) {
					list.push("chapters/" + chapterFiles[i])
				}
			}
		}
		
		return JSON.stringify({
			files: list
		});
	} else {
		return JSON.stringify({
			error: 'Markdown files not found at ' + curdir
		});
	}
}
