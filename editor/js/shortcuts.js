$(function() {
	function prevent(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			// internet explorer
			e.returnValue = false;
		}
	}
	
	Mousetrap.bindGlobal('ctrl+s', function (e) {
		// TODO: DRY this prevent stuff!
		prevent(e);
		editor.save();
	});

	Mousetrap.bindGlobal('ctrl+shift+v', function (e) {
		prevent(e);
		editor.view();
	});

	Mousetrap.bindGlobal('ctrl+b', function (e) {
		prevent(e);
		editor.bold();
	});

	Mousetrap.bindGlobal('ctrl+i', function (e) {
		prevent(e);
		editor.italic();
	});

	Mousetrap.bindGlobal('ctrl+1', function (e) {
		prevent(e);
		editor.header("# ");
	});

	Mousetrap.bindGlobal('ctrl+2', function (e) {
		prevent(e);
		editor.header("## ");
	});

	Mousetrap.bindGlobal('ctrl+3', function (e) {
		prevent(e);
		editor.header("### ");
	});

	Mousetrap.bindGlobal('ctrl+shift+c', function (e) {
		prevent(e);
		editor.code();
	});

	Mousetrap.bindGlobal('ctrl+shift+l', function (e) {
		prevent(e);
		editor.link();
	});

	Mousetrap.bindGlobal('ctrl+shift+p', function (e) {
		prevent(e);
		$('#modal-picture').modal('show');
		editor.picture();
	});
});
