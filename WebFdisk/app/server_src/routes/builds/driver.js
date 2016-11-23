var
	stream 		= require('stream'),
	express 	= require('express'),
	R 			= express.Router(),
	Docker 		= require('dockerode'),

end_require= true;

var	builds	= {};
var builds_id = 0;

var envs = {};
	envs["0001"] = {
		id 				: "0001",
		toolchain  		: "/home/falinux/1610_0005_webide_paas/tool_chain/gcc-linaro-arm-linux-gnueabihf-4.9-2014.09_linux",
		kernel_src 		: "/home/falinux/1610_0005_webide_paas/kernel_src/linux-imx6_3.10.53",
		kernel_build 	: "/home/falinux/1610_0005_webide_paas/kernel_build/linux-imx6_3.10.53",
	};	

var srcs = {};
	srcs["0001"] = {
		id 				: "0001",
		path     		: "/home/falinux/1610_0005_webide_paas/WebBuild/test_driver_build_src",
		
	};


var docker = new Docker({socketPath: '/var/run/docker.sock'});

/* 참고용 

	process.on('SIGINT', function() {
		console.log("Caught interrupt signal 1");

	//    process.exit();
	});
*/

// 이전에 생성된 컨테이너를 모두 제거한다. 

var RemoveAllBuildContainers = function (allDone){

	docker.listContainers({all: true}, function (err, containers) {
		
		var buildContainerCount  = 0;

		containers.forEach(function (containerInfo, index, array ) {
			
			var check_pattern = /^\/bd-/;
			if( check_pattern.test( containerInfo.Names[0] ) ) {
				buildContainerCount++;
			}
			
		});
		
		if(buildContainerCount === 0) {
			if( allDone ) {
				allDone();
				return;
			}	
		}
		
		containers.forEach(function (containerInfo, index, array ) {
			
			var check_pattern = /^\/bd-/;
			if( check_pattern.test( containerInfo.Names[0] ) ) {
				var container = docker.getContainer(containerInfo.Id);
				
				container.stop(function handler(err, data) {
					container.remove(function (err, data) {
						    buildContainerCount--;
							if(buildContainerCount === 0) {
								if( allDone ) {
									allDone();
								}	
							}
					});
					
				});
			}
			
		});
	});
}

// 서버 프로그램 시작시 생성된 모든 컨테이너를 중지하고 삭제한다.
RemoveAllBuildContainers();

var initBuild = function(){
	builds	= {};
	builds_id = 0;
}

var build_create = function(){
	var build = {};
	
	build.id			= builds_id;	
	build.name			= null;	
	build.env_id		= null;
	build.src_id		= null;
	build.env 			= null;
	build.src 			= null;
	build.container		= null;
	build.logs 			= null;
	build.logs_seq 		= 0;
	
	build.build			= "ready"; // "run", "end"

	return build;
}

// POST /builds/driver/removeAll			: 생성된 빌드 모두 삭제
R.route('/removeAll').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/driver/removeAll' ); 
	RemoveAllBuildContainers(function(){
//		console.log( "OK remove all container" );
		
		initBuild();
		
		var ack = {};
		res.status(200).json(ack);
	});
		
  })
  ;

  
// GET  	/builds/driver/list			: 생성된 빌드 목록
R.route('/list').get(function(req, res, next) {

	console.log( 'CALL API GET /builds/driver/list' ); 
	
	var list = [];
	
	var keys = [];
	for(var key in builds) {
		keys.push(key);
	}
	
	keys.sort();
	
	keys.forEach(function (id, index, ar) {
		
		var build = builds[id];
		var item = {};
		
		item.id 		= build.id;
		item.name 	= build.name;
		item.env_id 	= build.env_id;
		item.src_id 	= build.src_id;
		item.build 		= build.build;
		
		list.push( item );
		
	});	
	
	res.json(list);
	
});

var SendError = function( res, code, message ){
	var ack = {};
	ack.error = { code : code, message : message };
	res.status(400).json(ack);
}

