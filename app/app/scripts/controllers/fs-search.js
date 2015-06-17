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

        fsAPI.getAccessToken().then(function (response) {
            fsAPI.getCurrentUser().then(function (response) {
                //var user = response.getUser();
                //console.log(user);
            });
        });

        if ( $rootScope.data.search.advanced ) {
            $scope.advancedButtonText = 'Basic';
        } else {
            $scope.advancedButtonText = 'Advanced';
        }


        $scope.getLocation = function() {
            return fsAPI.getPlaceSearch( $rootScope.data.search.eventPlace, {'count': '10'} ).then(
                function( response ) {
                    var places = response.getPlaces();
                    var data = [];
                    angular.forEach(
                        places, function( item ) {
                            if ( data.length < 9 ) {
                                this.push( item.$getNormalizedPlace() );
                            }
                        }, data
                    );
                    return data;
                }
            );
        };


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

        $scope.goNext = function() {
            $location.path( '/fs-results' );
        };
        $scope.goBack = function() {
            $location.path( '/fs-source' );
        };

    }]
);
