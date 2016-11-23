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

	.state('main', {
		url: '/main',
		views: {
			'title':	{
				templateUrl: '/view/title.html',
				controller: 'titleCtrl'
			},
			'menu':	{
				templateUrl: '/view/menu.html',
				controller: 'menuCtrl'
			},
			'left':	{
				templateUrl: '/view/left.html',
				controller: 'leftCtrl'
			},
			'main':	{
				templateUrl: '/view/main.html',
				controller: 'mainCtrl'
			},
			'right':	{
				templateUrl: '/view/right.html',
				controller: 'rightCtrl'
			},
			'preview':	{
				templateUrl: '/view/preview.html',
				controller: 'previewCtrl'
			},
			'bottom':	{
				templateUrl: '/view/bottom.html',
				controller: 'bottomCtrl'
			},

		}
	})

	;

	$urlRouterProvider.otherwise('main');
}
