'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsCompleteCtrl
 * @description
 * # FsCompleteCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'FsCompleteCtrl',
    ['fsAPI', '$rootScope', '$scope', '$location', '$cookies', function( fsAPI, $rootScope, $scope, $location, $cookie ) {
        $rootScope.service = 'FamilySearch';
        $cookie.remove( 'recordseek-auth' );
        $scope.goSearch = function() {
            $rootScope.setCookie( 'recordseek-auth', angular.toJson( $rootScope.data ) );
            $location.path( '/fs-search' );
        };
    }]
);
