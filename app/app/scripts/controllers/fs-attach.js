'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsAttachCtrl
 * @description
 * # FsAttachCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'FsAttachCtrl',
    ['$rootScope', '$location', '$scope', 'fsAPI', function( $rootScope, $location, $scope, fsAPI ) {

        $rootScope.service = 'FamilySearch';
        fsAPI.getCurrentUser().then(function (response) {
            $rootScope.fsUser = response.getUser();
        });

        if ( !$rootScope.data.attach && !$rootScope.debug ) {
            if ( !$rootScope.data.search ) {
                $location.path( '/fs-search' );
            } else {
                $location.path( '/fs-results' );
            }
        }
        if ( !$rootScope.data.attach.justification ) {
            $rootScope.data.attach.justification = '';
        }

        $scope.goBack = function() {
            $location.path( '/fs-results' );
        };
        $scope.goNext = function() {
            $location.path( '/fs-create' );
        };

    }]
);
