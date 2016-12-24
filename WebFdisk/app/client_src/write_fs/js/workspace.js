'use strict';

console.log( 'CALL workspace.js' );

var fs_id 		= 0;
var fs_name 	= 0;
var user_id 	= 0;
var project_id 	= 0;

export default class workSpace {
	constructor() {
		console.log( 'CALL new workSpace()' );
	}
	
	static get fs_id()   		{ return fs_id; 		}
	static set fs_id(id) 		{ fs_id = id;    		}
	
	static get fs_name()   	{ return fs_name; 		}
	static set fs_name(name) 	{ fs_name = name;   	}
	
	static get user_id()   	{ return user_id; 		}
	static set user_id(id) 	{ user_id = id;  		}
	
	static get project_id()   	{ return project_id; 	}
	static set project_id(id) 	{ project_id = id;  	}
	
}

