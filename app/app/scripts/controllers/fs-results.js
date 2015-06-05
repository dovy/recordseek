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
    ['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', '$window', function( $rootScope, $location, $scope, fsAPI, fsUtils, $window ) {

        $rootScope.service = "FamilySearch";

        $scope.goBack = function() {
            $location.path( '/fs-search' );
        };
        $scope.goNext = function( $pid, $name ) {
            $rootScope.data.attach = {
                'pid' : $pid,
                'name' : $name
            };
            $location.path( '/fs-attach' );
        };

        $scope.personURL = 'https://familysearch.org/tree/#view=ancestor&person=';


        $scope.pageChanged = function() {
            delete $scope.searchResults;
            $scope.getResults();
        };

        $scope.getResults = function() {

            var searchData = $rootScope.data.search;
            if ( searchData.eventType ) {
                searchData[searchData.eventType + 'Place'] = searchData.eventPlace;
                searchData[searchData.eventType + 'Date'] = searchData.eventDate;
            }


            if ( searchData.advanced === true ) {
                searchData.givenName += searchData.givenNameExact;
                searchData.surname += searchData.surnameExact;
                searchData.spouseGivenName += searchData.spouseGivenNameExact;
                searchData.spouseSurname += searchData.spouseSurnameExact;
                searchData.fatherGivenName += searchData.fatherGivenNameExact;
                searchData.fatherSurname += searchData.fatherSurnameExact;
                searchData.motherGivenName += searchData.motherGivenNameExact;
                searchData.motherSurname += searchData.motherSurnameExact;
                searchData.eventPlace += searchData.eventPlaceExact;
            }
            // Clean keys that don't go to FS
            delete searchData.eventType;
            delete searchData.eventDate;
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

            if ( Object.keys( searchData ).length == 0 ) {
                $location.path( '/fs-search' );
            }

            if ( $scope.context ) {
                searchData.context = $scope.context;
            }
            searchData.start = $scope.currentPage * 15 - 14;

            fsAPI.getAccessToken().then(
                function() {
                    $scope.min = ($scope.currentPage * 15) - 14;
                    $scope.max = $scope.currentPage * 15;
                    if ( $scope.min < 1 ) {
                        $scope.min = 1;
                    }
                    if ( $scope.max > $scope.bigTotalItems ) {
                        $scope.max = $scope.bigTotalItems;
                    }
                    fsAPI.getPersonSearch(
                        searchData
                    ).then(
                        function( response ) {
                            var results = response.getSearchResults();

                            $scope.maxSize = 5;
                            $scope.bigTotalItems = response.getResultsCount();
                            $scope.index = response.getIndex();
                            //$scope.context = response.getContext();

                            function getRelativeData( persons ) {
                                var data = [];
                                for ( var i = 0, len = persons.length; i < len; i++ ) {
                                    if (persons[i].living) {
                                        continue;
                                    }
                                    data.push(
                                        {
                                            'pid': persons[i].id,
                                            'name': persons[i].$getDisplayName(),
                                            'gender': persons[i].$getDisplayGender(),
                                            'data': persons[i]
                                        }
                                    );
                                }
                                return data;
                            }

                            $scope.searchResults = [];

                            for ( var i = 0, len = results.length; i < len; i++ ) {
                                var result = results[i];
                                var primaryPerson = result.$getPrimaryPerson();
                                $scope.searchResults.push(
                                    {
                                        'pid': result.id,
                                        'confidence': result.confidence,
                                        'name': primaryPerson.$getDisplayName(),
                                        'birthDate': primaryPerson.$getBirthDate(),
                                        'gender': primaryPerson.$getDisplayGender(),
                                        'birthPlace': primaryPerson.$getBirthPlace(),
                                        'deathDate': primaryPerson.$getDeathDate(),
                                        'deathPlace': primaryPerson.$getDeathPlace(),
                                        'father': getRelativeData( result.$getFathers() ),
                                        'mother': getRelativeData( result.$getMothers() ),
                                        'spouse': getRelativeData( result.$getSpouses() ),
                                        'children': getRelativeData( result.$getChildren() )
                                    }
                                );
                            }
                            console.log($scope.searchResults);
                        }
                    );
                }
            );
        }

        $scope.currentPage = 1;
        $scope.getResults();

    }]
);
