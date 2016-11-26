var

	express 	= require('express'),
	R 			= express.Router(),
	udev 		= require("udev"),

end_require= true;


console.log( "CALL mmc.js" );

// console.log(udev.list()); 

var monitor = udev.monitor();

monitor.on('add', function (device) {
	console.log('added ' + device.DEVNAME );
	if( typeof device.DEVNAME !== "undefined" ) {
		console.log('added ' + device.DEVNAME );
	}
});

monitor.on('remove', function (device) {
	console.log('removed ' + device.DEVNAME );
	if( typeof device.DEVNAME !== "undefined" ) {
		console.log('removed ' + device.DEVNAME );
	}
});

monitor.on('change', function (device) {
	console.log('changed ' + device.DEVNAME );
	if( typeof device.DEVNAME !== "undefined" ) {
		console.log('changed ' + device.DEVNAME );
	}
});
		
// GET  	/builds/driver/list			: 생성된 빌드 목록
R.route('/list').get(function(req, res, next) {

	console.log( 'CALL API GET /builds/mmc/list' ); 
	
	var list = [];
	
	res.json(list);
	
});

module.exports = R;

