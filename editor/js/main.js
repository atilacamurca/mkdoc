$(function () {
	var openfile = "content.md";
	var doc = CodeMirror.fromTextArea(document.getElementById("editor"), {
		mode: "markdown",
		styleActiveLine: true,
		lineNumbers: true,
		lineWrapping: true,
		theme: 'lesser-dark',
		autofocus: true
	});

	// load content to the editor
	load();
	loadFileList();
	$('a[rel=tooltip],i[rel=tooltip],span[rel=tooltip],button[rel=tooltip]').tooltip({
		placement: "bottom"
	});

	// TODO: load preferences
	if (supports_html5_storage()) {
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

	$("#view").click(function () {
		view();
	});

	$("#save").click(function () {
		save();
	});

	$("#undo").click(function () {
		doc.undo();
		doc.focus();
	});

	$("#redo").click(function () {
		doc.redo();
		doc.focus();
	});

	$("#bt-code").click(function () {
		code();
	});

	$("#bt-link").click(function () {
		link();
	});

	$("#bt-picture").click(function () {
		picture();
	});

	$(document).delegate("a.picture", 'click', function () {
		var picture = $(this).html();
		var latex_figure = "\\begin{figure}\n\t\\includegraphics[scale=1.0]{img/"
			+ picture + "}\n\t\\caption{}\n\\end{figure}";
		var cursor = doc.getCursor('end');
		doc.setLine(cursor.line, latex_figure);
		doc.setCursor(cursor.line + 2, cursor.ch + 10);
		$('#modal-picture').modal('hide');
		doc.focus();
	});
	
	$(document).delegate('a.file', 'click', function() {
		save();
		openfile = $(this).attr('data-filename');
		load();
	});

	$(".bt-header").click(function () {
		var depth = $(this).attr("data-depth") + " ";
		header(depth);
	});

	$("#bt-bold").click(function () {
		bold();
	});

	$("#bt-italic").click(function () {
		italic();
	});

	function load() {
		$.post('/load', {file: openfile}, function (json) {
			var content = json.content;
			doc.setValue(content);
			if (/(\.tex$)/.test(openfile)) {
				doc.setOption("mode", "stex");
			} else if (/(\.md$)/.test(openfile)) {
				doc.setOption("mode", "markdown");
			}
		});
	}

	function save() {
		var content = doc.getValue();
		var save = $("#save");
		var save_text = save.html();
		save.attr("disabled", "disabled");
		save.html(loadindText());
		$.post('/save', {content: content, file: openfile},function (json) {
			if (json.error) {
				console.log(json.error);
			}
		}).complete(function () {
			setTimeout(function () {
				save.html(save_text);
				save.removeAttr("disabled");
				doc.focus();
			}, 100);
		});
	}

	function view() {
		var view = $("#view");
		var view_text = view.html();
		view.attr("disabled", "disabled");
		view.html(loadindText());
		$.post("/view", function (json) {
			console.log(json.error);
		}).complete(function () {
			setTimeout(function () {
				view.html(view_text);
				view.removeAttr("disabled");
				doc.focus();
			}, 2000);
		});
	}
	
	function loadFileList() {
		$.post("/list-files", function(json) {
			$("#file-list").empty();
			$("#file-list").append('<li class="nav-header">Files</li>');
			for (index in json.files) {
				$("#file-list").append(json.files[index]);
			}
		}).complete(function() {
			
		});
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
		}
	}

	function italic() {
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			doc.replaceSelection("*" + selected + "*");
			var cursor = doc.getCursor('end');
			doc.setCursor(cursor.line, cursor.ch);
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
			doc.setLine(cursor.line, line_content + "[]()");
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
				$("#picture-list").append(json.items);
			}
		});
	}

	// theme options
	$("a.theme").click(function () {
		var theme = $(this).attr("data-theme");
		var color = $(this).attr("data-color");
		doc.setOption("theme", theme);
		$("#cursor-highlight").html(".CodeMirror-activeline-background {background: "
			+ color + " !important;}");
		if (supports_html5_storage()) {
			localStorage.setItem("mkdoc.editor.theme", theme);
			localStorage.setItem("mkdoc.editor.color", color);
		}
	});

	// mousetrap
	Mousetrap.bindGlobal('ctrl+s', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		save();
	});

	Mousetrap.bindGlobal('ctrl+shift+v', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		view();
	});

	Mousetrap.bindGlobal('ctrl+b', function (e) {
		bold();
	});

	Mousetrap.bindGlobal('ctrl+i', function (e) {
		italic();
	});

	Mousetrap.bindGlobal('ctrl+1', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		header("# ");
	});

	Mousetrap.bindGlobal('ctrl+2', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		header("## ");
	});

	Mousetrap.bindGlobal('ctrl+3', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		header("### ");
	});

	Mousetrap.bindGlobal('ctrl+shift+c', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		code();
	});

	Mousetrap.bindGlobal('ctrl+shift+l', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		link();
	});

	Mousetrap.bindGlobal('ctrl+shift+p', function (e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
		$('#modal-picture').modal('show');
		picture();
	});

	// local storage
	function supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
});
