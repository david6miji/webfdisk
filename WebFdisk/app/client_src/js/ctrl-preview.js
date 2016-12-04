'use strict';

export default class previewCtrl {
	constructor($scope, $http, $interval) {
		console.log( 'CALL previewCtrl()' );
		$scope.init = function(){
			console.log('previewCtrl:init()');
		}	
		
		$('#grid').w2grid({ 
			name: 'grid', 
			show: {
				lineNumbers: true,
				footer: true
			},
			columns: [                
				{ field: 'line', caption: 'Line', size: '100%' },
			],
			records: []
		});

//		$interval(() => {
//			
//			$http.get('http://192.168.10.15:7000/builds/driver/0/logs')
//			.then((res) => {
//				var ack = res.data;
//				var lines	= ack;
//				var records	= [];
//				
//				lines.forEach((line, index) => {
//					var item = {recid: line.munber, line: line.text};
//					records.push(item);
//				});
//			
//				w2ui.grid.clear();
//				w2ui.grid.records = records;
//				w2ui.grid.total = records.length;
//				w2ui.grid.refresh();
//							
//			}, (res) => {
//				
//				console.log('logs Error : ', res.status);
//				console.log('logs Error : ', res.statusText);
//			});
//			
//		}, 1000);

	}
}

previewCtrl.$inject = [ '$scope', '$http', '$interval' ];