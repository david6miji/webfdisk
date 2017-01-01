'use strict';

import backoff		from 'backoff';

import 	chai 		from 'chai';
import 	chaiHttp    from 'chai-http';
chai.use(chaiHttp);

import 	pty 		from 'pty.js';
import readline		from 'readline';

console.log( 'CALL micro_sd.js' );

var urlBase 	= 'http://localhost:3000';
var urlBaseWS 	= 'ws://localhost:3000';

export default class microSD {
	
	constructor() {
		console.log( 'microSD:constructor()' );
		
		this.vendor_id		= "FA000";
		this.product_id		= "MSD000";
		this.serial_number	= "0000";
		
		this.logined		= false;
		this.dev_id			= null;

		this.devSize		= null;
	}
	
	login(done){
		
		let microSD = this;
		
		let loginOption = {
			"vendor_id"		: microSD.vendor_id		,
			"product_id"	: microSD.product_id	,
			"serial_number"	: microSD.serial_number	,
		};

		chai.request(urlBase)
			.post('/dev/v1/micro_sd/login')
			.send( loginOption )
			.end( (err, res)=>{
				
				if( err ){
					
					console.log( err );
					microSD.logined = false;
					
				} else {
					var Status = res.body;	
					
					microSD.dev_id	= Status.id;
					microSD.logined = true;
					
					done();
				}
				
			});		
		
	}
	
	getDeviceInfo( devName , done ){
		
		let microSD = this;
		
		let udevadm = pty.spawn(
				'udevadm', 
				[ 
					'info','--attribute-walk',
					`--name=${devName}`,
				] 
			);
			
		udevadm.on('exit',(code)=>{
			if( done ) done();
		});
			
		let rl = readline.createInterface( udevadm, null );
		rl.on('line',(line)=>{
			
			let checkStr = line.match(/ATTR{size}==\"[0-9]+\"/g);
			if( checkStr ) {
				let val = checkStr[0].match(/[0-9]+/)[0];
				microSD.devSize = val * 512;
			}
			
		});
		
	}
	
	sendInsertDevice( devName , done ){
		
		let microSD = this;
		
		microSD.getDeviceInfo( devName,()=>{
			
			let InsertOption = {
				"size": microSD.devSize,
			};

			chai.request(urlBase)
				.post(`/dev/v1/micro_sd/${microSD.dev_id}/insert`)
				.send( InsertOption )
				.end( (err, res)=>{
					
					if( err ){
						
						console.log( err );
						microSD.logined = false;
						
					} else {
						var Status = res.body;	
						
						if( done ) done();
					}
					
				});		
			
		});
		
	}

	sendRemoveDevice( devName , done ){
		
		let microSD = this;
				
		chai.request(urlBase)
			.post(`/dev/v1/micro_sd/${microSD.dev_id}/remove`)
			.end( (err, res)=>{
				
				if( err ){
					
					console.log( err );
					microSD.logined = false;
					
				} else {
					var Status = res.body;	
					
					if( done ) done();
					
				}
				
			});		
				
	}
	
	startDeviceEvent(){
		
		let microSD = this;
		
		let udevadm = pty.spawn(
				'udevadm', 
				[ 'monitor','--kernel' ] 
			);
			
		let rl = readline.createInterface( udevadm, null );
		rl.on('line', (line)=>{

			var event = line.split(/[ ]+/);

			if( event.length !== 4 ) 		return;
			if( event[3] !== '(block)' ) 	return;

			let p =  event[2].search(/block\/sd[a-z]$/);
			if( p === -1 ) return;

			let devName = event[2].substring(p)
			             .replace( /^block\/sd/, '\/dev\/sd');
						
			switch( event[1] ){
			case 'add' 		: microSD.sendInsertDevice( devName ); break;
			case 'remove' 	: microSD.sendRemoveDevice( devName ); break;
			}

		});
		
	}
	
	start(){
		
		let microSD = this;
		
		console.log( 'microSD:start()' );
		
		microSD.startDeviceEvent();
		
		let fibonacciBackoff = backoff.fibonacci({
		      randomisationFactor	:     0,
		      initialDelay			:  1000,
		      maxDelay				:  5000,
		});

		fibonacciBackoff.on('ready', (number, delay)=>{
			fibonacciBackoff.backoff();
		});

		fibonacciBackoff.on('backoff', (number, delay)=>{
			
			console.log(number + ' ' + delay + 'ms');
			
			if( microSD.logined === false ) {
				microSD.login(() => { fibonacciBackoff.reset(); });
			} 				
			
		});

		fibonacciBackoff.backoff();
		
	}

}

