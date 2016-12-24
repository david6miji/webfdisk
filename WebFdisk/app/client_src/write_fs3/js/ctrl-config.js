'use strict';

export default class configCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL configCtrl()' );
		$scope.init = function(){
			console.log('configCtrl:init()');
		}	
	}
}

// configCtrl.$inject = [ '$scope', '$http', '$timeout' ];
