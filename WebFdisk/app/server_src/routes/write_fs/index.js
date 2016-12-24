var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
var publicPath = path.join(__dirname, 'public');

router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Write File System' });
	res.sendfile(publicPath + '/index.html');
});

module.exports = router;
