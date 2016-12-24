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

describe.only('파일시스템 API 를 검사한다.', function() {
	it('모든 파일 시스템을 삭제한다.', function (done) {
		chai.request(urlBase)
			.post('/builds/v1/filesystems/removeAll')
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('파일시스템 목록 수가 0이어야 한다.', function (done) {
		chai.request(urlBase)
			.get('/builds/v1/filesystems')
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
	
	it('파일시스템 목록 수가 1 이어야 한다.', function (done) {
		chai.request(urlBase)
			.get('/builds/v1/filesystems')
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
	
	it('생성된 파일시스템 상태를 얻는다.', function (done) {
		var checkState = {
			"id"		: 0,
			"name"		: "AM335x Base File System",
			"user_id"	: "0001",
			"project_id": "0001",
		};
		
		chai.request(urlBase)
			.get('/builds/v1/filesystems/0')
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
	
	it('파일시스템 상태를 수정한다.', function (done) {
		var modifyOption = {
			"id"		: 0,
			"name"		: "AM335x Base File System2",
			"user_id"	: "0002",
			"project_id": "0002",
		};
	
		chai.request(urlBase)
			.put('/builds/v1/filesystems/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('수정된 파일시스템 상태를 확인한다.', function (done) {
		var checkOption = {
			"id"		: 0,
			"name"		: "AM335x Base File System2",
			"user_id"	: "0002",
			"project_id": "0002",
		};
	
		chai.request(urlBase)
			.get('/builds/v1/filesystems/0')
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
	
	it('옵션에 ID가 없는 경우 파일시스템 상태 수정 거부를 체크 한다.', function (done) {
		var modifyOption = {
			"name"		: "AM335x Base File System4",
			"user_id"	: "0004",
			"project_id": "0004",
		};
	
		chai.request(urlBase)
			.put('/builds/v1/filesystems/0')
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
			"name"		: "AM335x Base File System3",
			"user_id"	: "0003",
			"project_id": "0003",
		};
	
		chai.request(urlBase)
			.put('/builds/v1/filesystems/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.not.null;
				res.should.have.status(405);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
		
	it('파일시스템 상태에 name 만 수정한다.', function (done) {
		var modifyOption = {
			"id"		: 0,
			"name"		: "AM335x Base File System 5",
		};
	
		chai.request(urlBase)
			.put('/builds/v1/filesystems/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('name 만 수정되었는가를 확인한다.', function (done) {
		var checkState = {
			"id"		: 0,
			"name"		: "AM335x Base File System 5",
			"user_id"	: "0002",
			"project_id": "0002",
		};
		
		chai.request(urlBase)
			.get('/builds/v1/filesystems/0')
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
	
	it('파일시스템 상태에 user_id 만 수정한다.', function (done) {
		var modifyOption = {
			"id"		: 0,
			"user_id"	: "0003",
		};
	
		chai.request(urlBase)
			.put('/builds/v1/filesystems/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('user_id 만 수정되었는가를 확인한다.', function (done) {
		var checkState = {
			"id"		: 0,
			"name"		: "AM335x Base File System 5",
			"user_id"	: "0003",
			"project_id": "0002",
		};
		
		chai.request(urlBase)
			.get('/builds/v1/filesystems/0')
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

	it('파일시스템 상태에 project_id 만 수정한다.', function (done) {
		var modifyOption = {
			"id"		: 0,
			"project_id"	: "0003",
		};
	
		chai.request(urlBase)
			.put('/builds/v1/filesystems/0')
			.send( modifyOption )
			.end(function(err, res) {
				expect(err).to.be.null;
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('object');
				done();
			});
		
	});
	
	it('project_id 만 수정되었는가를 확인한다.', function (done) {
		var checkState = {
			"id"		: 0,
			"name"		: "AM335x Base File System 5",
			"user_id"	: "0003",
			"project_id": "0003",
		};
		
		chai.request(urlBase)
			.get('/builds/v1/filesystems/0')
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
	
	it('파일 리스트 갯수가 0이어야 한다.', function (done) {
		chai.request(urlBase)
			.get('/builds/v1/filesystems')
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
	
});

