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
        ['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', function( $rootScope, $location, $scope, fsAPI, fsUtils ) {
            $rootScope.service = 'FamilySearch';

            function chunkSubstr( str, size ) {
                var numChunks = Math.ceil( str.length / size ),
                    chunks = new Array( numChunks );

                for ( var i = 0, o = 0; i < numChunks; ++i, o += size ) {
                    chunks[i] = str.substr( o, size );
                }

                return chunks;
            }

            $scope.pid_check = function() {
                $rootScope.data.search.pid = $rootScope.data.search.pid.trim().toUpperCase().replace(
                    /[^A-Za-z0-9\-]/g, ''
                );

                if ( $rootScope.data.search.pid.length >= 7 ) {
                    $rootScope.data.search.pid = $rootScope.data.search.pid.split( '-' ).join( '' );
                    $rootScope.data.search.pid = chunkSubstr( $rootScope.data.search.pid, 4 ).join( '-' )
                }
            };
            $scope.pid_state = function() {
                if ( $rootScope.data.search.pid.length > 0 && $rootScope.data.search.pid.length < 8 ) {
                    return "has-warning"
                } else if ( $rootScope.data.search.pid.length >= 8 ) {
                    return "has-success"
                }
            }

            fsAPI.displayUser( $scope );

            if ( $rootScope.data.search.advanced ) {
                $scope.advancedButtonText = 'Basic';
            } else {
                $scope.advancedButtonText = 'Advanced';
            }

            $scope.emptyData = $rootScope.resetSearch( true );

            $scope.getLocation = fsUtils.getLocation;

            $scope.removeEmpty = fsUtils.removeEmptyProperties;

            $scope.advancedSearch = function() {
                if ( $rootScope.data.search.advanced ) {
                    $rootScope.data.search.advanced = false;
                    $scope.advancedButtonText = 'Advanced';
                } else {
                    $scope.advancedButtonText = 'Basic';
                    $rootScope.data.search.advanced = true;
                }
            };

            $scope.validData = function() {
                if ( $rootScope.data.search.pid.length > 0 ) {
                    if ( $rootScope.data.search.pid.length < 8 ) {
                        return true;
                    } else {
                        return false;
                    }
                }

                if ( !angular.equals( $scope.emptyData, $rootScope.data.search ) ) {
                    return false;
                }

                return true;
            }

            $scope.goNext = function() {
                if ( !angular.equals( $scope.emptyData, $rootScope.data.search ) ) {
                    // $rootScope.data.search.pid = $rootScope.data.search.pid.replace(/<(?:.|\n)*?>/gm, '');
                    $location.path( '/fs-results' );
                }
            };
            $scope.goBack = function() {
                $location.path( '/fs-source' );
            };

        }]
    );
