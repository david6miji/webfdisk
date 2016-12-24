'use strict';

export default class bottomCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL bottomCtrl()' );
		$scope.init = function(){
			console.log('bottomCtrl:init()');
		}	
	}
}

// bottomCtrl.$inject = [ '$scope', '$http', '$interval' ];
