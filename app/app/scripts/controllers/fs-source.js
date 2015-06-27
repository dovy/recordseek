'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsSourceCtrl
 * @description
 * # FsSourceCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'FsSourceCtrl',

    ['$cookies', '$rootScope', '$location', '$scope', 'fsAPI', function( $cookie, $rootScope, $location, $scope, fsAPI, fsUtils ) {
        $rootScope.service = 'FamilySearch';
        $scope.fsLogout = function() {
            fsAPI.helpers.eraseAccessToken( true );
            $location.path( '/' );
        }
        fsAPI.getCurrentUser().then(
            function( response ) {
                $scope.user = response.getUser();
                $rootScope.log( $scope.user );
            }
        );

        $scope.tagCounting = function() {
            var count = 0;
            angular.forEach($scope.data.tags, function(value, key) {
                if (value === true) {
                    count++;
                }
            }, count);
            if (count === 0) {
                count = '';
            }
            $scope.tagCount = count;
        }

        $scope.tagTemplate = "tagTemplate.html";

        // We're starting over. No new person yet!
        if ( $rootScope.data.search.newPerson ) {
            delete $rootScope.data.search.newPerson;
        }

        $scope.origSource = $rootScope.data.citation;

        $scope.goNext = function() {
            $location.path( '/fs-search' );
            if ( $scope.origSource !== $rootScope.data.citation ) {
                $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Citation', eventLabel: 'Modified'} );
            }
            // TODO Remove after debug
            if ( $rootScope.data.mooseroots && !$rootScope.data.search.surname ) {
                // TODO Remove after debug
                $rootScope.data.search = {
                    birthDate: "June 3 1982",
                    eventType: 'birth',
                    eventPlace: 'Wasilla, Matanuska-Susitna, Alaska, United States',
                    eventDateFrom: '1982',
                    birthPlace: "Wasilla, Matanuska-Susitna, Alaska, United States",
                    deathDate: "June 10, 2090",
                    //deathPlace: "Provo, Utah, Utah, United States",
                    fatherGivenName: "Father Given",
                    fatherSurname: "Father Surname",
                    gender: "Male",
                    givenName1: "Ryan",
                    givenName: "Ryan",
                    langTemplate: "Standard",
                    motherGivenName: "Mother Given",
                    motherSurname: "Mother Surname",
                    spouseGivenName: "Spouse Given",
                    spouseSurname: "Spouse Surname",
                    status: "Deceased",
                    suffix1: "Suffix",
                    surname1: "Smith",
                    surname: "Smith",
                    title1: "Title"
                };
            }
        };

        $scope.goBack = function() {
            $rootScope.service = '';
            $location.path( '/' );
        };
        $scope.goUpload = function() {
            $location.path( '/fs-upload' );
        };
        $scope.createNow = function() {
            $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Create', eventLabel: 'Now'} );
            $location.path( '/fs-create' );
        };

        //if ( !$rootScope.auth.familysearch ) {
        //
        //
        //    $scope.busy = true;
        //    fsCurrentUserCache.getUser().then(
        //        function( user ) {
        //            fsAPI.getCollectionsForUser( user.id ).then(
        //                function( response ) {
        //                    //$scope.homeFolder = _.find(response.getCollections(), function(collection) { return !collection.title; });
        //                    //$scope.folders = _.reject(response.getCollections(), function(collection) { return !collection.title; });
        //                    //$scope.allDescriptionsCount = _.reduce(response.getCollections(), function(sum, collection) {
        //                    //    return sum + collection.size;
        //                    //}, 0);
        //                    //$scope.busy = false;
        //                    //// if a folder was previously selected, find it in the newly-read collections
        //                    //if ($scope.selectedFolder && scope.selectedFolder !== 'all') {
        //                    //    $scope.selectedFolder = _.find(response.getCollections(), {id: $scope.selectedFolder.id});
        //                    //}
        //                    //$scope.selectFolder($scope.selectedFolder || $scope.homeFolder).then(function() {
        //                    //    $scope.ready = true;
        //                    //});
        //                    console.log( response.getCollections() );
        //                }
        //            );
        //        }
        //    );
        //
        //
        //    fsAPI.getAccessToken().then(
        //        function() {
        //            $rootScope.$emit( 'newSession' );
        //            fsCurrentUserCache.getUser().then(
        //                function( user ) {
        //
        //                    if ( !$rootScope.data.boxes ) {
        //                        fsAPI.getCollectionsForUser( user.id ).then(
        //                            function( response ) {
        //                                //$rootScope.data.boxes = response.getCollections();
        //                                var collections = response.getCollections();
        //
        //                                response.getCollections(
        //                                    function( collections ) {
        //                                        console.log( collections );
        //                                    }
        //                                );
        //
        //                                var data = [];
        //                                angular.forEach(
        //                                    collections, function( value, key ) {
        //                                        if ( key.title != "" ) {
        //                                            this.push( key.id + ': ' + key.title );
        //                                        }
        //
        //                                    }, data
        //                                );
        //                                console.log( data );
        //
        //                                console.log( collections );
        //                            }
        //                        );
        //                    }
        //
        //
        //                    $rootScope.auth.familysearch = user;
        //                }
        //            );
        //        }
        //    );
        //}

    }]
);