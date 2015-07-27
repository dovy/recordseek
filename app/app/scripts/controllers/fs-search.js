'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsSearchCtrl
 * @description
 * # FsSearchCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'FsSearchCtrl',
    ['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', function( $rootScope, $location, $scope, fsAPI, fsUtils ) {
        $rootScope.service = 'FamilySearch';

        fsAPI.getCurrentUser().then(
            function( response ) {
                $rootScope.user = response.getUser();
            }
        );

        if ( $rootScope.data.search.advanced ) {
            $scope.advancedButtonText = 'Basic';
        } else {
            $scope.advancedButtonText = 'Advanced';
        }

        $scope.emptyData = $rootScope.resetSearch(true);

        $scope.getLocation = fsUtils.getLocation;

        $scope.removeEmpty = fsUtils.removeEmptyProperties;

        $scope.advancedSearch = function() {
            if ( $rootScope.data.search.advanced ) {
                $rootScope.data.search.advanced = false;
                $scope.advancedButtonText = 'Advanced';
            } else {
                $scope.advancedButtonText = 'Basic';
                $rootScope.data.search.advanced = true;
            }
        };

        $scope.validData = function() {
            if ( !angular.equals( $scope.emptyData, $rootScope.data.search ) ) {
                return false;
            }
            return true;
        }

        $scope.goNext = function() {
            if ( !angular.equals( $scope.emptyData, $rootScope.data.search ) ) {
                $location.path( '/fs-results' );
            }
        };
        $scope.goBack = function() {
            $location.path( '/fs-source' );
        };

    }]
);
