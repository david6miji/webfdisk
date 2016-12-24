'use strict';

running.$inject = ['$rootScope','$animate'];

export default function running($rootScope,$animate) {
	console.log( "CALL app.running()" );
	
	$rootScope.$on('$stateChangeStart',
		function (event, toState, toParams, fromState, fromParams) {
		}
	);

    $rootScope.$on('$stateChangeSuccess',
		function (event, toState, toParams, fromState, fromParams) {
		}
	);
}
