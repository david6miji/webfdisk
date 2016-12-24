'use strict';

const codeViewId		= 'codeView';

console.log( 'CALL global.js' );

export default class _global {
	constructor() {
		console.log( 'CALL _global' );
	}

	static get codeViewId() { return codeViewId; }
	
	static	AngularJSLastCall( timeoutObj,httpObj, cb ){
		var waitForRenderAndDoSomething = function() {
			// Wait for all templates to be loaded
			if(httpObj.pendingRequests.length > 0) {
				timeoutObj(waitForRenderAndDoSomething); 
				return;
			} 
			// the code which needs to run after dom rendering
			cb();
		}
		
		// Waits for first digest cycle		
		timeoutObj(waitForRenderAndDoSomething); 
			
	}
}
