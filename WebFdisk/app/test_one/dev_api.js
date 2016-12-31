var
	chai 		= require( 'chai' ),
	should 		= chai.should(),
	expect 		= chai.expect,
	assert 		= chai.assert,
	chaiHttp 	= require('chai-http'),
	fs			= require('fs'),
	path		= require('path'),
	webSocket 	= require('ws'),
	
require_end;

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

var urlBase 	= 'http://localhost:3000';
var urlBaseWS 	= 'ws://localhost:3000';

describe('디바이스 API 를 검사한다.', 
function() {

	it('모든 디바이스를 삭제한다.', 
	function (done) {
		
		chai.request(urlBase)
			.post('/dev/v1/micro_sd/removeAll')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('디바이스 목록 수가 0이어야 한다.', 
	function (done) {
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				var list = res.body;
				assert.equal( 0, list.length );
				done();
			});
		
	});
	
	it('디바이스 하나를 생성한다.', 
	function (done) {
		
		var createOption = {
			"name"			: "유영창 노트북 SD 카드",
			"vendor_id"		: "FA001",
			"product_id"	: "MSD001",
			"serial_number"	: "0001",
		};

		chai.request(urlBase)
			.post('/dev/v1/micro_sd')
			.send( createOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();                  
			});		
	});
	
	it('디바이스 목록 수가 1 이어야 한다.', 
	function (done) {
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				var list = res.body;
				assert.equal( 1, list.length );
				done();
			});
		
	});
	
	it('생성된 디바이스 상태를 얻는다.', 
	function (done) {
		
		var checkState = {
			"id"		: 0,
			"name"			: "유영창 노트북 SD 카드",
			"vendor_id"		: "FA001",
			"product_id"	: "MSD001",
			"serial_number"	: "0001",
		};
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkState.id				, Status.id );
				assert.equal( checkState.name			, Status.name );
				assert.equal( checkState.vendor_id		, Status.vendor_id );
				assert.equal( checkState.product_id		, Status.product_id );
				assert.equal( checkState.serial_number	, Status.serial_number );
				done();
			});
		
	});
	
	it('디바이스 상태를 수정한다.', 
	function (done) {
		
		var modifyOption = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};
	
		chai.request(urlBase)
			.put('/dev/v1/micro_sd/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});

	it('수정된 디바이스 상태를 확인한다.', 
	function (done) {
		
		var checkOption = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};
	
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkOption.id			, Status.id );
				assert.equal( checkOption.name			, Status.name );
				assert.equal( checkOption.user_id		, Status.user_id );
				assert.equal( checkOption.project_id	, Status.project_id );
				done();
			});
		
	});

	it('옵션에 ID가 없는 경우 디바이스 상태 수정 거부를 체크 한다.', 
	function (done) {
		
		var modifyOption = {
			"name"			: "유영창 노트북 SD 카드",
			"vendor_id"		: "FA004",
			"product_id"	: "MSD004",
			"serial_number"	: "0004",
		};
	
		chai.request(urlBase)
			.put('/dev/v1/micro_sd/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.not.null;
				res.should.have.status(400);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('옵션 ID를 잘못 설정시 파일시스템 상태 수정 거부를 체크 한다.', function (done) {
		var modifyOption = {
			"id"		: 1,
			"name"			: "유영창 노트북 SD 카드",
			"vendor_id"		: "FA003",
			"product_id"	: "MSD003",
			"serial_number"	: "0003",
		};
	
		chai.request(urlBase)
			.put('/dev/v1/micro_sd/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.not.null;
				res.should.have.status(405);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});

	it('디바이스 상태에 name 만 수정한다.', 
	function (done) {
		
		var modifyOption = {
			"id"		: 0,
			"name"			: "유영창 노트북 SD 카드 2",
		};
	
		chai.request(urlBase)
			.put('/dev/v1/micro_sd/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('name 만 수정되었는가를 확인한다.', 
	function (done) {
		
		var checkState = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA001",
			"product_id"	: "MSD001",
			"serial_number"	: "0001",
		};
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				done();
			});
		
	});
	
	it('디바이스 상태에 vendor_id 만 수정한다.', 
	function (done) {
		
		var modifyOption = {
			"id"		: 0,
			"vendor_id"		: "FA002",
		};
	
		chai.request(urlBase)
			.put('/dev/v1/micro_sd/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('vendor_id 만 수정되었는가를 확인한다.', 
	function (done) {
		
		var checkState = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD001",
			"serial_number"	: "0001",
		};
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				done();
			});
		
	});
	
	it('디바이스 상태에 product_id 만 수정한다.', 
	function (done) {
		
		var modifyOption = {
			"id"		: 0,
			"product_id"	: "MSD002",
		};
	
		chai.request(urlBase)
			.put('/dev/v1/micro_sd/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});

	it('product_id 만 수정되었는가를 확인한다.', 
	function (done) {
		
		var checkState = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0001",
		};
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				done();
			});
		
	});

	it('디바이스 상태에 serial_number 만 수정한다.', 
	function (done) {
		
		var modifyOption = {
			"id"		: 0,
			"serial_number"	: "0002",
		};
	
		chai.request(urlBase)
			.put('/dev/v1/micro_sd/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});

	it('serial_number 만 수정되었는가를 확인한다.', 
	function (done) {
		
		var checkState = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				done();
			});
		
	});
	

	it('디바이스 클라이언트가 로그인 한다.', 
	function (done) {
		
		var loginOption = {
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};
		var checkState = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};

		chai.request(urlBase)
			.post('/dev/v1/micro_sd/login')
			.send( loginOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				done();                  
			});		
	});
	
	it('디바이스 어플리케이션이 오픈 한다.', 
	function (done) {
		
		var openOption = {
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};

		var checkState = {
			"id"			: 0,
			"api_id"		: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};

		chai.request(urlBase)
			.post('/dev/v1/micro_sd/api/open')
			.send( openOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.api_id		, Status.api_id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				done();                  
			});		
	});
	
	it('디바이스 API 목록 수가 1 이어야 한다.', 
	function (done) {
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0/api')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				var list = res.body;
				assert.equal( 1, list.length );
				done();
			});
		
	});
	
	it('ID 가 0인 디바이스 API 웹소켓에 접속한다.', function (done) {
		
		global.dev_api_ws = new webSocket( 
							  urlBaseWS + '/dev/v1/micro_sd/api/0/0' 
							);
		
		dev_api_ws.on('open', function () {
			setTimeout(done, 100);
		});

		dev_api_ws.on('close', function open() {
			assert.equal( 0, 1, "Error: dev api ws close" );
		});
		
	});
	
	
	it('SD 카드 삽입 검사', 
	function (done) {
		
		describe( '디바이스 어플리케이션은 SD 카드가 삽입 되었음을 기다린다.', 
		function() {

			var checkEvent = {
				cmd : 'inserted',
				data : {
					size : 400000000000,
				}
			};
		
			global.dev_api_ws.once('message', function(event, flags) {
				var evnetObj	= JSON.parse(event);
				assert.equal( evnetObj.cmd			, checkEvent.cmd );
				assert.equal( evnetObj.data.size	, checkEvent.data.size );
				
				done();
			});

		});

		describe( '디바이스 클라이언트가 SD 카드가 삽입 되었음을 알린다.', 
		function() {
			
			var InsertOption = {
				"size": 400000000000,
			};

			var checkState = {
				"id"			: 0,
				"name"			: "유영창 노트북 SD 카드 2",
				"vendor_id"		: "FA002",
				"product_id"	: "MSD002",
				"serial_number"	: "0002",
			};
		
			chai.request(urlBase)
				.post('/dev/v1/micro_sd/0/insert')
				.send( InsertOption )
				.end(function(err, res) {
					expect(err).to.be.null;
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					var Status = res.body;
					assert.equal( checkState.id			, Status.id );
					assert.equal( checkState.name		, Status.name );
					assert.equal( checkState.user_id	, Status.user_id );
					assert.equal( checkState.project_id	, Status.project_id );
				});		
			
		});

	});
	
	it('SD 카드 제거 검사', 
	function (done) {
		describe( '디바이스 어플리케이션은 SD 카드가 제거됨을 기다린다.', 
		function() {
			
			var checkEvent = {
				cmd : 'removed',
				data : {
				}
			};
		
			global.dev_api_ws.once('message', function(event, flags) {
				var evnetObj	= JSON.parse(event);
				assert.equal( evnetObj.cmd			, checkEvent.cmd );
				
				done();
			});
			
		});
		
		describe( '디바이스 클라이언트가 SD 카드가 제거 되었음을 알린다.', 
		function() {
			var checkState = {
				"id"			: 0,
				"name"			: "유영창 노트북 SD 카드 2",
				"vendor_id"		: "FA002",
				"product_id"	: "MSD002",
				"serial_number"	: "0002",
			};

			chai.request(urlBase)
				.post('/dev/v1/micro_sd/0/remove')
				.end(function(err, res) {
					expect(err).to.be.null;
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					var Status = res.body;
					assert.equal( checkState.id			, Status.id );
					assert.equal( checkState.name		, Status.name );
					assert.equal( checkState.user_id	, Status.user_id );
					assert.equal( checkState.project_id	, Status.project_id );
				});		
				
		});
		
	});
	
	
