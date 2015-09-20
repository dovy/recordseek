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
        };

        $scope.goBack = function() {
            $cookie.remove('recordseek-last-service');
            $rootScope.service = '';
            $location.path( '/' );
        };
        $scope.goUpload = function() {
            $location.path( '/fs-upload' );
        };

        $scope.createNow = function() {
            $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Create', eventLabel: 'Now'} );
            delete $rootScope.data.attach;
            $location.path( '/fs-create' );
        };

        if ( $rootScope.personData ) {
            var $test = $rootScope.personData;
            if ( $test.title ) {
                delete $test.title;
            }
            if ( $test.notes ) {
                delete $test.notes;
            }
            if ( $test.citation ) {
                delete $test.citation;
            }
            if ( $test.url ) {
                delete $test.url;
            }
            if ( $test.sourceFormat ) {
                delete $test.sourceFormat;
            }
            if ( $test.time ) {
                delete $test.time;
            }
            if ( $test.domain ) {
                delete $test.domain;
            }
            if ( $test.tags ) {
                delete $test.tags;
            }
            if ( $test['_'] ) {
                delete $test['_'];
            }
            if ( $test && !angular.equals( {}, $test ) && !$rootScope.skipSource ) {
                $rootScope.skipSource = 1;
                $rootScope.log($test);
                $scope.goNext();
            }
            $rootScope.log($rootScope.personData);
        }

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