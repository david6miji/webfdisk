'use strict';

// import _WS		    from './workspace.js';

export default class testSvc {
	constructor($http,$ws) {
		console.log( 'CALL testSvc()' );
		this.$http	= $http;
		this.$ws	= $ws;
	}
	
	removeAll(cb) {
		console.log( 'CALL removeAll()' );
		
		this.$http.post(
			'http://192.168.0.117:7000/builds/v1/filesystems/removeAll')
		.then((res) => {
			console.log('test:removeAll OK Good !!!');
			if( cb ) cb(res);
			
		}, (res) => {
			console.log('test:removeAll Error : ', res.status);
			console.log('test:removeAll Error : ', res.statusText);
		});
		
	}
	
	createFileSystem(cb) {
		console.log( 'CALL createFileSystem()' );
		
		var createOption = {
			"name"		: "AM335x Base File System",
			"user_id"	: "0001",
			"project_id": "0001",
		};

		this.$http.post(
			'http://192.168.0.117:7000/builds/v1/filesystems',
			createOption
			)
		.then((res) => {
			console.log('test:create OK Good !!!');
			if( cb ) cb(res);
			
		}, (res) => {
			console.log('test:create Error : ', res.status);
			console.log('test:create Error : ', res.statusText);
		});
		
	}

}
