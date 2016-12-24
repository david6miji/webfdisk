'use strict';

console.log('CALL main.js');

import angular 				from 	'angular';
import uirouter 			from 	'angular-ui-router';
import ngResource 			from 	'angular-resource';
import ngWs					from    'ng-ws';

import running 				from 	'./app.run.js';
import routing 				from 	'./app.routing.js';

import bodyCtrl 			from 	'./ctrl-body.js';
import indexCtrl 			from 	'./ctrl-index.js';
import waitCtrl 			from 	'./ctrl-wait.js';
import writingCtrl 			from 	'./ctrl-writing.js';
import finishCtrl 			from 	'./ctrl-finish.js';

import testSvc 			    from 	'./svc-test.js';
import wsSvc 			    from 	'./svc-ws.js';

angular.module('app',
[
	'ui.router',
	'ng-ws'
])

.run		( running 							)
.config		( routing 							)

.controller	( 'bodyCtrl'		, bodyCtrl 		)

.controller	( 'indexCtrl'		, indexCtrl 	)
.controller	( 'waitCtrl'		, waitCtrl 		)
.controller	( 'writingCtrl'		, writingCtrl 	)
.controller	( 'finishCtrl'		, finishCtrl 	)

.service    ( 'testSvc'			, testSvc		)
.service    ( 'wsSvc'			, wsSvc			)
;
