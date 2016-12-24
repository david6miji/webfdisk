'use strict';

console.log( 'CALL workspace.js' );

var user_id = 1234;

export default class workSpace {
	constructor() {
		console.log( 'CALL new workSpace()' );
	}
	
	static get user_id()   { return user_id; }
	static set user_id(id) { user_id = id;    }
}

