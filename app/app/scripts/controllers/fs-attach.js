'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsAttachCtrl
 * @description
 * # FsAttachCtrl
 * Controller of the recordseekApp
 */
angular.module('recordseekApp')
  .controller('FsAttachCtrl',['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', '$window', function( $rootScope, $location, $scope, fsAPI, fsUtils, $window ) {

      $rootScope.service = "FamilySearch";
      console.log($rootScope.data);

  }]);
