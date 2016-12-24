var
	express 	= require('express'),
	expressWs   = require('express-ws')(express()),
	R 			= express.Router(),

end_require= true;

console.log('CALL filesystems.js');

var fsObjs		= {};
var fsObjs_id	= 0;

var initFS = function(){
	fsObjs		= {};
	fsObjs_id	= 0;
}

var createFSObj = function(){
	
	var fsObj	= {};
	
	fsObj.id			= fsObjs_id;
	fsObj.name			= null;
	fsObj.user_id		= null;
	fsObj.project_id	= null;
	
	fsObj.webSocket		= null;

	return fsObj;
}

var getFSState = function(fsObj){
	var obj	= {};
	
	obj.id			= fsObj.id			
	obj.name		= fsObj.name		
	obj.user_id		= fsObj.user_id		
	obj.project_id	= fsObj.project_id	

	return obj;
}

var SendError = function( res, code, message ){
	var ack = {};
	ack.error = { code : code, message : message };
	res.status(code).json(ack);
}

// GET	/builds/v1/filesystems/removeAll : 모든 파일시스템을 삭제한다.
R.route('/removeAll').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/v1/filesystems/removeAll' ); 

	initFS();

	var ack = {};
	res.status(200).json(ack);
	
});

// GET	/builds/v1/filesystems : 생성된 파일시스템 목록
R.route('/').get(function(req, res, next) {

	console.log( 'CALL API GET /builds/v1/filesystems' ); 
	
	var list = [];
	
	var keys = [];
	for(var key in fsObjs) {
		keys.push(key);
	}
	
	keys.sort();
	
	keys.forEach(function (id, index, ar) {
		
		var fsObj 	= fsObjs[id];
		var item	= getFSState(fsObj);
		
		list.push( item );
		
	});	
	
	res.json(list);
	
});

// /builds/v1/filesystems : 파일 시스템 생성
R.route('/').post(function(req, res, next) {

	console.log( 'CALL API POST /builds/v1/filesystems' );
	
	// 파라메터를 얻는다.
 	var createOption = req.body;
	if ( !createOption )  { 
		SendError( res, 400, '생성에 필요한 파라메터가 없습니다.' );
		return; 
	}
	// 파일 옵션 프러퍼티 존재 체크 
	if ( typeof createOption.name			=== "undefined" )  { 
		SendError( res, 400, '생성에 필요한 name 파라메터가 없습니다.' );
		return; 
	}
		
	if ( typeof createOption.user_id		=== "undefined" )  { 
		SendError( res, 400, '생성에 필요한 user_id 파라메터가 없습니다.' );
		return; 
	}
	if ( typeof createOption.project_id	=== "undefined" )  { 
		SendError( res, 400, '생성에 필요한 project_id 파라메터가 없습니다.' ); 
		return; 
	}
	var fsObj 			= createFSObj();

		fsObj.name			= createOption.name;
		fsObj.user_id		= createOption.user_id;
		fsObj.project_id	= createOption.project_id;
	
	fsObjs[fsObj.id] 	= fsObj;
	fsObjs_id 		 	= fsObjs_id + 1;
	
	var ack = getFSState(fsObj);
	
	res.json(ack);
});

// GET 	/builds/v1/filesystems/{id} : 파일시스템 정보 얻기
R.route('/:id').get(function(req, res, next) {
	console.log( 'CALL API GET /builds/v1/filesystems/{id}' ); 
	
	console.log('id:', req.params.id);

	var fsObj = fsObjs[req.params.id];

	if ( typeof fsObj	=== "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 파일 정보가 없습니다.' ); 
		return; 
	}

	var ack = getFSState(fsObj);
	
	res.json(ack);
		
});

// PUT	/builds/v1/filesystems/{id}			: 파일 상태 수정
R.route('/:id').put(function(req, res, next) {
	console.log( 'CALL API PUT /builds/v1/filesystems/{id}' ); 

	console.log('id:', req.params.id);

	var fsObj 		= fsObjs[req.params.id];
	var fsOption 	= req.body;
	
	if ( typeof fsObj	 === "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 파일시스템 정보가 없습니다.' ); 
		return; 
	}
	if ( typeof fsOption.id === "undefined")  { 
		SendError( res, 400, '파일 수정에 필요한 파라메터가 없습니다' );
		return; 
	}
	
	// 파일 옵션 프러퍼티 존재 체크
	if ( fsObj.id						!== fsOption.id )  { 
		SendError( res, 405, 'ID 에 해당하는 정보가 다릅니다.' ); 
		return; 
	}
	if ( typeof fsOption.name			!== "undefined" ) {	
		fsObj.name			= fsOption.name;		
	}
	if ( typeof fsOption.user_id		!== "undefined" ) {	
		fsObj.user_id		= fsOption.user_id;	
	}
	if ( typeof fsOption.project_id	!== "undefined" ) {	
		fsObj.project_id	= fsOption.project_id;
	}
	
	var ack = getFSState(fsObj);
	
	res.json(ack);
});

// DELETE 	/builds/v1/filesystems/{id}  	: 파일 상태 삭제
R.route('/:id').delete(function(req, res, next) {

	console.log( 'CALL API DELETE /builds/v1/filesystems/{id}' ); 
	console.log('id:', req.params.id);

	var fsObj = fsObjs[req.params.id];
	
	if ( typeof fsObj	 === "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 파일 정보가 없습니다.' ); 
		return; 
	}
	
	var ack = getFSState(fsObj);
	
	delete fsObjs[req.params.id];

	res.json(ack);
		
});

R.ws('/:id', function(ws, req, next) {
	console.log( 'CALL API WS /builds/v1/filesystems/{id}' ); 
	console.log( 'id:', req.params.id );
	
	var fsObj	= fsObjs[req.params.id];
	
	if ( typeof fsObj	 === "undefined" ) {
		console.log('Unknown Connection');
		return;
	}
	
	fsObj.webSocket	= ws;

	ws.on('message', function(msg) {

		console.log('id:', req.params.id);
		console.log( msg );

		var msgObj	= JSON.parse(msg);

		console.log( 'msgObj.cmd = ', msgObj.cmd );

		switch(msgObj.cmd) {
		case 'echo':
			var echoData = msgObj;
			echoData.cmd = 'ack';
			echoData.id = fsObj.id;

			ws.send(JSON.stringify(echoData));
			break;
		default:

			console.log('filesystem.js: Unknown Command ws req');
			break;

		}

	});

});

module.exports = R;
