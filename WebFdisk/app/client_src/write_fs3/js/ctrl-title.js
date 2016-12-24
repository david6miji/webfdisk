'use strict';

export default class titleCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL titleCtrl()' );
		$scope.init = function(){
			console.log('titleCtrl:init()');
		}	
	}
}

// titleCtrl.$inject = [ '$scope', '$http', '$interval' ];