// POST 	/builds/driver/create		: 빌드 생성
R.route('/create').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/driver/create' );
	
	// 파라메터를 얻는다.
 	var buildOption = req.body;
		console.log( buildOption );	
		
	if ( !buildOption )  { SendError( res, 400, '빌드에 필요한 파라메터가 없습니다' ); return; }
	
	// 빌드 옵션 프러퍼티 존재 체크 
	if ( typeof buildOption.name	 === "undefined" )  { SendError( res, 400, '빌드에 필요한 name 파라메터가 없습니다.' ); return; }
	if ( typeof buildOption.env_id	 === "undefined" )  { SendError( res, 400, '빌드에 필요한 env_id 파라메터가 없습니다.' ); return; }
	if ( typeof buildOption.src_id	 === "undefined" )  { SendError( res, 400, '빌드에 필요한 src_id 파라메터가 없습니다.' ); return; }

	// 빌드 옵션 유효성 체크
	var build_env = envs[buildOption.env_id];
	var build_src = srcs[buildOption.src_id];
	
	if ( typeof build_env	 === "undefined" )  { SendError( res, 400, '빌드에 필요한 env_id 값이 잘못되었습니다.' ); return; }
	if ( typeof build_src	 === "undefined" )  { SendError( res, 400, '빌드에 필요한 src_id 값이 잘못되었습니다.' ); return; }
	
	var build 			= build_create( 0 );
		build.name		= buildOption.name;	
		build.env_id	= buildOption.env_id;
		build.src_id	= buildOption.src_id;
		build.env 		= build_env;
		build.src 		= build_src;
		
	var volumeBind   = [ 
		build.env.toolchain 	+ ':/toolchain/',
		build.env.kernel_src 	+ ':/kernel_src/',
		build.env.kernel_build 	+ ':/kernel_build/',
		build.src.path 			+ ':/work/',
	];	
	
	var createOption = 	{
							Image		: 'build/t001_imja:latest', 
							Tty			: true,
							WorkingDir 	: "/work",
							Cmd			: ['/bin/bash'], 
							name		: 'bd-' + build.id ,
							HostConfig 	: { Binds : volumeBind },
						};
	
	docker.createContainer( createOption , function (err, container) {
		
		if( err ) {
			console.log( 'err = ', err );
			SendError( res, 412, '빌드 컨테이너 생성 실패' );
			return;
		}
		build.container	= container;
		
		container.start( function (err, data) {
			console.log( 'start container' );	

			build.logs 			= [];
			build.logs_seq 		= 0;
			
			build.logStream = new stream.PassThrough();
			build.logStream.on('data', function(chunk){
				var line = {};
				line.number = build.logs_seq++;
				line.text	= chunk.toString();
//				console.log( line );
				build.logs.push( line );
			});
			build.logStream.on('end', function(chunk){
				console.log('CALL logSteam End Event');
//				var line = {};
//				line.number = build.logs_seq++;
//				line.text	= chunk.toString();
//				console.log( line );
//				build.logs.push( line );
			});

			build.build			= "ready"; // "run", "end"
			
			var logs_opts = {
				follow: true,
				stdout: true,
				stderr: true,
				timestamps: false
			};
			
			if( err ) {
				console.log( 'err = ', err );
				SendError( res, 412, '빌드 컨테이너 시작 실패' );
				return;
			}
			
			builds[build.id] = build;
			builds_id 		 = builds_id + 1;
			
			var ack = {};
			
			ack.id 		= build.id;
			ack.name 	= build.name;
			ack.env_id 	= build.env_id;
			ack.src_id 	= build.src_id;
			ack.build 	= build.build;
			
			res.json(ack);
			
		});
		
	});	
	
});

// GET 	/builds/driver/{id}			: 빌드 상태
R.route('/:id')
  .get(function(req, res, next) {
		console.log( 'CALL API GET /builds/driver/:id' ); 
		console.log('id:', req.params.id);

		var build = builds[req.params.id];

		if ( typeof build	 === "undefined" )  { SendError( res, 404, 'ID 에 해당하는 빌드 정보가 없습니다.' ); return; }

		var ack = {};
		
		ack.id 		= build.id;
		ack.name 	= build.name;
		ack.env_id 	= build.env_id;
		ack.src_id 	= build.src_id;
		ack.build 	= build.build;
		
		res.json(ack);

  })
  
