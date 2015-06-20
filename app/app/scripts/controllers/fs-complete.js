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
    'FsCompleteCtrl', ['fsAPI', '$rootScope', '$scope', '$location', function( fsAPI, $rootScope, $scope, $location ) {
        $rootScope.service = 'FamilySearch';
        $scope.goSearch = function() {
            $location.path( '/fs-search' );
        };

    }]
);
