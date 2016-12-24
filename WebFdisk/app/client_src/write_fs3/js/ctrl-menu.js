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
		{ id: 'test',		type: 'button',	
							caption: 'test',					
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
	
	constructor($rootScope, $scope, $http, $interval, $state, $timeout,$ws ) {
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
				if(event.target == 'test') {
					console.log( 'Click Test' );
					// $state.go('configMain');
					// $state.transitionTo('config');
					
					var ws = $ws.init({
						url: 'ws://192.168.0.117:7000/builds/v1/filesystems/0',
						reconnect: false, reconnectInterval: 2000,
						lazyOpen: false, protocols: null, enqueue: false
					}); 
					ws.on('open', function () {
						console.log('Connection open...');
						
						var echoObj = {   cmd : "echo", 
						                  id : 0, 
										  data : 'Check Data' 
									   };
									   
						ws.send(JSON.stringify(echoObj)); 

					});

					// when receiving message from server
					ws.on('message', function (message) { 
						console.log('message from server with data:');
						console.log(message.data);
					});

					// when connection closed
					ws.on('close', function (e) { 
						console.log('connection closed...');
					});
					
					// when connection ocuurs error
					ws.on('error', function (e) { 
						console.log('occurs error...');
					});

				}
					
			});
				
		}
		_global.AngularJSLastCall($timeout,$http, createToolBar);
		
	}
	
}

// menuCtrl.$inject = [ 
// 	'$rootScope', '$scope', 
// 	'$http', '$interval', 
// 	'$state', '$timeout',
// 	'$ws',
// ];

