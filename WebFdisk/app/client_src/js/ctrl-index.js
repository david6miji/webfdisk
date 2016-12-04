'use strict';

import 'codemirror/lib/codemirror.css';
import codeMirror			from 'codemirror/lib/codemirror.js';

export default class indexCtrl {
	constructor($scope, $http, $interval, $compile) {
		console.log( 'CALL indexCtrl()' );
		$scope.init = function(){
			console.log('indexCtrl:init()');
			// /builds/driver/removeAll
		}
			
//			$http.post('http://192.168.10.15:7000/builds/driver/removeAll')
//			.then((res) => {
//				console.log('removeAll OK Good !!!');
//				
//				var ack = res.data;
//				
//				console.log('removeAll ACK : ', ack);
//				
//				var createOption = {
//								name	: "시험용 빌드",
//								env_id	: "0001",
//								src_id	: "0001"
//				};
//				
//				$http.post('http://192.168.10.15:7000/builds/driver/create', createOption)
//				.then((res) => {
//					console.log('create OK Good !!!');
//					
//					var ack = res.data;
//					
//					console.log('create ACK : ', ack);	
//				}, (res) => {
//					
//					console.log('create Error : ', res.status);
//					console.log('create Error : ', res.statusText);
//				});
//				
//				
//			}, (res) => {
//				console.log('removeAll Error : ', res.status);
//				console.log('removeAll Error : ', res.statusText);
//			});
			
	}
}

indexCtrl.$inject = [ '$scope', '$http', '$interval' ];
