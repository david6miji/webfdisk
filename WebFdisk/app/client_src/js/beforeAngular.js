'use strict';

import 'font-awesome-webpack';
import 'w2ui/w2ui.css';

import 'jquery';
import 'w2ui';

import _global		from './global.js';
import libEditor	from './lib-editor.js';

var makeContent = function( option ){

	let content	 = ''
	
	content		+= '<div ';
	
	if( option.class ) {
		content	+= 'class="' + option.class + '" ';
	}	
	if( option.controller ) {
		content	+= 'ng-controller="' + option.controller + '" ';
	}	
	if( option.template ) {
		content	+= 'ng-include="\'' + option.template + '\'"';
	}	
	if( option.init ) {
		content	+= 'data-ng-init="' + option.init + '" ';
	}	
	
	content		+= '>';
	content		+= '</div>';
	
	return content;
}

var topStyle			= 'background-color: #F5F6F7;'
						+ 'border: 1px solid #dfdfdf; '
						+ 'padding: 0px 0px 1px 0px;'
						;
var pstyle				= 'background-color: #F5F6F7;'
						+ 'border: 1px solid #dfdfdf;'
						+ 'padding: 5px;'
						;


var titleContent = 	makeContent( {
						'class' 		: 'mainTitle',
						'controller' 	: 'titleCtrl',
						'template'		: '/view/title.html', 
						'init'			: 'init()',
					} );
					
var menuContent	= 	makeContent( {
						'class' 		: 'mainMenu',
						'controller' 	: 'menuCtrl',
						'template'		: '/view/menu.html',
						'init'			: 'init()',
					} );

var leftContent	= 	makeContent( {
						'class' 		: 'mainLeft',
						'controller' 	: 'leftCtrl',
						'template'		: '/view/left.html',
						'init'			: 'init()',
					} );
					
var previewContent = makeContent( {
						'class' 		: 'mainPreview',
						'controller' 	: 'previewCtrl',
						'template'		: '/view/preview.html',
						'init'			: 'init()',
					} );
					
var rightContent = makeContent( {
						'class' 		: 'mainRight',
						'controller' 	: 'rightCtrl',
						'template'		: '/view/right.html',
						'init'			: 'init()',
					} );


var bottomContent = makeContent( {
						'class' 		: 'mainBottom',
						'controller' 	: 'bottomCtrl',
						'template'		: '/view/bottom.html',
						'init'			: 'init()',
					} );
					
var mainContent     = '<div class="mainMain" ui-view="main"></div>';
					
console.log('CALL beforeAngular.js'); 
console.log('V2'); 

$('#layout').w2layout({
	name: 'layout',
	panels: [
		{ type: 'top',		size	: 65,		
							resizable: false,   
							style	: topStyle,    
							content	: titleContent + menuContent		
		},
		{ type: 'left',		size: 200,		
							resizable: true,	
							style	: pstyle,      
							content	: leftContent    
		},
		{ type: 'preview',	size: '20%',	
							resizable: true,    
							style: pstyle,	
							content: previewContent	
		},
		{ type: 'right',	size: 200,		
							resizable: true,
							style: pstyle,      
							content: rightContent   
		},
		{ type: 'bottom',	size: 40,		
							resizable: false,
							style: pstyle,
							content: bottomContent  
		},
		{ type: 'main',		style: pstyle,      
							content: mainContent,
		},
	]
});

