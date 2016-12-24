'use strict';

import _WS			    from './workspace.js';	

export default class bodyCtrl {
	constructor($scope,wsSvc,testSvc) {
		console.log( 'CALL bodyCtrl()' );

		testSvc.removeAll((res) =>{
			testSvc.createFileSystem( (res) =>{
				
				var ack = res.data;
				console.log('create ACK : ', ack);
				
				_WS.fs_id		= ack.id;
				_WS.fs_name		= ack.name;
				_WS.user_id		= ack.user_id;
				_WS.project_id	= ack.project_id;
	
				wsSvc.on( 'connected', function () {
					console.log( "CALL ws connected" );
				});
				
				wsSvc.on( 'disconnected', function () {
					console.log( "CALL ws disconnected" );
				});

				wsSvc.on( 'err', function () {
					console.log( "CALL ws error" );
				});
				
				wsSvc.on( 'data', function (data) {
					console.log( "CALL ws data = ", data );
				});
				
				wsSvc.connect();
				
			});
		});
	}
}
