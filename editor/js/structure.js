var struct = function () {
	
	function parse(doc) {
		var ul = $("#struct");
		ul.empty();
		ul.append('<li class="nav-header">Structure</li>');
		doc.eachLine(function (line) {
			var text = line.text;
			if (/^#{1,6}/.test(text)) {
				var linenumber = doc.getLineNumber(line);
				var a = $("<a/>",{
					html: text,
					href: "#",
					class: "struct",
					"data-linenumber": linenumber
				});
				ul.append($("<li/>", {html: a, onclick: "return false;"}));
			}
		});
	}
	
	return {
		parse: parse
	};
}();
