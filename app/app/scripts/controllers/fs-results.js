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
        ['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', 'fsResult', function( $rootScope, $location, $scope, fsAPI, fsUtils, fsResult ) {
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
                        searchData[searchData.eventType + 'Date.from'] = "%2B" + searchData.eventDateFrom;
                        $checks.push( searchData.eventType + 'Date.from' );
                    } 
                    if ( searchData.eventDateTo && searchData.eventDateTo !== '' ) {
                        searchData[searchData.eventType + 'Date.to'] = "%2B" + searchData.eventDateTo;
                        $checks.push( searchData.eventType + 'Date.to' );
                    }

                    searchData[searchData.eventType + 'Place'] = searchData.eventPlace;
                    $checks.push( searchData.eventType + 'Place' );
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

                    fsAPI.get('/platform/tree/persons/' + cleanSearchDataSearch, {
                        headers: { 'Accept': 'application/x-gedcomx-v1+json', 'Authorization': 'Bearer ' + fsAPI.getAccessToken() }
                    }, function( error, response ) {
                        if (fsAPI.handleError(error, response) === true) return;
                        $scope.searchResults = [];

                        if ( response.data ) {
                            $scope.bigTotalItems = $scope.max = 1;
                            fsResult.setData($rootScope.data.search.pid, respone.data);
                            var data = fsResult.getPrimaryPerson();
                            data.confidence = 5;

                            try {
                                data.father = fsUtils.getRelativeData( fsResult.getFathers() );
                            } catch ( err ) {
                                $rootScope.log( err );
                            }

                            try {
                                data.mother = fsUtils.getRelativeData( fsResult.getMothers() );
                            } catch ( err ) {
                                $rootScope.log( err );
                            }

                            try {
                                data.spouse = fsUtils.getRelativeData( fsResult.getSpouses() );
                            } catch ( err ) {
                                $rootScope.log( err );
                            }

                            try {
                                data.children = fsUtils.getRelativeData( fsResult.getChildren() );
                            } catch ( err ) {
                                $rootScope.log( err );
                            }

                            $scope.searchResults.push(
                                data
                            );
                            $scope.goNext( data.pid, data.name, data.url );

                        }
                    }).catch( // Catch any errors
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

                    // Based on new search criteria, we prefix the search terms with "q."
                    var queryString = '';

                    Object.entries(cleanSearchData).forEach(function(obj) {
                        queryString += "q." + obj.term + "=" + obj.value + "&";
                    });

                    var start = ($scope.currentPage - 1) * 20;


                    fsAPI.get('/platform/tree/search?' + queryString + 'count=20&offset=' + start, {
                        headers: { 'Accept': 'application/x-gedcomx-atom+json', 'Authorization': 'Bearer ' + fsAPI.getAccessToken() }
                    }, function( err, response ) {

                        if (fsAPI.handleError(err, response) === true) {
                            return;
                        }
                        $scope.searchResults = [];
                        var results = response.data.entries;

                        if ( !results || results.length === 0 ) {
                            $rootScope.log( 'EMPTY' );
                            $rootScope.safeApply();
                            return;
                        }

                        $scope.bigTotalItems = response.data.results;

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
                                var result = results[i].content.gedcomx;
                                fsResult.setData(results[i].id, result);
                                var primaryPerson = fsResult.getPrimaryPerson();
                                var data = _.cloneDeep(primaryPerson);
                                data.confidence = results[i].confidence;
                                data.father = fsUtils.getRelativeData( fsResult.getFathers() );
                                data.mother = fsUtils.getRelativeData( fsResult.getMothers() );
                                data.spouse = fsUtils.getRelativeData( fsResult.getSpouses() );
                                data.children = fsUtils.getRelativeData( fsResult.getChildren() );
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

                    },
                    // catch for errors
                    function( e ) {
                        $rootScope.log( e );
                        $rootScope.log( 'there' );
                        $scope.searchResults = [];
                        $rootScope.safeApply();
                    });


                }
            };


            $scope.getResults();

        }]
    );
