var latex_math = function() {
	
	function env_inline() {
		env("$$", 1);
	}
	
	function env_array() {
		env("\\begin{eqnarray*}\n\n\\end{eqnarray*}", 0, 1);
	}
	
	function superscript() {
		env("^{}", 2);
	}
	
	function subscript() {
		env("_{}", 2);
	}
	
	function fraction() {
		env("\\dfrac{}{}", 7);
	}
		
	function square_root() {
		env("\\sqrt{}", 6);
	}
			
	function nth_root() {
		env("\\sqrt[]{}", 8);
	}
	
	function env(text, cursor_pos, skip_lines) {
		cursor_pos = cursor_pos || 0;
		skip_lines = skip_lines || 0;
		
		var cursor = doc.getCursor();
		var line = doc.getLine(cursor.line);

		var content = [line.slice(0, cursor.ch), text, line.slice(cursor.ch)].join('');
		doc.setLine(cursor.line, content);
		doc.setCursor(cursor.line + skip_lines, cursor.ch + cursor_pos);
		doc.focus();
	}
	
	return {
		env_inline: env_inline,
		env_array: env_array,
		superscript: superscript,
		subscript: subscript,
		fraction: fraction,
		square_root: square_root,
		nth_root: nth_root,
	};
}();

$(function() {
	
	$("#lm-inline").click(function() {
		latex_math.env_inline();
	});
	
	$("#lm-array").click(function() {
		latex_math.env_array();
	});
	
	$("#lm-superscript").click(function() {
		latex_math.superscript();
	});
	
	$("#lm-subscript").click(function() {
		latex_math.subscript();
	});
	
	$("#lm-fraction").click(function() {
		latex_math.fraction();
	});
	
	$("#lm-square-root").click(function() {
		latex_math.square_root();
	});
		
	$("#lm-nth-root").click(function() {
		latex_math.nth_root();
	});
	
	$('#latex-math a[rel=tooltip]').tooltip({
		placement: "right"
	});
});
