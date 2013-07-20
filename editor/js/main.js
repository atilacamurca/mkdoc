
$(function() {
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
	$('a[rel=tooltip],i[rel=tooltip],span[rel=tooltip],button[rel=tooltip]').tooltip({
		placement: "bottom"
	});

	// TODO: load preferences
	/*if (supports_html5_storage()) {
		var theme = localStorage.getItem("mkdoc.editor.theme");
		doc.setOption("theme", theme);
		var color = localStorage.getItem("mkdoc.editor.color");
		$("#cursor-highlight").html(".CodeMirror-activeline-background {background: "
			+ color + " !important;}");
	}*/

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
		// TODO: verificar se o texto selecionado possui multiplas linhas e colocar "~~~"
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			console.log(selected.indexOf("\n"));
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
	});

	$("#bt-link").click(function () {
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
	});

	$(".bt-header").click(function () {
		var depth = $(this).attr("data-depth") + " ";
		if (doc.somethingSelected()) {
			var selected = doc.getSelection();
			doc.replaceSelection(depth + selected);
			var cursor = doc.getCursor('end');
			doc.setCursor(cursor.line, cursor.ch);
			doc.focus();
		} else {
			var cursor = doc.getCursor('end');
			doc.setLine(cursor.line, depth);
			doc.setCursor(cursor.line, cursor.ch);
			doc.focus();
		}
	});

	$("#bt-bold").click(function () {
		bold();
	});

	$("#bt-italic").click(function () {
		italic();
	});

	function load() {
		$.post('/load', function (json) {
			var content = json.content;
			doc.setValue(content);
		});
	}

	function save() {
		var content = doc.getValue();
		var save = $("#save");
		var save_text = save.html();
		save.attr("disabled", "disabled");
		save.html(loadindText());
		$.post('/save', {content: content}, function (json) {
			if (json.error) {
				console.log(json.error);
			}
		}).complete(function () {
			setTimeout(function () {
				save.html(save_text);
				save.removeAttr("disabled");
				doc.focus();
			}, 1000);
		});
	}

	function view() {
		var view = $("#view");
		var view_text = view.html();
		view.attr("disabled", "disabled");
		view.html(loadindText());
		$.post("/view",function (json) {
			console.log(json.error);
		}).complete(function () {
			setTimeout(function () {
				view.html(view_text);
				view.removeAttr("disabled");
				doc.focus();
			}, 2000);
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

	// theme options
	$("a.theme").click(function () {
		var theme = $(this).attr("data-theme");
		var color = $(this).attr("data-color");
		doc.setOption("theme", theme);
		$("#cursor-highlight").html(".CodeMirror-activeline-background {background: "
			+ color +  " !important;}");
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

	// local storage
	function supports_html5_storage() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
});