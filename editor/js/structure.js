var struct = function () {
	
	var setting = {
		view: {
			dblClickExpand: dblClickExpand
		},
		data: {
			simpleData: {
				enable: true
			}
		}
	};
	
	function dblClickExpand(treeId, treeNode) {
		return treeNode.level > 0;
	}
	
	function parse() {
		/*var tree = $.fn.zTree.getZTreeObj("struct");
		var zNodes = [];
		var nodes = tree.getNodes();
		console.log(nodes[0].id);
		tree.removeChildNodes(nodes[0]);
		//            R  #  ##  ###...
		var levels = [1, 1, 1,  1,  1, 1, 1];
		
		doc.eachLine(function (line) {
			var text = line.text;
			if (/^#{1,6}/.test(text)) {
				var level = text.replace(/[^#]/g, "").length;
				var linenumber = doc.getLineNumber(line);
				var pId = levels.slice(0, level).join("");
				var index = levels[level + 1];
				var id = pId + "" + index;
				levels[level + 1] += 1;
				var obj = {id:id, pId:pId, name:text};
				console.log(obj);
				zNodes.push(obj);
				// reset all child levels
				for (var i = level + 2; i < levels.length; i++) {
					levels[i] = 1;
				}
				console.log(levels);
			}
		});
		tree.addNodes(nodes[0], zNodes);*/
		
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
		setting: setting,
		parse: parse
	};
}();
