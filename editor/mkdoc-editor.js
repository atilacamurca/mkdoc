
var exec = require('child_process').exec,
	fs = require('fs'),
	querystring = require('querystring');

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

exports.save = function(curdir, file, raw_data) {
	var filepath = curdir + '/' + file;
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

	// FIXME: only works for one parameter
	var json = querystring.parse(raw_data.toString());
	fs.writeFileSync(filepath, json.content);

	return JSON.stringify({
		content: json.content
	});
};

exports.load = function(curdir, file) {
	var content = fs.readFileSync(curdir + '/' + file, {encoding: 'utf-8'});
	return JSON.stringify({
		content: content
	});
};