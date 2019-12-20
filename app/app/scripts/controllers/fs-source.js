'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsSourceCtrl
 * @description
 * # FsSourceCtrl
 * Controller of the recordseekApp
 */
angular.module('recordseekApp')
  .controller(
    'FsSourceCtrl',

    ['$cookies', '$rootScope', '$location', '$scope', 'fsAPI', function ($cookie, $rootScope, $location, $scope, fsAPI, fsUtils) {
      $rootScope.service = 'FamilySearch';
      $scope.fsLogout = function () {
        fsAPI.completeLogout();
      }

      fsAPI.displayUser($scope);

      // We're starting over. No new person yet!
      if ($rootScope.data.search.newPerson) {
        delete $rootScope.data.search.newPerson;
      }

      $scope.origSource = $rootScope.data.citation;

      $scope.myPopover = {
        isOpen: false,
        templateUrl: 'tagTemplate.html',
        toggle: function toggle() {
          if ($scope.myPopover.isOpen != true) {
            $scope.myPopover.isOpen = false;
          } else {
            $scope.myPopover.isOpen = true;
          }
        },
        close: function close() {
          $scope.myPopover.isOpen = false;
        },
      };


      $scope.goNext = function () {

        $location.path('/fs-search');
        if ($scope.origSource !== $rootScope.data.citation) {
          $rootScope.track(
            {eventCategory: 'FamilySearch', eventAction: 'Citation', eventLabel: 'Modified'}
          );
        }
        $rootScope.log($rootScope.data);

      };

      $scope.goBack = function () {
        $cookie.remove('recordseek-last-service');
        $rootScope.service = '';
        $location.path('/');
      };
      $scope.goUpload = function () {
        $location.path('/fs-upload');
      };

      $scope.createNow = function () {
        $rootScope.track({eventCategory: 'FamilySearch', eventAction: 'Create', eventLabel: 'Now'});
        delete $rootScope.data.attach;
        $rootScope.data.complete = 'noAttachment'
        $location.path('/fs-create');
        $rootScope.safeApply();
      };

      if ($rootScope.personData) {
        var $test = $rootScope.personData;
        if ($test.title) {
          delete $test.title;
        }
        if ($test.notes) {
          delete $test.notes;
        }
        if ($test.citation) {
          delete $test.citation;
        }
        if ($test.url) {
          delete $test.url;
        }
        if ($test.sourceFormat) {
          delete $test.sourceFormat;
        }
        if ($test.time) {
          delete $test.time;
        }
        if ($test.domain) {
          delete $test.domain;
        }
        if ($test.tags) {
          delete $test.tags;
        }
        if ($test['_']) {
          delete $test['_'];
        }
        if ($test && !angular.equals({}, $test) && !$rootScope.skipSource) {
          $rootScope.skipSource = 1;
          $rootScope.log($test);
          $scope.goNext();
        }
        $rootScope.log($rootScope.personData);
      }

      $scope.sourceFormats = $rootScope.sourceFormats;
      $scope.sourceFormat = $rootScope.data.sourceFormat;
      $scope.changeFormat= function() {
        $rootScope.setCitationFormat($scope.sourceFormat);
      };

    }]
  );
