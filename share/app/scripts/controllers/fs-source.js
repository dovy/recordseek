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
    ['$cookies', '$rootScope', '$location', '$scope', 'fsAPI', 'fsCurrentUserCache', function( $cookie, $rootScope, $location, $scope, fsAPI, fsCurrentUserCache ) {
        $rootScope.service = "FamilySearch";
        $scope.goNext = function() {
            $location.path( '/fs-search' );
        };
        $scope.goBack = function() {
            $rootScope.service = "";
            $location.path( '/' );
        };
        $scope.goUpload = function() {
            $location.path( '/fs-upload' );
        };

        if (!$rootScope.auth.familysearch) {


            $scope.busy = true;
            fsCurrentUserCache.getUser().then(function(user) {
                fsAPI.getCollectionsForUser(user.id).then(function(response) {
                    //$scope.homeFolder = _.find(response.getCollections(), function(collection) { return !collection.title; });
                    //$scope.folders = _.reject(response.getCollections(), function(collection) { return !collection.title; });
                    //$scope.allDescriptionsCount = _.reduce(response.getCollections(), function(sum, collection) {
                    //    return sum + collection.size;
                    //}, 0);
                    //$scope.busy = false;
                    //// if a folder was previously selected, find it in the newly-read collections
                    //if ($scope.selectedFolder && scope.selectedFolder !== 'all') {
                    //    $scope.selectedFolder = _.find(response.getCollections(), {id: $scope.selectedFolder.id});
                    //}
                    //$scope.selectFolder($scope.selectedFolder || $scope.homeFolder).then(function() {
                    //    $scope.ready = true;
                    //});
                    console.log(response.getCollections());
                });
            });




            fsAPI.getAccessToken().then(
                function() {
                    $rootScope.$emit( 'newSession' );
                    fsCurrentUserCache.getUser().then(
                        function( user ) {

                            if (!$rootScope.data.boxes) {
                                fsAPI.getCollectionsForUser(user.id).then(function (response) {
                                    //$rootScope.data.boxes = response.getCollections();
                                    var collections = response.getCollections();

                                    response.getCollections(function(collections) {
                                        console.log(collections);
                                    });

                                    var data = [];
                                    angular.forEach(collections, function(value, key) {
                                        if (key.title != "") {
                                            this.push(key.id + ': ' + key.title);
                                        }

                                    }, data);
                                    console.log(data);

                                    console.log(collections);
                                });
                            }



                            $rootScope.auth.familysearch = user;
                        }
                    );
                }
            );
        }

    }]
);