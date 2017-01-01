var
	pty 		= require('pty.js'),

end_require= true;

console.log( 'CALL udevadm.js' );

var udevadm = pty.spawn('udevadm', ['monitor'] );

udevadm.on('data', (data) => {
	console.log('udevadm:data >> ', data);
});

udevadm.on('exit', (code) => {
    console.log('udevadm:exit>> ', code);
});

var kkk = "hello";

module.exports = kkk;

