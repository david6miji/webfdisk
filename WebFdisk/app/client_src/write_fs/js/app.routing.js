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

	.state('index', {
							url: '/index', 		
					templateUrl: '/write_fs/view/index.html',
					 controller: 'indexCtrl'				
					})
					
	.state('wait', {
							url: '/index', 		
					templateUrl: '/write_fs/view/wait.html',
					 controller: 'waitCtrl'				
					})
	
	.state('writing', {
							url: '/index', 		
					templateUrl: '/write_fs/view/writing.html',
					 controller: 'writingCtrl'				
					})
	
	.state('finish', {
							url: '/index', 		
					templateUrl: '/write_fs/view/finish.html',
					 controller: 'finishCtrl'				
					})
	
	;
	
	$urlRouterProvider.otherwise('index');
}
