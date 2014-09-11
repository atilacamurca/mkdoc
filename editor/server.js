
var http = require('http'),
      url = require('url'),
      editor = require('./mkdoc-editor.js'),
      fs = require('fs'),
      path = require('path'),
      qs = require('qs'),
		cwd = process.argv[2];

http.createServer(function(req, res) {
   var _path = url.parse(req.url, true);
   var query = _path.query;
   var pathname = _path.pathname;
   
   if (pathname === '/view') {
      res.writeHead(200, {"Content-Type": "text/json"});
      var result = editor.view(cwd);
		res.end(result);
   } else if (pathname === '/save') {
		var body = '';
		req.on('data', function(raw_data) {
			body += raw_data;
			// Too much POST data, kill the connection!
         if (body.length > 1e6) {
				// TODO: really kill the connection :)
				console.log("too much data ...");
			}
		});
		req.on('end', function () {
			res.writeHead(200, {"Content-Type": "text/json"});
			var result = editor.save(cwd, body);
			res.write(result);
			res.end();
		});
	} else if (pathname === '/load') {
		req.on('data', function(raw_data) {
			res.writeHead(200, {"Content-Type": "text/json"});
			var result = editor.load(cwd, raw_data);
			res.end(result);
		});
	} else if (pathname === '/list_pictures') {
		res.writeHead(200, {"Content-Type": "text/json"});
		var result = editor.listPictures(cwd);
		res.end(result);
	} else if (pathname === '/list-files') {
		res.writeHead(200, {"Content-Type": "text/json"});
		var result = editor.listFiles(cwd);
		res.end(result);
   } else {
      // http://ericsowell.com/blog/2011/5/6/serving-static-files-from-node-js
      var filePath = '.' + pathname;
      if (filePath == './') {
         filePath = './index.html';
      }
        
      var extname = path.extname(filePath);
      var contentType = 'text/html';
      switch (extname) {
         case '.js':
            contentType = 'text/javascript';
            break;
         case '.css':
            contentType = 'text/css';
            break;
         case '.woff':
            // http://stackoverflow.com/questions/2871655/proper-mime-type-for-fonts
            contentType = 'application/x-font-woff';
            break;
      }
      
      fs.exists(filePath, function(exists) {
         if (exists) {
            fs.readFile(filePath, function(error, content) {
               if (error) {
                  res.writeHead(500);
                  res.end();
               } else {
                  res.writeHead(200, { 'Content-Type': contentType });
                  res.end(content, 'utf-8');
               }
            });
         } else {
            res.writeHead(404);
            res.end();
         }
      });
   }
}).listen(9669);

console.log("Server is running in http://localhost:9669 ...");
