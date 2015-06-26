'use strict';

/**
 * @ngdoc function
 * @name app2App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the app2App
 */
angular.module('app2App')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
