var
	express 	= require('express'),
	expressWs   = require('express-ws')(express()),
	R 			= express.Router(),

end_require= true;

console.log('CALL micro_sd.js');

var msdObjs		= {};
var msdObjs_id	= 0;

var initMSD = function(){
	msdObjs		= {};
	msdObjs_id	= 0;
}

var getMsdObjByVPS = function( vps ){

	for(var key in msdObjs) {
		var obj = msdObjs[key];
		if(  obj.vendor_id 		===  vps.vendor_id
		  && obj.product_id 	===  vps.product_id
		  && obj.serial_number	===  vps.serial_number ) {
			  return obj;
		}
	}
	
	return null ;
}

var createMSDObj = function(){
	
	var msdObj	= {};
	
	msdObj.id				= msdObjs_id;
	msdObj.name				= null;
	msdObj.vendor_id		= null;
	msdObj.product_id		= null;
	msdObj.serial_number	= null;
	
	msdObj.Apis				= {};
	msdObj.Apis_id			= 0;
	
	msdObj.webSocket		= null;

	return msdObj;
}

var createApiObj = function(api_id){
	
	var apiObj	= {};
	
	apiObj.api_id			= api_id;
	apiObj.webSocket		= null;

	return apiObj;
}


var getMSDState = function(msdObj){
	var obj	= {};
	
	obj.id				= msdObj.id;
	obj.name			= msdObj.name;
	obj.vendor_id		= msdObj.vendor_id;
	obj.product_id		= msdObj.product_id;
	obj.serial_number	= msdObj.serial_number;

	return obj;
}

var getMSDApiState = function(msdObj,api_id){
	var obj	= {};
	
	obj.id				= msdObj.id;
	obj.api_id			= api_id;
	
	obj.name			= msdObj.name;
	obj.vendor_id		= msdObj.vendor_id;
	obj.product_id		= msdObj.product_id;
	obj.serial_number	= msdObj.serial_number;

	return obj;
}

var SendError = function( res, code, message ){
	var ack = {};
	ack.error = { code : code, message : message };
	res.status(code).json(ack);
}

var brodcastMSDEventToApi = function( msdObj, event ){

	for(var key in msdObj.Apis) {
		var apiObj = msdObj.Apis[key];
		apiObj.webSocket.send(JSON.stringify(event));
	}
}

// GET	/dev/v1/micro_sd/removeAll : 모든 파일 시스템을 삭제한다.
R.route('/removeAll').post(function(req, res, next) {

	console.log( 'CALL API POST /dev/v1/micro_sd/removeAll' ); 

	initMSD();

	var ack = {};
	res.status(200).json(ack);
	
});

// GET	/dev/v1/micro_sd : 생성된 디바이스 목록
R.route('/').get(function(req, res, next) {

	console.log( 'CALL API GET /dev/v1/micro_sd' ); 
	
	var list = [];
	
	var keys = [];
	for(var key in msdObjs) {
		keys.push(key);
	}
	
	keys.sort();
	
	keys.forEach(function (id, index, ar) {
		
		var msdObj 	= msdObjs[id];
		var item	= getMSDState(msdObj);
		
		list.push( item );
		
	});	
	
	res.json(list);
	
});

// /dev/v1/micro_sd : 디바이스 등록
R.route('/').post(function(req, res, next) {

	console.log( 'CALL API POST /dev/v1/micro_sd' );
	
	// 파라메터를 얻는다.
 	var createOption = req.body;
	if ( !createOption )  { 
		SendError( res, 400, '등록에 필요한 파라메터가 없습니다.' );
		return; 
	}
	// 디바이스 옵션 프러퍼티 존재 체크 
	if ( typeof createOption.name			=== "undefined" )  { 
		SendError( res, 400, '등록에 필요한 name 파라메터가 없습니다.' );
		return; 
	}
		
	if ( typeof createOption.vendor_id		=== "undefined" )  { 
		SendError( res, 400, '등록에 필요한 vendor_id 파라메터가 없습니다.' );
		return; 
	}
	
	if ( typeof createOption.product_id	=== "undefined" )  { 
		SendError( res, 400, '등록에 필요한 product_id 파라메터가 없습니다.' ); 
		return; 
	}
	
	if ( typeof createOption.serial_number	=== "undefined" )  { 
		SendError( res, 400, '등록에 필요한 serial_number 파라메터가 없습니다.' ); 
		return; 
	}
	
	var msdObj 			= createMSDObj();

		msdObj.name				= createOption.name;
		msdObj.vendor_id		= createOption.vendor_id;
		msdObj.product_id		= createOption.product_id;
		msdObj.serial_number	= createOption.serial_number;

	
	msdObjs[msdObj.id] 	= msdObj;
	msdObjs_id 		 	= msdObjs_id + 1;
	
	var ack = getMSDState(msdObj);
	
	res.json(ack);
	
});

