'use strict';

import _WS		    from './workspace.js';	

export default class testSvc {
	
	constructor($http) {
		console.log( 'CALL testSvc()' );
		this.$http = $http;
	}
	
	initAPI() {
		this.$http.post(
			  'http://192.168.0.117:7000/builds/v1/filesystems/removeAll')
		.then((res) => {
			console.log('removeAll OK Good !!!');

			var ack = res.data;
			
			console.log('removeAll ACK : ', ack);
			
			var createOption = {
				"name"		: "AM335x Base File System",
				"user_id"	: "0001",
				"project_id": "0001",
			};		
			
			this.$http.post( 
				  'http://192.168.0.117:7000/builds/v1/filesystems/', 
				  createOption )
			.then((res) => {
				console.log('create OK Good !!!');
				
				var ack = res.data;
				
				console.log('create ACK : ', ack);	
			}, (res) => {
				console.log('create Error : ', res.status);
				console.log('create Error : ', res.statusText);
			});
			
		}, (res) => {
			console.log('removeAll Error : ', res.status);
			console.log('removeAll Error : ', res.statusText);
    });
		
		
	}
}

// testSvc.$inject = [ '$http' ];

