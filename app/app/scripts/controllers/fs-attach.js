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

        fsAPI.displayUser($scope);

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

        $scope.goBack = function() {
            $rootScope.log($rootScope.data)
            if ($rootScope.data.search.pid && $rootScope.data.search.pid!= "" ) {
                // $rootScope.data.search.pid = ""
                $location.path( '/fs-search' );
            } else {
                $location.path( '/fs-results' );
            }

        };
        $scope.goNext = function() {
            $location.path( '/fs-create' );
        };

    }]
);