// GET 	/dev/v1/micro_sd/{id} : 디바이스 정보 얻기
R.route('/:id').get(function(req, res, next) {
	console.log( 'CALL API GET /dev/v1/micro_sd/{id}' ); 
	
	console.log('id:', req.params.id);

	var msdObj = msdObjs[req.params.id];

	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' ); 
		return; 
	}

	var ack = getMSDState(msdObj);
	
	res.json(ack);
		
});

// PUT	/dev/v1/micro_sd/{id}			: 디바이스 상태 수정
R.route('/:id').put(function(req, res, next) {
	console.log( 'CALL API PUT /dev/v1/micro_sd//{id}' ); 

	console.log('id:', req.params.id);

	var msdObj 		= msdObjs[req.params.id];
	var msdOption 	= req.body;
	
	if ( typeof msdObj	 === "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' ); 
		return; 
	}
	if ( typeof msdOption.id === "undefined")  { 
		SendError( res, 400, '디바이스 수정에 필요한 파라메터가 없습니다' );
		return; 
	}
	
	// 디바이스 옵션 프러퍼티 존재 체크
	if ( msdObj.id						!== msdOption.id )  { 
		SendError( res, 405, 'ID 에 해당하는 정보가 다릅니다.' ); 
		return; 
	}
	
	if ( typeof msdOption.name			 !== "undefined" )  { 
		msdObj.name			= msdOption.name;
	}

	if ( typeof msdOption.vendor_id	 !== "undefined" )  { 
		msdObj.vendor_id	= msdOption.vendor_id;
	}
	
	if ( typeof msdOption.product_id	 !== "undefined" )  { 
		msdObj.product_id	= msdOption.product_id;
	}

	if ( typeof msdOption.serial_number !== "undefined" )  { 
		msdObj.serial_number	= msdOption.serial_number;
	}
	
	var ack = getMSDState(msdObj);
	
	res.json(ack);
});

// DELETE 	/dev/v1/micro_sd/{id}  	: 디바이스 상태 삭제
R.route('/:id').delete(function(req, res, next) {

	console.log( 'CALL API DELETE /dev/v1/micro_sd/{id}' ); 
	console.log('id:', req.params.id);

	var msdObj = msdObjs[req.params.id];
	
	if ( typeof msdObj	 === "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' ); 
		return; 
	}
	
	var ack = getMSDState(msdObj);
	
	delete msdObjs[req.params.id];

	res.json(ack);
		
});


// POST /dev/v1/micro_sd/login : 디바이스 클라이언트 로그인
R.route('/login').post(function(req, res, next) {

	console.log( 'CALL API POST /dev/v1/micro_sd/login' );
	
	// 파라메터를 얻는다.
 	var loginOption = req.body;
	if ( !loginOption )  { 
		SendError( res, 400, '로그인에 필요한 파라메터가 없습니다.' );
		return; 
	}
		
	if ( typeof loginOption.vendor_id		=== "undefined" )  { 
		SendError( res, 400, '등록에 필요한 vendor_id 파라메터가 없습니다.' );
		return; 
	}
	
	if ( typeof loginOption.product_id	=== "undefined" )  { 
		SendError( res, 400, '등록에 필요한 product_id 파라메터가 없습니다.' ); 
		return; 
	}
	
	if ( typeof loginOption.serial_number	=== "undefined" )  { 
		SendError( res, 400, '등록에 필요한 serial_number 파라메터가 없습니다.' ); 
		return; 
	}
	
	var msdObj 		= getMsdObjByVPS(loginOption);
	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 400, '로그인에 필요한 파라메타가 잘못되었습니다.' ); 
		return; 
	}
	
	var ack 		= getMSDState(msdObj);
	
	res.json(ack);
	
});

// POST /dev/v1/micro_sd/logout : 디바이스 클라이언트 로그아웃
R.route('/:id/logout').post(function(req, res, next) {
	console.log( 'CALL API GET /dev/v1/micro_sd/{id}/logout' ); 

	console.log('id:', req.params.id);

	var msdObj = msdObjs[req.params.id];

	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' ); 
		return; 
	}

	var ack = getMSDState(msdObj);
	
	res.json(ack);
		
});

// POST /dev/v1/micro_sd/{id}/insert : 마이크로 SD 카드 삽입 통보
R.route('/:id/insert').post(function(req, res, next) {
	console.log( 'CALL API GET /dev/v1/micro_sd/{id}/insert' ); 

	console.log('id:', req.params.id);

	var msdObj = msdObjs[req.params.id];

	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' ); 
		return; 
	}

	var msdOption 	= req.body;
	
	if ( typeof msdOption.size === "undefined")  { 
		SendError( res, 400, '디바이스 삽입 통보에 필요한 파라메터가 없습니다' );
		return; 
	}
	
	var ack = getMSDState(msdObj);
	res.json(ack);
	
	var event = {
		cmd : 'inserted',
		data : {
			size : msdOption.size,
		}
	};
	brodcastMSDEventToApi( msdObj, event );
		
});

