'use strict';

import codeMirror	from 'codemirror/lib/codemirror.js';

export default class libEditor {
	constructor() {
		console.log( 'CALL libEditor' );
	}
	
	static createCodeMirror(parentId, newId) {
		console.log('CALL createCodeMirror()');
		
		var parentView = $('#' + parentId);

		parentView.append('<div id="' + newId + '" name="code" class="codemirror tab"></div>');

		var codeMirrorParent = document.getElementById(newId);
		var editor = codeMirror(codeMirrorParent, {
			mode: "markdown",
			lineNumbers: true,
			lineWrapping: true,
			extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});
		w2ui['layout'].resize();
	}
	
	static removeCodeMirror(removeID) {
		var codeMirror = $('#' + removeID);
		codeMirror.remove();
	}

	static selectCodeMirror(parentId, selectID) {
		$('#' + parentId + ' .tab').hide();
		$('#' + parentId + ' #' + selectID).show();
	}
	
	static getIdFromEventTarget(eventTarget) {
		return eventTarget + 'code';
	}
	
}

