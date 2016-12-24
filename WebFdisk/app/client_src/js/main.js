'use strict';

console.log('CALL main.js');

import angular 				from 	'angular';
import uirouter 			from 	'angular-ui-router';
import ngResource 			from 	'angular-resource';
import ngWs					from    'ng-ws';
import running 				from 	'./app.run.js';
import routing 				from 	'./app.routing.js';
import indexCtrl 			from 	'./ctrl-index.js';
import titleCtrl 			from 	'./ctrl-title.js';
import menuCtrl 			from 	'./ctrl-menu.js';
import leftCtrl 			from 	'./ctrl-left.js';
import rightCtrl 			from 	'./ctrl-right.js';
import previewCtrl 			from 	'./ctrl-preview.js';
import bottomCtrl	 	    from 	'./ctrl-bottom.js';

import mainCtrl 			from 	'./ctrl-main.js';
import configCtrl 			from 	'./ctrl-config.js';
import testSvc 			    from 	'./svc-test.js';

angular.module('app',
[
	'ui.router',
	'ng-ws',
])

.run		( running )
.config		( routing )


.controller	( 'indexCtrl'		, indexCtrl 	)
.controller	( 'titleCtrl'		, titleCtrl 	)
.controller	( 'menuCtrl'		, menuCtrl 		)
.controller	( 'leftCtrl'		, leftCtrl 		)
.controller	( 'rightCtrl'		, rightCtrl 	)
.controller	( 'previewCtrl'		, previewCtrl 	)
.controller	( 'bottomCtrl'		, bottomCtrl 	)

.controller	( 'mainCtrl'		, mainCtrl 		)
.controller	( 'configCtrl'		, configCtrl 	)

.service    ( 'testSvc'			, testSvc		)

;
