$(function () {

	var doc = CodeMirror.fromTextArea(document.getElementById("editor"), {
		mode: "markdown",
		styleActiveLine: true,
		lineNumbers: true,
		lineWrapping: true,
		theme: 'lesser-dark',
		autofocus: true,
		autoCloseBrackets: true
	});

	editor.init(doc);
	// load content to the editor
	editor.load();
	editor.loadFileList();
	editor.loadPreferences();
	
	$('a[rel=tooltip],i[rel=tooltip],span[rel=tooltip],button[rel=tooltip]').tooltip({
		placement: "bottom"
	});

	$("#view").click(function () {
		editor.view();
	});

	$("#save").click(function () {
		editor.save();
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
		editor.code();
	});

	$("#bt-link").click(function () {
		editor.link();
	});

	$("#bt-picture").click(function () {
		editor.picture();
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
		editor.save();
		file = $(this).attr('data-filename');
		editor.load(file);
		
		$("#file-list li").removeClass("active");
		var li = $(this).parent();
		li.attr("class", "active");
	});
	
	$(document).delegate('a.struct', 'click', function() {
		var line = $(this).attr("data-linenumber");
		doc.setCursor({line: line, ch: 0});
		doc.focus();
	});

	$(".bt-header").click(function () {
		var depth = $(this).attr("data-depth") + " ";
		editor.header(depth);
	});

	$("#bt-bold").click(function () {
		editor.bold();
	});

	$("#bt-italic").click(function () {
		editor.italic();
	});

	// theme options
	$("a.theme").click(function () {
		var theme = $(this).attr("data-theme");
		var color = $(this).attr("data-color");
		editor.setTheme(theme, color);
	});
});
