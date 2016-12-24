'use strict';

export default class waitCtrl {
	constructor($scope,$state) {
		console.log( 'CALL waitCtrl()' );

		$scope.next = function(){
			console.log('waitCtrl:next()');
			$state.go('writing');
		}	
	}
}
