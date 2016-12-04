'use strict';

export default class rightCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL rightCtrl()' );
		$scope.init = function(){
			console.log('rightCtrl:init()');
		}	

	}
}

rightCtrl.$inject = [ '$scope', '$http', '$interval' ];