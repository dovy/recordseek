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
    ['fsAPI', '$rootScope', '$scope', '$location', '$cookies', 'fsUtils', function( fsAPI, $rootScope, $scope, $location, $cookie, $fsUtils ) {
        $rootScope.service = 'FamilySearch';
        $cookie.remove( 'recordseek-auth' );
        localStorage.clear();
        $scope.fsRedirect = function($url) {
            return $fsUtils.redirectURL($url);
        };
        $scope.goSearch = function() {
            $rootScope.setCookie( 'recordseek-auth', angular.toJson( $rootScope.data ) );
            $location.path( '/fs-search' );
        };
    }]
);