//	it('디바이스 클라이언트가 SD 카드가 제거되었음을 알린다.', 
//	function (done) {
//		
//		var checkState = {
//			"id"			: 0,
//			"name"			: "유영창 노트북 SD 카드 2",
//			"vendor_id"		: "FA002",
//			"product_id"	: "MSD002",
//			"serial_number"	: "0002",
//		};
//
//		chai.request(urlBase)
//			.post('/dev/v1/micro_sd/0/remove')
//			.end(function(err, res) {
//				expect(err).to.be.null;
//				res.should.have.status(200);
//				res.should.be.json;
//				res.body.should.be.a('object');
//				var Status = res.body;
//				assert.equal( checkState.id			, Status.id );
//				assert.equal( checkState.name		, Status.name );
//				assert.equal( checkState.user_id	, Status.user_id );
//				assert.equal( checkState.project_id	, Status.project_id );
//				done();                  
//			});		
//	});

	it('디바이스 어플리케이션이 클로즈 한다.', 
	function (done) {
		
		var checkState = {
			"id"			: 0,
			"api_id"		: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};

		chai.request(urlBase)
			.post('/dev/v1/micro_sd/api/0/0/close')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.api_id		, Status.api_id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				
				global.dev_api_ws.removeAllListeners( 'open' );
				global.dev_api_ws.removeAllListeners( 'close' );
				global.dev_api_ws.close();
				delete global.dev_api_ws;
				done();                  
			});		
	});
	
	it('디바이스 API 목록 수가 0 이어야 한다.', 
	function (done) {
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0/api')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				var list = res.body;
				assert.equal( 0, list.length );
				done();
			});
		
	});
	

	it('디바이스 클라이언트가 로그아웃 한다.', 
	function (done) {
		
		var checkState = {
			"id"			: 0,
			"name"			: "유영창 노트북 SD 카드 2",
			"vendor_id"		: "FA002",
			"product_id"	: "MSD002",
			"serial_number"	: "0002",
		};

		chai.request(urlBase)
			.post('/dev/v1/micro_sd/0/logout')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				var Status = res.body;
				assert.equal( checkState.id			, Status.id );
				assert.equal( checkState.name		, Status.name );
				assert.equal( checkState.user_id	, Status.user_id );
				assert.equal( checkState.project_id	, Status.project_id );
				done();                  
			});		
	});
	
	it('ID 가 0 인 디바이스 상태를 삭제한다.', 
	function (done) {
		
		chai.request(urlBase)
			.delete('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('삭제된 디바이스 상태를 확인한다.', 
	function (done) {
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd/0')
			.end(function(err, res) {
				expect(err).to.not.null;
				res.should.have.status(404);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('디바이스 목록 수가 0이어야 한다.', 
	function (done) {
		
		chai.request(urlBase)
			.get('/dev/v1/micro_sd')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				var list = res.body;
				assert.equal( 0, list.length );
				done();
			});
		
	});
	
/*	
	
	it('파일시스템 하나를 생성한다.', function (done) {
		var createOption = {
			"name"		: "AM335x Base File System",
			"user_id"	: "0001",
			"project_id": "0001",
		};

		chai.request(urlBase)
			.post('/builds/v1/filesystems')
			.send( createOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();                  
			});		
	});
	
	it('파일시스템 목록 수가 2 이어야 한다.', function (done) {
		chai.request(urlBase)
			.get('/builds/v1/filesystems')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				var list = res.body;
				assert.equal( 2, list.length );
				done();
			});
		
	});
	
	
	it('ID 가 0인 파일시스템 웹소켓 접속을 확인한다.', function (done) {
		
		var ws = new webSocket( urlBaseWS + '/builds/v1/filesystems/0' );
		var testObj = { cmd : "echo", id : 0, data : 'Check Data' };
		
		ws.on('open', function open() {
			ws.send(JSON.stringify(testObj));
		});

		ws.on('message', function(data, flags) {

			expect(data).to.be.a( 'string' );
			var msgObj	= JSON.parse(data);
			
			assert.equal( msgObj.cmd , 'ack' );
			assert.equal( msgObj.id  , testObj.id );
			assert.equal( msgObj.data, testObj.data );
			
			ws.close();
			done();
		});
		
	});

	it('ID 가 1인 파일시스템 웹소켓 접속을 확인한다.', function (done) {
		
		var ws = new webSocket( urlBaseWS + '/builds/v1/filesystems/1' );
		var testObj = { cmd : "echo", id : 1, data : 'Check Data' };
		
		ws.on('open', function open() {
			ws.send(JSON.stringify(testObj));
		});

		ws.on('message', function(data, flags) {
			
			expect(data).to.be.a( 'string' );
			var msgObj	= JSON.parse(data);
			
			assert.equal( msgObj.cmd , 'ack' );
			assert.equal( msgObj.id  , testObj.id );
			assert.equal( msgObj.data, testObj.data );
			
			ws.close();
			done();
		});
		
	});
	
	it('ID 가 0 인 파일시스템 상태를 삭제한다.', function (done) {
		chai.request(urlBase)
			.delete('/builds/v1/filesystems/0')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('삭제된 파일 상태를 확인한다.', function (done) {
		chai.request(urlBase)
			.get('/builds/v1/filesystems/0')
			.end(function(err, res) {
				expect(err).to.not.null;
				res.should.have.status(404);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('ID 가 1 인 파일시스템 상태를 삭제한다.', function (done) {
		chai.request(urlBase)
			.delete('/builds/v1/filesystems/1')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('삭제된 파일 상태를 확인한다.', function (done) {
		chai.request(urlBase)
			.get('/builds/v1/filesystems/1')
			.end(function(err, res) {
				expect(err).to.not.null;
				res.should.have.status(404);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
*/
	
});