// POST /dev/v1/micro_sd/{id}/remove : 마이크로 SD 카드 제거 통보
R.route('/:id/remove').post(function(req, res, next) {
	console.log( 'CALL API GET /dev/v1/micro_sd/{id}/remove' ); 

	console.log('id:', req.params.id);

	var msdObj = msdObjs[req.params.id];

	if ( typeof msdObj	=== "undefined" )  {
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' );
		return;
	}

	var ack = getMSDState(msdObj);
	res.json(ack);
	
	var event = {
		cmd : 'removed',
		data : {
//			size : msdOption.size,
		}
	};
	brodcastMSDEventToApi( msdObj, event );
	
		
});

// GET	/dev/v1/micro_sd/{id}/api : 마이크로 SD 카드 접속 API 목록
R.route('/:id/api').get(function(req, res, next) {

	console.log( 'CALL API GET /dev/v1/micro_sd/{id}/api' ); 

	console.log('id:', req.params.id);

	var msdObj = msdObjs[req.params.id];

	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' ); 
		return; 
	}

	
	var list = [];
	
	var keys = [];
	for(var key in msdObj.Apis) {
		keys.push(key);
	}
	
	keys.sort();
	
	keys.forEach(function (api_id, index, ar) {
		
		var item	= getMSDApiState(msdObj, api_id );
		list.push( item );
		
	});	
	
	res.json(list);
	
});


// POST /dev/v1/micro_sd/api/open : 디바이스 어플리케이션 오픈
R.route('/api/open').post(function(req, res, next) {

	console.log( 'CALL API POST /dev/v1/micro_sd/api/open' );
	
	// 파라메터를 얻는다.
 	var openOption = req.body;
	if ( !openOption )  {
		SendError( res, 400, '오픈에 필요한 파라메터가 없습니다.' );
		return;
	}

	if ( typeof openOption.vendor_id		=== "undefined" )  { 
		SendError( res, 400, '오픈에 필요한 vendor_id 파라메터가 없습니다.' );
		return; 
	}

	if ( typeof openOption.product_id	=== "undefined" )  { 
		SendError( res, 400, '오픈에 필요한 product_id 파라메터가 없습니다.' ); 
		return; 
	}

	if ( typeof openOption.serial_number	=== "undefined" )  { 
		SendError( res, 400, '오픈에 필요한 serial_number 파라메터가 없습니다.' ); 
		return; 
	}

	var msdObj 		= getMsdObjByVPS(openOption);
	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 400, '오픈에 필요한 파라메타가 잘못되었습니다.' ); 
		return; 
	}
	
	var api_id = msdObj.Apis_id;
	msdObj.Apis_id	= msdObj.Apis_id + 1;
	
	msdObj.Apis[api_id]	= createApiObj(api_id);

	var ack = getMSDApiState(msdObj, api_id );

	res.json(ack);

});

// POST /dev/v1/micro_sd/api/{id}/{api_id}/close : 디바이스 어플리케이션 클로즈
R.route('/api/:id/:api_id/close').post(function(req, res, next) {
	console.log( 'CALL API GET /dev/v1/micro_sd/api/{id}/{api_id}/close' ); 

	console.log('id:'		, req.params.id);
	console.log('api_id:'	, req.params.api_id);

	var msdObj = msdObjs[req.params.id];
	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 정보가 없습니다.' ); 
		return; 
	}

	var api_id = req.params.api_id;
	var apiObj = msdObj.Apis[api_id];
	if ( typeof msdObj	=== "undefined" )  { 
		SendError( res, 404, 'ID 에 해당하는 디바이스 API 정보가 없습니다.' ); 
		return; 
	}

	var ack = getMSDApiState(msdObj, api_id );
	
	delete msdObj.Apis[api_id];
	
	res.json(ack);
		
});

R.ws('/api/:id/:api_id', function(ws, req, next) {
	console.log( 'CALL API WS /dev/v1/micro_sd/api/{id}/{api_id}' ); 
	console.log( 'id:'		, req.params.id );
	console.log( 'api_id:'	, req.params.api_id );

	var msdObj = msdObjs[req.params.id];
	if ( typeof msdObj	=== "undefined" )  { 
		console.log('Unknown ID Connection');
		ws.close();
		return; 
	}

	var api_id = req.params.api_id;
	var apiObj = msdObj.Apis[api_id];
	if ( typeof msdObj	=== "undefined" )  { 
		console.log('Unknown API ID  Connection');
		ws.close();
		return; 
	}
	
	apiObj.webSocket	= ws;

//	ws.on('message', function(msg) {
//
//		console.log('id:', req.params.id);
//		console.log( msg );
//
//		var msgObj	= JSON.parse(msg);
//
//		console.log( 'msgObj.cmd = ', msgObj.cmd );
//
//		switch(msgObj.cmd) {
//		case 'echo':
//			var echoData = msgObj;
//			echoData.cmd = 'ack';
//			echoData.id = fsObj.id;
//
//			ws.send(JSON.stringify(echoData));
//			break;
//		default:
//
//			console.log('filesystem.js: Unknown Command ws req');
//			break;
//
//		}
//
//	});

});

module.exports = R;

