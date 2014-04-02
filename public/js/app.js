'use strict';


// Declare app level module which depends on filters, and services
var taxiTracker = angular.module('myApp', [
	'ngRoute',
	'myApp.filters',
	'ui.bootstrap'
]);

taxiTracker.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/about', {templateUrl: 'about.html', controller: 'aboutCtrl', activetab: 'about'});
	$routeProvider.when('/contact', {templateUrl: 'contact.html', controller: 'contactCtrl', activetab: 'contact'});
	$routeProvider.when('/home',{templateUrl: 'home.html', controller: 'homeCtrl', activetab: 'home'});
	$routeProvider.otherwise({redirectTo: '/home'});
}]);

taxiTracker.run(['$rootScope', '$location', function($rootScope, $location){
	var path = function() { return $location.path(); };
	$rootScope.$watch(path, function(newVal, oldVal){
		$rootScope.activetab = newVal;
	});
}]);

taxiTracker.controller('homeCtrl', function($scope, $route) {
	$scope.activeTab = $route.current.activetab;
});

taxiTracker.controller('aboutCtrl', function($scope, $route) {
	$scope.activeTab = $route.current.activetab;
});
  
taxiTracker.controller('contactCtrl', function($scope, $route) {
	$scope.activeTab = $route.current.activetab;
});

taxiTracker.controller('CarouselSliderCtrl', function($scope){
	var slides = $scope.slides = [];

	slides.push({
		image: '/public/img/slide_1.jpg',
		text: "Call us (800) 1234-5678 Within 24 Hours"
	});
	slides.push({
		image: '/public/img/slide_2.jpg',
		text: "We’ll take you Wherever you need"
	});
});