'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsAddpersonCtrl
 * @description
 * # FsAddpersonCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'FsAddpersonCtrl',
    ['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', function( $rootScope, $location, $scope, fsAPI, fsUtils ) {
        $rootScope.service = 'FamilySearch';
        fsAPI.getCurrentUser().then(
            function( response ) {
                $rootScope.user = response.getUser();
            }
        );

        if ( $rootScope.data.search.givenName && !$rootScope.data.search.givenName1 ) {
            $rootScope.data.search.givenName1 = $rootScope.data.search.givenName;
        }
        if ( $rootScope.data.search.surname && !$rootScope.data.search.surname1 ) {
            $rootScope.data.search.surname1 = $rootScope.data.search.surname;
        }
        if ( $rootScope.data.search.eventType == "birth" && ( !$rootScope.data.search.birthDate && !$rootScope.data.search.birthPlace ) ) {
            if ( !$rootScope.data.search.birthPlace ) {
                $rootScope.data.search.birthPlace = $rootScope.data.search.eventPlace;
            }
            if ( !$rootScope.data.search.birthDate && ( $rootScope.data.search.eventDateFrom || $rootScope.data.search.eventDateTo ) ) {
                if ( $rootScope.data.search.eventDateFrom && $rootScope.data.search.eventDateTo ) {
                    if ( $rootScope.data.search.eventDateFrom == $rootScope.data.search.eventDateTo ) {
                        $rootScope.data.search.birthDate = $rootScope.data.search.eventDateFrom;
                    } else {
                        $rootScope.data.search.birthDate = $rootScope.data.search.eventDateFrom + '-' + $rootScope.data.search.eventDateTo;
                    }
                } else {
                    if ( $rootScope.data.search.eventDateFrom ) {
                        $rootScope.data.search.birthDate = $rootScope.data.search.eventDateFrom;
                    } else if ( $rootScope.data.search.eventDateTo ) {
                        $rootScope.data.search.birthDate = $rootScope.data.search.eventDateTo;
                    }
                }
            }
        }
        if ( $rootScope.data.search.eventType == "death" && ( !$rootScope.data.search.deathDate && !$rootScope.data.search.deathPlace ) ) {
            if ( !$rootScope.data.search.deathPlace ) {
                $rootScope.data.search.deathPlace = $rootScope.data.search.eventPlace;
            }
            if ( !$rootScope.data.search.deathDate && ($rootScope.data.search.eventDateFrom || $rootScope.data.search.eventDateTo) ) {
                if ( $rootScope.data.search.eventDateFrom && $rootScope.data.search.eventDateTo ) {
                    if ( $rootScope.data.search.eventDateFrom == $rootScope.data.search.eventDateTo ) {
                        $rootScope.data.search.deathDate = $rootScope.data.search.eventDateFrom;
                    } else {
                        $rootScope.data.search.deathDate = $rootScope.data.search.eventDateFrom + '-' + $rootScope.data.search.eventDateTo;
                    }
                } else {
                    if ( $rootScope.data.search.eventDateFrom ) {
                        $rootScope.data.search.deathDate = $rootScope.data.search.eventDateFrom;
                    } else if ( $rootScope.data.search.eventDateTo ) {
                        $rootScope.data.search.deathDate = $rootScope.data.search.eventDateTo;
                    }
                }
            }
            if ( $rootScope.data.search.deathPlace || $rootScope.data.search.deathDate ) {
                $rootScope.data.search.status = "Deceased";
            }
        }

        if ( $rootScope.data.search.eventType == "burial" && ( $rootScope.data.search.eventPlace || $rootScope.data.search.eventDateFrom || $rootScope.data.search.eventDateTo ) ) {
            $rootScope.data.search.status = "Deceased";
        }

        if ( !$rootScope.data.search.langTemplate ) {
            $rootScope.data.search.langTemplate = "Standard";
        }

        if (
            $rootScope.data.search.motherGivenName ||
            $rootScope.data.search.motherSurname ||
            $rootScope.data.search.fatherGivenName ||
            $rootScope.data.search.fatherSurname ||
            $rootScope.data.search.spouseGivenName ||
            $rootScope.data.search.spouseSurname
        ) {
            $scope.isCollapsed = true;
        }
        if ( !$rootScope.data.search.gender ) {
            $rootScope.data.search.gender = 'Unknown';
        }

        $scope.langTemplates = [
            'Standard',
            'Spanish',
            'Portuguese',
            'Cyrillic',
            'Chinese',
            'Japanese',
            'Khmer',
            'Korean',
            'Mongolian',
            'Thai',
            'Vietnamese'
        ];

        $scope.status = {
            isopen: false
        };

        $scope.toggleDropdown = function( $event ) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.changeTemplate = function( $template ) {
            $rootScope.data.search.langTemplate = $template;
            if ( $template == "Cyrillic" ) {
                $scope.title1 = "Cyrillic";
                $scope.title2 = "Roman";
            } else if ( $template == "Chinese" ) {
                $scope.title1 = "Hanzi";
                $scope.title2 = "Roman";
            } else if ( $template == "Japanese" ) {
                $scope.title1 = "Kanji";
                $scope.title2 = "Kana";
                $scope.title3 = "Roman";
            } else if ( $template == "Khmer" ) {
                $scope.title1 = "Khmer";
                $scope.title2 = "Roman";
            } else if ( $template == "Korean" ) {
                $scope.title1 = "Hangul";
                $scope.title2 = "Hanja";
                $scope.title3 = "Roman";
            } else if ( $template == "Mongolian" ) {
                $scope.title1 = "Mongolian";
                $scope.title2 = "Roman";
            } else if ( $template == "Thai" ) {
                $scope.title1 = "Thai";
                $scope.title2 = "Roman";
            } else if ( $template == "Vietnamese" ) {
                $scope.title1 = "Vietnamese";
                $scope.title2 = "Roman";
            }

            // title2 = Thai, Mongolian, Khmer, Chinese, Cyrillic
            // title3 = Japanese, Korean

        }

        $scope.getLocation = fsUtils.getLocation;
        $scope.removeEmpty = fsUtils.removeEmptyProperties;
        $scope.getDate = fsUtils.getDate;

        $scope.goNext = function() {
            $rootScope.data.search.newPerson = 1;
            $location.path( '/fs-addattach' );
        };
        $scope.goBack = function() {
            $location.path( '/fs-search' );
        };

    }]
);