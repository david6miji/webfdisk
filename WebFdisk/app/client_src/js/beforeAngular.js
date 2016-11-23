'use strict';

import 'font-awesome-webpack';
import 'w2ui/w2ui.css';

import 'jquery';
import 'w2ui';

import _global		from './global.js';
import libEditor	from './lib-editor.js';

var topStyle			= 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px 0px 1px 0px;';
var pstyle				= 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
var topContent			= '<div class="mainTitle" ui-view="title"></div>'
						+ '<div class="mainMenu" ui-view="menu"></div>';
var leftContent			= '<div class="mainLeft" ui-view="left"></div>';
var mainContent			= '<div class="mainMain" ui-view="main"></div>';
var previewContent		= '<div class="mainPreview" ui-view="preview"></div>';
var rightContent		= '<div class="mainRight" ui-view="right"></div>';
var bottomContent		= '<div class="mainBottom" ui-view="bottom"></div>';

console.log('CALL beforeAngular.js'); 

$('#layout').w2layout({
	name: 'layout',
	panels: [
		{ type: 'top',       size: 65,		resizable: false,   style: topStyle,    content: topContent		},
		{ type: 'left',      size: 200,		resizable: true,	style: pstyle,      content: leftContent    },
		{ type: 'main',											style: pstyle,      content: mainContent,

			tabs: {
				onClick: function (event) {

					var idString = libEditor.getIdFromEventTarget(event.target);

					libEditor.selectCodeMirror(_global.codeViewId, idString);
					
				},
				onClose: function (event) {

					var idString = libEditor.getIdFromEventTarget(event.target);
				
					libEditor.removeCodeMirror(idString);
					
				}
			}

		},
		{ type: 'preview',   size: '20%',	resizable: true,    style: pstyle,      content: previewContent	},
		{ type: 'right',     size: 200,		resizable: true,	style: pstyle,      content: rightContent   },
		{ type: 'bottom',    size: 40,		resizable: false,   style: pstyle,      content: bottomContent  }
	]
});
