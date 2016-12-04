'use strict';

import 'codemirror/lib/codemirror.css';

import markdown from 'markdown/lib/markdown.js';
import codeMirror from 'codemirror/lib/codemirror.js';

export default class mainCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL mainCtrl()' );
		$scope.init = function(){
			console.log('mainCtrl:init()');
		}	
		
		
		/*
		
		var $ = function (id) { return document.getElementById(id); };
        $scope.db = {edit: 'test'};
		
		$scope.codeMirrorInit = function(){
            console.log('codeMirrorInit!!!');
			var editor = codeMirror.fromTextArea($$("mainC"), {
				mode: "markdown",
				lineNumbers: true,
				lineWrapping: true,
				extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
				foldGutter: true,
				gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
			})
			.on("renderLine", function(instance, line, element) {
				// console.log(instance);
				// console.log(line);
				// console.log(element);

				var doc     = instance.getDoc();
				var content = doc.getValue();

				// console.log(content);

				$scope.db.edit = content;

				doc.on("change", function(doc, changeObj) {
					// console.log(doc);
					// console.log(changeObj);
				});
				
				function Editor(input, preview) {
					this.update = function () {
					  preview.innerHTML = markdown.toHTML($scope.db.edit);
					};
					input.editor = this;
					this.update();
				}
				new Editor($("text-input"), $("preview"));
				
			})
			;
			
		};
		*/
	}
}

mainCtrl.$inject = [ '$scope', '$http', '$interval' ];
