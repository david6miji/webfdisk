'use strict';

import _global		from './global.js';

var toolbar = {
	
	name: 'toolbar',
	items: [
		{ id: 'build',		type: 'button',	
							caption: 'Build',				
							icon: 'fa fa-play' 
		},
		{ type: 'break' },
		{ id: 'magic',		type: 'button',	
							caption: '',					
							icon: 'fa fa-magic' 
		},
		{ type: 'break' },
		{ id: 'help',		type: 'button',	
							caption: 'Help',				
							icon: 'fa fa-question'
		},
	]
};

export default class menuCtrl {

	constructor($rootScope, $scope, $http, $interval, $state, $timeout ) {
		console.log( 'CALL menuCtrl()' );
		$scope.init = function(){
			console.log('menuCtrl:init()');
		}
		
		var createToolBar = function() {
			
			$('#toolbar').w2toolbar( toolbar);
			w2ui.toolbar.on('click', function(event) {
				
				if(event.target == 'magic') {
					console.log( 'Click Magic' );
					// $state.go('configMain');
					$state.transitionTo('config');
				}
					
			});
				
		}
		_global.AngularJSLastCall($timeout,$http, createToolBar);
		
	}

	
}

menuCtrl.$inject = [ 
	'$rootScope', '$scope', 
	'$http', '$interval', 
	'$state', '$timeout' 
];

