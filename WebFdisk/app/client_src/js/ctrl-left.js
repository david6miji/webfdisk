'use strict';

import _global		from './global.js';
import libEditor	from './lib-editor.js';

export default class leftCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL leftCtrl' );

        w2ui['layout'].content('left', $().w2sidebar({
        	name: 'sidebar',
        	img: null,
			nodes: [
				{ id: 'projedt',	text: 'Project',	icon: 'fa fa-folder', expanded: true,
        		  nodes: [ { id: 'mainC',		text: 'main.c',		icon: 'fa fa-file-o'	},
        				   { id: 'mainH',		text: 'main.h',		icon: 'fa fa-file-o'	},
        				   { id: 'makefile',	text: 'makefile',	icon: 'fa fa-file-o'	},
						   { id: 'readme',		text: 'README.md',	icon: 'fa fa-file-text-o' }
        				 ]
        		},
				{ id: 'config',		text: 'config',		icon: 'fa fa-cog'}
			],

        	onClick: function (event) {

				var tabs		= w2ui.layout_main_tabs;

				var idString	= libEditor.getIdFromEventTarget(event.target);
				
				if (tabs.get(event.target)) {

					tabs.select(event.target);
					
					libEditor.selectCodeMirror(_global.codeViewId, idString);
					
				} else {
										
					tabs.add({ id: event.target, caption: event.node.text, closable: true });
					tabs.select(event.target);
					
					libEditor.createCodeMirror(_global.codeViewId, idString);
					libEditor.selectCodeMirror(_global.codeViewId, idString);
				}
        	}
        }));
	}
}

leftCtrl.$inject = [ '$scope', '$http', '$interval' ];
