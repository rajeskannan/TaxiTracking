'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ui.bootstrap']);

function CarouselSliderCtrl($scope){
	var slides = $scope.slides = [];

	slides.push({
		image: 'img/slide_1.jpg',
		text: "Call us (800) 1234-5678 Within 24 Hours"
	});
	slides.push({
		image: 'img/slide_2.jpg',
		text: "We’ll take you Wherever you need"
	});
}