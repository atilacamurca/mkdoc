var editor = function() {
	
	var openfile = "content.md",
		doc,
		DEF_TEXT = {
			save: '<i class="icon-save"></i> Save',
			view: '<i class="icon-eye-open"></i> View',
		};
	
	/**
	 * @param doc_ref document reference
	 * hack: CodeMirror could not be initialized inside this object!
	 */
	function init(doc_ref) {
		doc = doc_ref;
	}
	
	function load(file) {
		openfile = file || openfile;
		$.post('/load', {file: openfile}, function (json) {
			var content = json.content;
			doc.setValue(content);
			if (/(\.tex|\.bib)$/.test(openfile)) {
				doc.setOption("mode", "stex");
			} else if (/(\.md)$/.test(openfile)) {
				doc.setOption("mode", "markdown");
			}
			struct.parse(doc);
			// if the document changes and an undo is called
			// the history from the previous document is used
			// causing data loss...
			doc.clearHistory();
		});
	}
	
	function save() {
		var content = doc.getValue();
		var save = $("#save");
		save.attr("disabled", "disabled");
		save.html(loadindText());
		$.post('/save', {content: content, file: openfile},function (json) {
			if (json.error) {
				console.log(json.error);
			}
		}).complete(function () {
			setTimeout(function () {
				save.html(DEF_TEXT.save);
				save.removeAttr("disabled");
				struct.parse(doc);
				doc.focus();
			}, 500);
		});
	}
	
	function view() {
		var view = $("#view");
		view.attr("disabled", "disabled");
		view.html(loadindText());
		$.post("/view", function (json) {
			console.log(json.error);
		}).complete(function () {
			setTimeout(function () {
				view.html(DEF_TEXT.view);
				view.removeAttr("disabled");
				doc.focus();
			}, 2000);
		});
	}
	
	function loadFileList() {
		$.post("/list-files", function(json) {
			var ul = $("#file-list");
			ul.empty();
			ul.append('<li class="nav-header">Files</li>');
			for (index in json.files) {
				var a = $("<a/>", {
					html: json.files[index],
					class: "file",
					onclick: "return false;",
					href: "#",
					"data-filename": json.files[index]
				});
				var li = $("<li/>", {html: a});
				if (json.files[index] === openfile) {
					li.attr("class", "active");
				}
				ul.append(li);
			}
		});
	}
	
	function loadPreferences() {
		if (_supports_html5_storage()) {
			var theme = localStorage.getItem("mkdoc.editor.theme");
			if (theme !== null) {
				doc.setOption("theme", theme);
			}

			var color = localStorage.getItem("mkdoc.editor.color");
			if (color !== null) {
				$("#cursor-highlight").html(".CodeMirror-activeline-background {background: "
					+ color + " !important;}");
			}
		}
	}
	
	function loadindText() {
		return '<i class="icon-spinner icon-spin"></i> Loading...';
	}
	
	function bold() {
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			doc.replaceSelection("**" + selected + "**");
			var cursor = doc.getCursor('end');
			doc.setCursor(cursor.line, cursor.ch);
			doc.focus();
		} else {
			var cursor = doc.getCursor();
			var line = doc.getLine(cursor.line);
			var bold = "****";
			var content = [line.slice(0, cursor.ch), bold, line.slice(cursor.ch)].join('');
			doc.setLine(cursor.line, content);
			doc.setCursor(cursor.line, cursor.ch + 2);
			doc.focus();
		}
	}
	
	function italic() {
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			doc.replaceSelection("_" + selected + "_");
			var cursor = doc.getCursor('end');
			doc.setCursor(cursor.line, cursor.ch);
			doc.focus();
		} else {
			var cursor = doc.getCursor();
			var line = doc.getLine(cursor.line);
			var italic = "__";
			var content = [line.slice(0, cursor.ch), italic, line.slice(cursor.ch)].join('');
			doc.setLine(cursor.line, content);
			doc.setCursor(cursor.line, cursor.ch + 1);
			doc.focus();
		}
	}

	function header(content) {
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			doc.replaceSelection(content + selected);
			var cursor = doc.getCursor('end');
			doc.setCursor(cursor.line, cursor.ch);
			doc.focus();
		} else {
			var cursor = doc.getCursor('end');
			doc.setLine(cursor.line, content);
			doc.setCursor(cursor.line, cursor.ch + content.length);
			doc.focus();
		}
	}

	function code() {
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			if (selected.indexOf("\n") !== -1) {
				doc.replaceSelection("~~~\n" + selected + "\n~~~");
			} else {
				doc.replaceSelection("`" + selected + "`");
			}
			doc.focus();
		} else {
			var cursor = doc.getCursor('start');
			var line_content = doc.getLine(cursor.line);
			doc.setLine(cursor.line, line_content + "~~~\n\n~~~");
			doc.setCursor(cursor.line + 1, 0);
			doc.focus();
		}
	}

	function link() {
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			doc.replaceSelection("[" + selected + "]()");
			var cursor = doc.getCursor('end');
			doc.setCursor(cursor.line, cursor.ch - 1);
			doc.focus();
		} else {
			var cursor = doc.getCursor('start');
			var line_content = doc.getLine(cursor.line);
			doc.setLine(cursor.line, line_content + "[description]()");
			doc.setCursor(cursor.line, cursor.ch + 3);
			doc.focus();
		}
	}

	function picture() {
		$.get('/list_pictures', function(json) {
			$("#picture-list").html("");
			if (json.error) {
				$("#modal-error").html(json.error).show();
			} else {
				if (json.items.length === 0) {
					$("#modal-warning").html("directory img/ is empty.").show();
				} else {
					$("#picture-list").append(json.items);
				}
			}
		});
	}
	
	function setTheme(theme, line_color) {
		doc.setOption("theme", theme);
		$("#cursor-highlight").html(".CodeMirror-activeline-background {background: "
			+ line_color + " !important;}");
		if (_supports_html5_storage()) {
			localStorage.setItem("mkdoc.editor.theme", theme);
			localStorage.setItem("mkdoc.editor.color", line_color);
		}
	}
	
	/* private functions */
	
	function _supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
	
	/* public functions and variables */
	return {
		//openfile: openfile,
		init: init,
		load: load,
		save: save,
		view: view,
		loadindText: loadindText,
		bold: bold,
		italic: italic,
		header: header,
		code: code,
		link: link,
		picture: picture,
		setTheme: setTheme,
		loadFileList: loadFileList,
		loadPreferences: loadPreferences,
	};
}();