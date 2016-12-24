'use strict';

import _WS		    from './workspace.js';	

import 'codemirror/lib/codemirror.css';
import codeMirror			from 'codemirror/lib/codemirror.js';

export default class indexCtrl {
	constructor($scope, $http, $interval, testSvc ) {
		console.log( 'CALL indexCtrl()' );
		console.log( '_WS.user_id = ', _WS.user_id );
		$scope.init = function(){
			console.log('indexCtrl:init()');
		}
		
		testSvc.initAPI();
			
	}
}

// indexCtrl.$inject = [ '$scope', '$http', '$interval', 'testSvc' ];
