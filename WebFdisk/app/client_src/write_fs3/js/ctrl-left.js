'use strict';

import _global		from './global.js';
import libEditor	from './lib-editor.js';

export default class leftCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL leftCtrl()' );
		$scope.init = function(){
			console.log('leftCtrl:init()');
		}	

		var storage_nodes = [ 
			{ id: 'p-0', text: '0 번 파티션', icon: 'fa fa-folder' },
        	{ id: 'p-1', text: '1 번 파티션', icon: 'fa fa-folder' },
        	{ id: 'p-2', text: '2 번 파티션', icon: 'fa fa-folder' },
			{ id: 'p-3', text: '3 번 파티션', icon: 'fa fa-folder' }
        ];
		
        w2ui['layout'].content('left', $().w2sidebar({
        	name: 'sidebar',
			nodes: [
				{ id: 'storage', 	text: '저장장치',	
									icon: 'fa  fa-database', 
									expanded: true,
									nodes: storage_nodes,
        		},
				{ id: 'config',		text: '설정',		
									icon: 'fa fa-cog'
				},
			],

        	onClick: function (event) {

        	}
        }));
		
	}
}

// leftCtrl.$inject = [ '$scope', '$http', '$interval' ];

