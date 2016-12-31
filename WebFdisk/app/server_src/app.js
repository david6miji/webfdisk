'use strict';

var express 		= require('express');
var path 			= require('path');
var favicon 		= require('serve-favicon');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');

var routes 			= require('./routes/index');

var build_fs		= require('./routes/builds/filesystems');
var build_driver	= require('./routes/builds/driver');
var build_mmc		= require('./routes/builds/mmc');

var micro_sd		= require('./routes/dev/micro_sd');

// var write_fs 		= require('./routes/write_fs/index');

var udevadm			= require('./udevadm');

var app = express();

app.use(favicon(path.join(__dirname, '../client_dist/img', 'favicon.ico')));
// app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static( path.join(__dirname, '../client_dist')));

app.use(express.static( path.join(__dirname, '../client_dist/write_fs')));

// CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
				"Origin, X-Requested-With, Content-Type, Accept");
			
  if(req.method === 'OPTIONS') {
	res.header('Access-Control-Allow-Headers', 
				'Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length');
	res.header('Access-Control-Allow-Methods', 
				'GET, PUT, POST, DELETE, OPTIONS');
	res.status(200).send('');
  } else {
	next(); 
  }

});


app.use('/'							, routes);
app.use('/builds/v1/filesystems/'	, build_fs );
app.use('/builds/driver/'			, build_driver );
app.use('/dev/v1/micro_sd/'			, micro_sd );

// app.use('/write_fs/'				, write_fs );


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	
	console.log( 'ACCESS = ', req.method, req.originalUrl );
	res.status(404).send('현재 이 패스는 지원하지 않습니다.');
	
//	var err = new Error('Not Found');
//	err.status = 404;
//	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
