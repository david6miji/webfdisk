'use strict';

routing.$inject = [
	'$stateProvider',
	'$urlRouterProvider',
	'$httpProvider',
];

export default function routing
(
	$stateProvider,
	$urlRouterProvider,
	$httpProvider,
) {

	$stateProvider
	
	.state('init', {
		url: '/init',
		views: {
			'main':	{
				templateUrl: '/view/main.html',
				controller: 'mainCtrl'
			},
		}
	})

	.state('config', {
		url: '/config',
		views: {
			'main':	{
				templateUrl: '/view/config.html',
				controller: 'configCtrl'
			},
		}
	})
	
	;
	
	$urlRouterProvider.otherwise('init');
}
