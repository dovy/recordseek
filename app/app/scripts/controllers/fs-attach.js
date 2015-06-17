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
        fsAPI.getAccessToken().then(function (response) {
            fsAPI.getCurrentUser().then(function (response) {
                //var user = response.getUser();
                //console.log(user);
            });
        });

        if ( !$rootScope.data.attach ) {
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
