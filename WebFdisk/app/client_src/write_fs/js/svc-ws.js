'use strict';

import EventEmitter from 'events';

import _WS		    from './workspace.js';

export default class wsSvc extends EventEmitter {
	
	constructor($http, $ws) {
		console.log( 'CALL wsScv()' );
		super();
		this.$http	= $http;
		this.$ws	= $ws;
	}

	connect() {
		console.log( 'WebSocket Connect' );
		var owner = this;

		var ws = this.$ws.init({
			url: 'ws://192.168.0.117:7000/builds/v1/filesystems/'
     			 + _WS.fs_id,
			reconnect			: false, 
			reconnectInterval	: 2000,
			lazyOpen			: false, 
			protocols			: null, 
			enqueue				: false
		}); 
		
		ws.on('open', function () {
			console.log('Connection open...');
			
			var echoObj = {   cmd 	: "echo", 
							  id 	: _WS.fs_id,
							  data 	: 'Check Data' 
						   };
						   
			ws.send(JSON.stringify(echoObj)); 
			
			owner.emit('connected');

		});

		// when receiving message from server
		ws.on('message', function (message) { 
			console.log('message from server with data:');
			console.log(message.data);
			
			var msgObj	= JSON.parse(message.data);
			
			var cmd		= msgObj.cmd;

			console.log('cmd = ', cmd );
			
			owner.emit('data', msgObj );
			
//			if(cmd === 'consoleOut') {
//				trem.echo(line, {raw: true, keepWords : true});	
//			} else if(cmd === 'ack') {
//				console.log(msgObj);
//			}
			
		});

		// when connection closed
		ws.on('close', function (e) { 
			console.log('connection closed...');
			owner.emit('disconnected');
			
		});
		
		// when connection ocuurs error
		ws.on('error', function (e) { 
			console.log('occurs error...');
			owner.emit('err');
		});
		
	}
	
}
