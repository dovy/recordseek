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
    ['$rootScope', '$location', '$scope', function( $rootScope, $location, $scope ) {
        $rootScope.service = "FamilySearch";


        if ( !$rootScope.search ) {
            $rootScope.search = {
                surname: '',
                gender: '',
                eventType: '',
                spouseGiven: '',
                spouseSurname: '',
                eventDate: '',
                eventPlace: '',
                motherGiven: '',
                motherSurname: '',
                fatherGiven: '',
                fatherSurname: '',
                pid: ''
            };
        }

        $scope.goNext = function() {
            $location.path( '/fs-results' );
        };
        $scope.goBack = function() {
            $location.path( '/fs-source' );
        };

    }]
);
