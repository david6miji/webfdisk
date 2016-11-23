'use strict';

export default class menuCtrl {
	constructor($rootScope, $scope, $http, $interval) {
		console.log( 'CALL menuCtrl' );

        $('#toolbar').w2toolbar({
        	name: 'toolbar',
        	items: [
        		{ type: 'menu',		id: 'new',			caption	: 'New', 				icon: 'fa fa-file', items: [
        			{				id: 'program',		text	: 'New Program...',		icon: 'fa fa-clipboard' },
        			{ 				id: 'folder',		text	: 'New Folder...',		icon: 'fa fa-folder' },
        			{ 				id: 'lib',			text	: 'New Library...',		icon: 'fa fa-files-o' },
                    { 				id: 'file',			text	: 'New File...',		icon: 'fa fa-file-o' }
				]},
                { type: 'button',	id: 'import',		caption	: 'Import',				icon: 'fa fa-th' },
                { type: 'break' },
                { type: 'button',	id: 'save',			caption	: 'Save',				icon: 'fa fa-save' },
                { type: 'button',	id: 'saveAll',		caption	: 'Save All',			icon: 'fa fa-save' },
        		{ type: 'break' },
                { type: 'menu',		id: 'build', 		caption	: 'Build',				icon: 'fa fa-play', items: [
                    {				id: 'clean',		text: 'Clean',  				icon: 'fa fa-eraser' },
					{				id: 'build',		text: 'Build',      			icon: 'fa fa-play' },
					{				id: 'log',			text: 'LOG',	      			icon: 'fa fa-play' },
                ]},
				{ type: 'break' },
                { type: 'menu',		id: 'commit', 		caption	: 'commit',				icon: 'fa fa-database', items: [
                    {				id: 'commit',		text: 'commit',      			icon: 'fa fa-database' },
                    {				id: 'publish',		text: 'Publish',  				icon: 'fa fa-download' },
				]},
				{ type: 'button',	id: 'revision',		caption: 'Revision',			icon: 'fa fa-clock-o' },
				{ type: 'break' },
        		{ type: 'button',	id: 'undo',			caption: '',					icon: 'fa fa-rotate-left' },
                { type: 'button',	id: 'do',			caption: '',					icon: 'fa fa-rotate-right' },
                { type: 'break' },
                { type: 'button',	id: 'view',			caption: '',					icon: 'fa fa-eye' },
                { type: 'break' },
                { type: 'button',	id: 'print',		caption: '',					icon: 'fa fa-print' },
                { type: 'break' },
                { type: 'button',	id: 'magic',		caption: '',					icon: 'fa fa-magic' },
                { type: 'break' },
                { type: 'button',	id: 'help',			caption: 'Help',				icon: 'fa fa-question'}
			]
        });

		w2ui.toolbar.on('click', function(event) {
            if(event.target == 'build:clean') {
				$http.post('http://192.168.10.15:7000/builds/driver/0/clean')
				.then((res) => {
					
					var ack = res.data;
					
				}, (res) => {
					
					console.log('clean Error : ', res.status);
					console.log('clean Error : ', res.statusText);
				});
            }

			if(event.target == 'build:build') {
                $http.post('http://192.168.10.15:7000/builds/driver/0/start')
				.then((res) => {
				
					var ack = res.data;
					
				}, (res) => {
					
					console.log('start(build) Error : ', res.status);
					console.log('start(build) Error : ', res.statusText);
				});
            }
			
			if(event.target == 'build:log') {
				var g = w2ui['grid'].records.length;
				w2ui['grid'].add( { recid: g + 1, line: 'test !!!!!!!!'} );
			}

		});
	}
}

menuCtrl.$inject = [ '$rootScope', '$scope', '$http', '$interval' ];
