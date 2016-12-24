'use strict';

export default class writingCtrl {
	constructor($scope,$state) {
		console.log( 'CALL writingCtrl()' );

		$scope.next = function(){
			console.log('writingCtrl:next()');
			$state.go('finish');
		}	
	}
}
