'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsResultsCtrl
 * @description
 * # FsResultsCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
        'FsResultsCtrl',
        ['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', function( $rootScope, $location, $scope, fsAPI, fsUtils ) {
            $rootScope.service = 'FamilySearch';
            $scope.currentPage = 1;
            $scope.bigTotalItems = 0;
            $scope.index = 1;
            $scope.maxSize = 0;
            $scope.numPages = 1;

            fsAPI.displayUser( $scope );

            $scope.goBack = function() {
                $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Search', eventLabel: 'Refine'} );
                $location.path( '/fs-search' );
            };

            $scope.addPerson = function() {

                if ( !angular.equals( {}, $rootScope.personData ) ) {
                    $location.path( '/fs-addattach' );
                } else {
                    $location.path( '/fs-addperson' );
                }
            };

            $scope.createNow = function() {
                $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Create', eventLabel: 'Now'} );
                delete $rootScope.data.attach;
                $rootScope.data.complete = 'noAttachment';
                $location.path( '/fs-create' );
            };

            $scope.goNext = function( $pid, $name, $url ) {
                $rootScope.data.attach = {
                    pid: $pid,
                    name: $name,
                    url: $url,
                    justification: ''
                };
                $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Selected', eventLabel: $pid} );
                $location.path( '/fs-attach' );
                $rootScope.safeApply();
            };

            $scope.pageChanged = function() {
                if ( $scope.currentPage >= 26 ) {
                    $scope.bigTotalItems = (26) * 15;
                    $scope.currentPage = 26;
                    $scope.index = 26;
                }
                delete $scope.searchResults;
                $scope.getResults();
            };

            $scope.getResults = function() {

                var searchData = angular.copy( $rootScope.data.search );
                searchData.eventDate = '';

                var $checks = [
                    'givenName',
                    'surname',
                    'spouseGivenName',
                    'spouseSurname',
                    'fatherGivenName',
                    'fatherSurname',
                    'motherGivenName',
                    'motherSurname',
                    'eventPlace',
                ];

                angular.forEach(
                    $checks, function( value ) {
                        if ( searchData.advanced === true ) {
                            searchData[value] += (searchData[value + 'Exact'] !== true && searchData[value] !== '' ) ? '~' : '';
                        } else {
                            searchData[value] += (searchData[value] !== '') ? '~' : '';
                        }
                    }
                );

                if ( searchData.eventType ) {
                    if ( searchData.eventDateFrom && searchData.eventDateFrom !== '' ) {
                        searchData.eventDate += searchData.eventDateFrom;
                        if ( searchData.eventDateTo && searchData.eventDateTo !== '' && searchData.eventDateFrom !== searchData.eventDateTo ) {
                            searchData.eventDate += '-' + searchData.eventDateTo;
                        }
                    } else if ( searchData.eventDateTo && searchData.eventDateTo !== '' ) {
                        searchData.eventDate = searchData.eventDateTo;
                    }

                    searchData[searchData.eventType + 'Place'] = searchData.eventPlace;
                    searchData[searchData.eventType + 'Date'] = String( searchData.eventDate ) + '~';
                    $checks.push( searchData.eventType + 'Place' );
                    $checks.push( searchData.eventType + 'Date' );
                }

                var cleanSearchData = {};
                angular.forEach(
                    $checks, function( value ) {
                        if ( $checks.indexOf( value ) !== -1 && searchData[value] != "" ) {
                            this[value] = searchData[value];
                        }
                    }, cleanSearchData
                );


                if ( Object.keys( cleanSearchData ).length === 0 && !$rootScope.debug ) {
                    $location.path( '/fs-search' );
                }

                if ( $scope.context ) {
                    cleanSearchData.context = $scope.context;
                }

                $scope.min = ($scope.currentPage * 15) - 14;
                $scope.max = $scope.currentPage * 15;


                if ( $scope.min < 1 ) {
                    $scope.min = 1;
                }
                if ( $scope.bigTotalItems && $scope.max > $scope.bigTotalItems ) {
                    $scope.max = $scope.bigTotalItems;
                }

                $scope.maxSize = 5;
                //$scope.bigTotalItems = 0;
                //$scope.index = 0;


                if ( $rootScope.data.search.pid && $rootScope.data.search.pid !== '' ) {

                    var cleanSearchDataSearch = $rootScope.data.search.pid;

                    fsAPI.getPersonWithRelationships(
                        cleanSearchDataSearch, {
                            persons: true,
                        }
                    ).then(
                        function( response ) {

                            $scope.searchResults = [];

                            var primaryPerson = response.getPrimaryPerson();

                            if ( primaryPerson ) {
                                $scope.bigTotalItems = $scope.max = 1;
                                var data = fsUtils.getPrimaryPerson( primaryPerson );

                                data.confidence = 5;

                                try {
                                    data.father = fsUtils.getRelativeData( response.getFathers() );
                                } catch ( err ) {
                                    $rootScope.log( err );
                                }

                                try {
                                    data.mother = fsUtils.getRelativeData( response.getMothers() );
                                } catch ( err ) {
                                    $rootScope.log( err );
                                }

                                try {
                                    data.spouse = fsUtils.getRelativeData( response.getSpouses() );
                                } catch ( err ) {
                                    $rootScope.log( err );
                                }

                                try {
                                    data.children = fsUtils.getRelativeData( response.getChildren() );
                                } catch ( err ) {
                                    $rootScope.log( err );
                                }

                                $scope.searchResults.push(
                                    data
                                );
                                $scope.goNext( data.pid, data.name, data.url );

                            }
                        }
                    ).catch( // Catch any errors
                        function( e ) {
                            $rootScope.log( 'Error' );
                            $scope.searchResults = [];
                            $rootScope.safeApply();
                            // $scope.$apply();
                        }
                    );
                } else {
                    $rootScope.log( 'Non-PID Search' );
                    if ( $scope.searchContent ) {
                        var cleanSearchData = {
                            start: ($scope.currentPage - 1) * 15,
                            context: $scope.searchContent
                        };
                    }

                    $rootScope.log( cleanSearchData );

                    fsAPI.getPersonSearch( cleanSearchData ).then(
                        function( response ) {

                            $scope.searchResults = [];
                            $scope.searchContent = response.getContext();
                            var results = response.getSearchResults();

                            if ( results.length === 0 ) {
                                $rootScope.log( 'EMPTY' );
                                $rootScope.safeApply();
                                return;
                            }

                            $scope.bigTotalItems = response.getResultsCount();

                            //$scope.index = response.getIndex();

                            if ( $scope.currentPage >= 26 ) {
                                $scope.bigTotalItems = (26) * 15;
                            }

                            if ( $scope.max > $scope.bigTotalItems ) {
                                $scope.max = $scope.bigTotalItems;
                            }

                            //$scope.context = response.getContext();

                            $rootScope.log( 'Record length: ' + results.length );

                            if ( results.length == 0 ) {
                                $scope.searchResults.push(
                                    data
                                );
                                $rootScope.safeApply();
                            } else {
                                for ( var i = 0, len = results.length; i < len; i++ ) {
                                    var result = results[i];
                                    //$rootScope.log( result );
                                    var primaryPerson = result.getPrimaryPerson();
                                    //$rootScope.log( primaryPerson );
                                    var data = fsUtils.getPrimaryPerson( primaryPerson );
                                    data.confidence = results[i].confidence;
                                    data.father = fsUtils.getRelativeData( result.getFathers() );
                                    data.mother = fsUtils.getRelativeData( result.getMothers() );
                                    data.spouse = fsUtils.getRelativeData( result.getSpouses() );
                                    data.children = fsUtils.getRelativeData( result.getChildren() );
                                    $scope.searchResults.push(
                                        data
                                    );
                                    $rootScope.safeApply();
                                }
                                $rootScope.log( $scope.searchResults );
                            }


                            $rootScope.track(
                                {
                                    eventCategory: 'FamilySearch',
                                    eventAction: 'Search',
                                    eventLabel: 'Results',
                                    eventValue: results.length
                                }
                            );

                        }
                    )

                    // Catch any errors
                        .catch(
                            function( e ) {
                                $rootScope.log( e );
                                $rootScope.log( 'there' );
                                $scope.searchResults = [];
                                $rootScope.safeApply();
                            }
                        );


                }
            };


            $scope.getResults();

        }]
    );
