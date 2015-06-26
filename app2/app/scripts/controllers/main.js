'use strict';

/**
 * @ngdoc function
 * @name app2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the app2App
 */
angular.module('app2App')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
