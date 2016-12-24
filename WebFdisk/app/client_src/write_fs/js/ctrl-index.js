'use strict';

export default class indexCtrl {
	constructor($scope,$state) {
		console.log( 'CALL indexCtrl()' );

		$scope.next = function(){
			console.log('indexCtrl:next()');
			$state.go('wait');
		}
	}
	
}
