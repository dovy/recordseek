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
        /* global ga */
        $rootScope.service = 'FamilySearch';
        fsAPI.getAccessToken();

        $scope.goBack = function() {
            ga( 'send', 'event', {eventCategory: 'FamilySearch', eventAction: 'Search', eventLabel: 'Refine'} );
            $location.path( '/fs-search' );
        };
        $scope.goNext = function( $pid, $name, $url ) {
            ga( 'send', 'event', {eventCategory: 'FamilySearch', eventAction: 'Selected', eventLabel: $pid} );
            $rootScope.data.attach = {
                pid: $pid,
                name: $name,
                url: $url,
                justification: ''
            };
            $location.path( '/fs-attach' );
        };

        $scope.pageChanged = function() {
            delete $scope.searchResults;
            $scope.getResults();
        };

        $scope.getResults = function() {


            var searchData = angular.copy( $rootScope.data.search );
            searchData.eventDate = '';
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
            }

            if ( searchData.advanced === true ) {
                searchData.givenName += (searchData.givenNameExact !== '1' && searchData.givenName !== '' ) ? '~' : '';
                searchData.surname += (searchData.surnameExact !== '1' && searchData.surname !== '' ) ? '~' : '';
                searchData.spouseGivenName += (searchData.spouseGivenNameExact !== '1' && searchData.spouseGivenName !== '' ) ? '~' : '';
                searchData.spouseSurname += (searchData.spouseSurnameExact !== '1' && searchData.spouseSurname !== '' ) ? '~' : '';
                searchData.fatherGivenName += (searchData.fatherGivenNameExact !== '1' && searchData.fatherGivenName !== '' ) ? '~' : '';
                searchData.fatherSurname += (searchData.fatherSurnameExact !== '1' && searchData.fatherSurname !== '' ) ? '~' : '';
                searchData.motherGivenName += (searchData.motherGivenNameExact !== '1' && searchData.motherGivenName !== '' ) ? '~' : '';
                searchData.motherSurname += (searchData.motherSurnameExact !== '1' && searchData.motherSurname !== '' ) ? '~' : '';
                searchData.eventPlace += (searchData.eventPlaceExact !== '1' && searchData.eventPlace !== '' ) ? '~' : '';
            } else {
                searchData.givenName = (searchData.givenName !== '') ? searchData.givenName + '~' : '';
                searchData.surname = (searchData.surname !== '') ? searchData.surname + '~' : '';
                searchData.spouseGivenName = (searchData.spouseGivenName !== '') ? searchData.spouseGivenName + '~' : '';
                searchData.spouseSurname = (searchData.spouseSurname !== '') ? searchData.spouseSurname + '~' : '';
                searchData.fatherGivenName = (searchData.fatherGivenName !== '') ? searchData.fatherGivenName + '~' : '';
                searchData.fatherSurname = (searchData.fatherSurname !== '') ? searchData.fatherSurname + '~' : '';
                searchData.motherGivenName = (searchData.motherGivenName !== '') ? searchData.motherGivenName + '~' : '';
                searchData.motherSurname = (searchData.motherSurname !== '') ? searchData.motherSurname + '~' : '';
                searchData.eventPlace = (searchData.eventPlace !== '') ? searchData.eventPlace + '~' : '';
            }

            // Clean keys that don't go to FS
            delete searchData.eventType;
            delete searchData.eventDate;
            delete searchData.eventDateFrom;
            delete searchData.eventDateTo;
            delete searchData.eventPlace;
            delete searchData.advanced;
            delete searchData.givenNameExact;
            delete searchData.surnameExact;
            delete searchData.spouseGivenNameExact;
            delete searchData.spouseSurnameExact;
            delete searchData.fatherGivenNameExact;
            delete searchData.fatherSurnameExact;
            delete searchData.motherGivenNameExact;
            delete searchData.motherSurnameExact;
            delete searchData.eventPlaceExact;


            searchData = fsUtils.removeEmptyProperties( searchData );


            if ( Object.keys( searchData ).length === 0 ) {
                $location.path( '/fs-search' );
            }

            if ( $scope.context ) {
                searchData.context = $scope.context;
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


            // Used to parse relationships
            function getRelativeData( persons ) {
                var data = [];
                for ( var i = 0, len = persons.length; i < len; i++ ) {
                    if ( persons[i].living ) {
                        continue;
                    }
                    data.push(
                        {
                            'pid': persons[i].id,
                            'url': persons[i].$getPersistentIdentifier(),
                            'name': persons[i].$getDisplayName(),
                            'gender': persons[i].$getDisplayGender(),
                            'data': persons[i]
                        }
                    );
                }
                return data;
            }

            function getPrimaryPerson( primaryPerson ) {
                return {
                    'pid': primaryPerson.id,
                    'name': primaryPerson.$getDisplayName(),
                    'birthDate': primaryPerson.$getBirthDate(),
                    'gender': primaryPerson.$getDisplayGender(),
                    'url': primaryPerson.$getPersistentIdentifier(),
                    'birthPlace': primaryPerson.$getBirthPlace(),
                    'deathDate': primaryPerson.$getDeathDate(),
                    'deathPlace': primaryPerson.$getDeathPlace(),
                };
            }

            fsAPI.getAccessToken().then(
                function() {

                    if ( searchData.pid && searchData.pid !== '' ) {
                        fsAPI.getPersonWithRelationships(
                            searchData.pid, {
                                persons: true
                            }
                        ).then(
                            function( response ) {
                                $scope.searchResults = [];
                                var primaryPerson = response.getPrimaryPerson();
                                if ( primaryPerson ) {
                                    $scope.bigTotalItems = $scope.max = 1;
                                    $scope.index = 0;
                                    var data = getPrimaryPerson( primaryPerson );
                                    data.confidence = 5;
                                    data.father = getRelativeData( response.getFathers() );
                                    data.mother = getRelativeData( response.getMothers() );
                                    data.spouse = getRelativeData( response.getSpouses() );
                                    data.children = getRelativeData( response.getChildren() );
                                    $scope.searchResults.push(
                                        data
                                    );
                                }
                            }
                        );
                    } else {
                        fsAPI.getPersonSearch(
                            searchData
                        ).then(
                            function( response ) {
                                var results = response.getSearchResults();
                                $scope.bigTotalItems = response.getResultsCount();
                                $scope.index = response.getIndex();

                                if ( $scope.max > $scope.bigTotalItems ) {
                                    $scope.max = $scope.bigTotalItems;
                                }

                                //$scope.context = response.getContext();

                                $scope.searchResults = [];

                                for ( var i = 0, len = results.length; i < len; i++ ) {
                                    var result = results[i];
                                    var primaryPerson = result.$getPrimaryPerson();
                                    var data = getPrimaryPerson( primaryPerson );
                                    data.confidence = results[i].confidence;
                                    data.father = getRelativeData( result.$getFathers() );
                                    data.mother = getRelativeData( result.$getMothers() );
                                    data.spouse = getRelativeData( result.$getSpouses() );
                                    data.children = getRelativeData( result.$getChildren() );
                                    $scope.searchResults.push(
                                        data
                                    );
                                }
                                ga(
                                    'send', 'event', {
                                        eventCategory: 'FamilySearch',
                                        eventAction: 'Search',
                                        eventLabel: 'Results',
                                        eventValue: results.length
                                    }
                                );

                                //console.log($scope.searchResults);
                            }
                        );
                    }


                }
            );
        };

        $scope.currentPage = 1;
        $scope.getResults();

    }]
);
