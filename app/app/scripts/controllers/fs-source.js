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

    ['$cookies', '$rootScope', '$location', '$scope', 'fsAPI', function( $cookie, $rootScope, $location, $scope, fsAPI ) {
        /* global ga */
        $rootScope.service = 'FamilySearch';
        fsAPI.getAccessToken().then(function (response) {
            fsAPI.getCurrentUser().then(function (response) {
                //var user = response.getUser();
                //console.log(user);
            });
        });
        $scope.origSource = $rootScope.data.citation;

        $scope.goNext = function() {
            $location.path( '/fs-search' );
            if ($scope.origSource !== $rootScope.data.citation) {
                ga( 'send', 'event', {eventCategory: 'FamilySearch', eventAction: 'Citation', eventLabel: 'Modified'} );
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
            ga( 'send', 'event', {eventCategory: 'FamilySearch', eventAction: 'Create', eventLabel: 'Now'} );
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