'use strict';

export const codeViewId		= 'codeView';

export default class _global {
	constructor() {
		console.log( 'CALL _global' );
	}

	static get codeViewId() { return codeViewId; }
}




