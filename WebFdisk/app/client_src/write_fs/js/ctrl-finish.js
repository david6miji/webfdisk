'use strict';

export default class finishCtrl {
	constructor($scope,$state) {
		console.log( 'CALL finishCtrl()' );

		$scope.next = function(){
			console.log('finishCtrl:next()');
			$state.go('index');
		}	
	}
}

