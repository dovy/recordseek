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
        fsAPI.getCurrentUser().then(
            function( response ) {
                $rootScope.user = response.getUser();
            }
        );

        $scope.goBack = function() {
            $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Search', eventLabel: 'Refine'} );

            $location.path( '/fs-search' );
        };

        $scope.addPerson = function() {

            if ( $rootScope.personData ) {
                $location.path( '/fs-addperson' );
            } else {
                $location.path( '/fs-addattach' );
            }
        };

        $scope.goNext = function( $pid, $name, $url ) {
            $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Selected', eventLabel: $pid} );

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

            if ( Object.keys( searchData ).length === 0 && !$rootScope.debug ) {
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
            $scope.bigTotalItems = 0;
            $scope.index = 0;
            $scope.max = 0;

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
                            var data = fsUtils.getPrimaryPerson( primaryPerson );
                            data.confidence = 5;
                            data.father = fsUtils.getRelativeData( response.getFathers() );
                            data.mother = fsUtils.getRelativeData( response.getMothers() );
                            data.spouse = fsUtils.getRelativeData( response.getSpouses() );
                            data.children = fsUtils.getRelativeData( response.getChildren() );
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
                        $scope.searchResults = [];
                        var results = response.getSearchResults();
                        $scope.bigTotalItems = response.getResultsCount();
                        $scope.index = response.getIndex();

                        if ( $scope.max > $scope.bigTotalItems ) {
                            $scope.max = $scope.bigTotalItems;
                        }

                        //$scope.context = response.getContext();

                        $rootScope.log( 'Record length: ' + results.length );

                        for ( var i = 0, len = results.length; i < len; i++ ) {
                            var result = results[i];
                            //$rootScope.log( result );
                            var primaryPerson = result.$getPrimaryPerson();
                            //$rootScope.log( primaryPerson );
                            var data = fsUtils.getPrimaryPerson( primaryPerson );
                            data.confidence = results[i].confidence;
                            data.father = fsUtils.getRelativeData( result.$getFathers() );
                            data.mother = fsUtils.getRelativeData( result.$getMothers() );
                            data.spouse = fsUtils.getRelativeData( result.$getSpouses() );
                            data.children = fsUtils.getRelativeData( result.$getChildren() );
                            $scope.searchResults.push(
                                data
                            );
                        }
                        $rootScope.log( $scope.searchResults );

                        $rootScope.track(
                            {
                                eventCategory: 'FamilySearch',
                                eventAction: 'Search',
                                eventLabel: 'Results',
                                eventValue: results.length
                            }
                        );
                    }
                );
            }
        };

        $scope.currentPage = 1;
        $scope.bigTotalItems = 0;
        $scope.index = 1;
        $scope.maxSize = 0;
        $scope.numPages = 1;
        $scope.getResults();

    }]
);
