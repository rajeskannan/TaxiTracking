'use strict';

// Declare app level module which depends on filters, and services
var taxiTracker = angular.module('myApp', [
	'ngRoute',
	'myApp.filters',
	'ui.bootstrap'
]);

var userHome = angular.module('userApp', [
	'ngRoute',
	'myApp.filters',
	'ui.bootstrap',
	'xeditable'
]);

taxiTracker.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/about', {templateUrl: 'about', controller: 'aboutCtrl', activetab: 'about'});
	$routeProvider.when('/userHome', {templateUrl: 'userHome'});
	$routeProvider.when('/contact', {templateUrl: 'contact', controller: 'contactCtrl', activetab: 'contact'});
	$routeProvider.when('/home',{templateUrl: 'home', controller: 'homeCtrl', activetab: 'home'});
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

taxiTracker.controller('loginModalCtrl', function($scope, $modal) {
	$scope.user = {};
	$scope.wasSubmitted = false;

	$scope.open = function() {
		var modalInstance = $modal.open({templateUrl:'loginModal.html', controller:'loginModalSercontroller'});
	}

	$scope.submit = function() {
		//$scope.wasSubmitted = true;
		console.log("form submission hepaing lol");
	};

	$scope.error = function(name) {
		var s = $scope.form[name];
		return s.$invalid && s.$dirty ? "error" : "";
	};
});

taxiTracker.controller('ContactCtrl', function($scope) {
	$scope.user = {};

	$scope.error = function(name) {
		var s = $scope.form[name];
		return s.$invalid && s.$dirty ? "error" : "";
	};
});

taxiTracker.controller('loginModalSercontroller', function($scope, $modalInstance, $modal){

	$scope.EMAIL_REGXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.register = function() {
		$modalInstance.dismiss('cancel');
		var registerModalInstance = $modal.open({templateUrl:'registerModal.html', controller:'loginModalSercontroller'});
	}
});

taxiTracker.controller('registerModalController', function($scope, $registerModalInstance){
	$scope.cancel = function () {
		$registerModalInstance.dismiss('cancel');
	};

	$scope.checkEmail = function(data){
		if(!emailRegex.test(data)){
			return "error"
		}
	}
});

taxiTracker.controller('CarouselSliderCtrl', function($scope){
	var slides = $scope.slides = [];

	slides.push({
		image: '/img/slide_1.jpg',
		text: "Call us (800) 1234-5678 Within 24 Hours"
	});
	slides.push({
		image: '/img/slide_2.jpg',
		text: "We’ll take you Wherever you need"
	});
});

userHome.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});

userHome.service('dataService', function($http) {
	delete $http.defaults.headers.common['X-Requested-With'];
	this.getData = function() {
		// $http() returns a $promise that we can add handlers with .then()
		return $http({
			method: 'GET',
			url: '/userDetails'
		});
	}
});

userHome.controller('userDetailCtrl', function($scope, dataService, $http) {
	$scope.userD = null;
	dataService.getData().then(function(dataResponse) {
		console.log(dataResponse.data[0]);
		$scope.userD = dataResponse.data[0];
		console.log($scope.userD);
	});

	$scope.checkName = function(data) {
		if (data == '') {
			return "field should be blank.";
		}
	};

	$scope.saveUser = function() {
	// $scope.user already updated!
		return $http.post('/updateUser', $scope.userD).error(function(err) {
			if(err.field && err.msg) {
				// err like {field: "name", msg: "Server-side error for this username!"} 
				$scope.editableForm.$setError(err.field, err.msg);
			} else { 
			// unknown error
				$scope.editableForm.$setError('name', 'Unknown error!');
			}
		});
	};
});