// POST /builds/driver/{id}/remove			: 생성된 빌드 삭제
R.route('/:id/remove').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/driver/:id/remove' ); 
	console.log('id:', req.params.id);

	var build = builds[req.params.id];

	if ( typeof build	 === "undefined" )  { SendError( res, 404, 'ID 에 해당하는 빌드 정보가 없습니다.' ); return; }
	
		
	build.container.stop(function handler(err, data) {
		build.container.remove(function (err, data) {
			
			delete builds[req.params.id];
			
			var state = {};
			state.result  = 'ok';
			res.json(state);

		});
					
	});
		
  })
  ;

// POST 	/builds/driver/{id}/clean	: 빌드 크린
R.route('/:id/clean').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/driver/:id/clean' ); 
	console.log('id:', req.params.id);

	var build = builds[req.params.id];

	if ( typeof build	 === "undefined" )  { SendError( res, 404, 'ID 에 해당하는 빌드 정보가 없습니다.' ); return; }
	
	var options = {
		Cmd: ['make','clean'],
		AttachStdout: true,
		AttachStderr: true
	};

	build.container.exec(options, function(err, exec) {
		if (err) return;
		exec.start(function(err, stream) {
			if (err) { SendError( res, 500, '빌드 클린에 실패 했습니다.' ); return; }

			build.container.modem.demuxStream(stream, build.logStream, build.logStream);
			stream.on('end', function()
			{
				build.build			= "end";
				console.log( 'run clean end!!!!' );
//					build.logStream.end();
			});

			build.build			= "run";
			
			var ack = {};
			ack.result  = 'sucess';	
			res.json(ack);

		});
	});
	
});

// POST 	/builds/driver/{id}/start	: 빌드 시작
R.route('/:id/start').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/driver/:id/start' ); 
	console.log('id:', req.params.id);

	var build = builds[req.params.id];

	if ( typeof build	 === "undefined" )  { SendError( res, 404, 'ID 에 해당하는 빌드 정보가 없습니다.' ); return; }
	
	var options = {
//		Cmd: ['ls','-al','/work'],
		Cmd: ['make', 'build'],
		AttachStdout: true,
		AttachStderr: true
	};

	build.container.exec(options, function(err, exec) {
		if (err) return;
		exec.start(function(err, stream) {
			if (err) { SendError( res, 500, '빌드 시작에 실패 했습니다.' ); return; }

			build.container.modem.demuxStream(stream, build.logStream, build.logStream);
			stream.on('end', function()
			{
					console.log( 'run build end!!!!' );
					build.build			= "end";
//					build.logStream.end();
			});
			
			build.build			= "run";
			
			var ack = {};
			ack.result  = 'sucess';	
			res.json(ack);

		});
	});
	
});

// POST 	/builds/driver/{id}/stop	: 빌드 중지
R.route('/:id/stop').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/driver/:id/stop' ); 
	console.log('id:', req.params.id);

	var build = builds[req.params.id];

	if ( typeof build	 === "undefined" )  { SendError( res, 404, 'ID 에 해당하는 빌드 정보가 없습니다.' ); return; }
	
	var options = {
//		Cmd: ['ls','-al','/work'],
		Cmd: ['pkill', 'make'],
		AttachStdout: true,
		AttachStderr: true
	};

	build.container.exec(options, function(err, exec) {
		if (err) if (err) { SendError( res, 500, '빌드 중지에 실패 했습니다.' ); return; }
		exec.start(function(err, stream) {
//			if (err) return;
		
			build.build			= "ready";
			var ack = {};
			ack.result  = 'sucess';	
			res.json(ack);

		});
	});

});

// GET 	/builds/driver/{id}/logs	: 빌드 로그를 얻는다. 
R.route('/:id/logs').get(function(req, res, next) {

	console.log( 'CALL API GET /builds/driver/:id/logs' ); 
	console.log('id:', req.params.id);

	var build = builds[req.params.id];

	if ( typeof build	 === "undefined" )  { SendError( res, 404, 'ID 에 해당하는 빌드 정보가 없습니다.' ); return; }

	console.log( build.logs );
	var ack = build.logs;
		
//	ack.id 		= build.id;
//	ack.name 	= build.name;
//	ack.env_id 	= build.env_id;
//	ack.src_id 	= build.src_id;
//	ack.build 	= build.build;
		
	res.json(ack);
	
});

module.exports = R;

