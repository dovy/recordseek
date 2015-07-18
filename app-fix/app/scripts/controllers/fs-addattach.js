'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsAttachCtrl
 * @description
 * # FsAttachCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'FsAddAttachCtrl',
    ['$rootScope', '$location', '$scope', 'fsAPI', function( $rootScope, $location, $scope, fsAPI, fsUtils ) {

        $rootScope.service = 'FamilySearch';;
        fsAPI.getCurrentUser().then(
            function( response ) {
                $rootScope.fsUser = response.getUser();
            }
        );

        $rootScope.log( $rootScope.data.search );

        $rootScope.toCreate = [];
        var $data = "";

        if ( $rootScope.data.search.langTemplate ) {
            if ( $rootScope.data.search.langTemplate == "Cyrillic" ) {
                $data = {
                    title: 'Name',
                    sub: 'Cyrillic',
                    value: ''
                };
                if ( $rootScope.data.search.title1 ) {
                    $data.value += $rootScope.data.search.title1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $rootScope.data.search.suffix1 ) {
                    $data.value += $rootScope.data.search.suffix1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.title2 ) {
                    $data.value += $rootScope.data.search.title2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $rootScope.data.search.suffix2 ) {
                    $data.value += $rootScope.data.search.suffix2;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }

            } else if ( $rootScope.data.search.langTemplate == "Chinese" ) {
                $data = {
                    title: 'Name',
                    sub: 'Hanzi',
                    value: ''
                };
                if ( $rootScope.data.search.title1 ) {
                    $data.value += $rootScope.data.search.title1 + ' ';
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.suffix1 ) {
                    $data.value += $rootScope.data.search.suffix1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.title2 ) {
                    $data.value += $rootScope.data.search.title2 + ' ';
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $rootScope.data.search.suffix2 ) {
                    $data.value += $rootScope.data.search.suffix2;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }

            } else if ( $rootScope.data.search.langTemplate == "Japanese" ) {
                $data = {
                    title: 'Name',
                    sub: 'Kanji',
                    value: ''
                };

                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.suffix1 ) {
                    $data.value += $rootScope.data.search.suffix1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Kana',
                    value: ''
                };
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $rootScope.data.search.suffix2 ) {
                    $data.value += $rootScope.data.search.suffix2;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.surname3 ) {
                    $data.value += $rootScope.data.search.surname3 + ' ';
                }
                if ( $rootScope.data.search.givenName3 ) {
                    $data.value += $rootScope.data.search.givenName3 + ' ';
                }
                if ( $rootScope.data.search.suffix3 ) {
                    $data.value += $rootScope.data.search.suffix3;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
            } else if ( $rootScope.data.search.langTemplate == "Khmer" ) {
                $data = {
                    title: 'Name',
                    sub: 'Khmer',
                    value: ''
                };
                if ( $rootScope.data.search.title1 ) {
                    $data.value += $rootScope.data.search.title1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $rootScope.data.search.suffix1 ) {
                    $data.value += $rootScope.data.search.suffix1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.title2 ) {
                    $data.value += $rootScope.data.search.title2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $rootScope.data.search.suffix2 ) {
                    $data.value += $rootScope.data.search.suffix2;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
            } else if ( $rootScope.data.search.langTemplate == "Korean" ) {
                $data = {
                    title: 'Name',
                    sub: 'Hangul',
                    value: ''
                };

                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.suffix1 ) {
                    $data.value += $rootScope.data.search.suffix1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Hanja',
                    value: ''
                };
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $rootScope.data.search.suffix2 ) {
                    $data.value += $rootScope.data.search.suffix2;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.surname3 ) {
                    $data.value += $rootScope.data.search.surname3 + ' ';
                }
                if ( $rootScope.data.search.givenName3 ) {
                    $data.value += $rootScope.data.search.givenName3 + ' ';
                }
                if ( $rootScope.data.search.suffix3 ) {
                    $data.value += $rootScope.data.search.suffix3;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
            } else if ( $rootScope.data.search.langTemplate == "Mongolian" ) {
                $data = {
                    title: 'Name',
                    sub: 'Mongolian',
                    value: ''
                };
                if ( $rootScope.data.search.title1 ) {
                    $data.value += $rootScope.data.search.title1 + ' ';
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.title2 ) {
                    $data.value += $rootScope.data.search.title2 + ' ';
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
            } else if ( $rootScope.data.search.langTemplate == "Thai" ) {
                $data = {
                    title: 'Name',
                    sub: 'Thai',
                    value: ''
                };
                if ( $rootScope.data.search.title1 ) {
                    $data.value += $rootScope.data.search.title1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.title2 ) {
                    $data.value += $rootScope.data.search.title2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }

            } else if ( $rootScope.data.search.langTemplate == "Vietnamese" ) {

                $data = {
                    title: 'Name',
                    sub: 'Vietnamese',
                    value: ''
                };
                if ( $rootScope.data.search.title1 ) {
                    $data.value += $rootScope.data.search.title1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                if ( $rootScope.data.search.title2 ) {
                    $data.value += $rootScope.data.search.title2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }

            } else {
                $data = {
                    title: 'Name',
                    value: ''
                };
                if ( $rootScope.data.search.title1 ) {
                    $data.value += $rootScope.data.search.title1 + ' ';
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                }
                if ( $rootScope.data.search.suffix1 ) {
                    $data.value += $rootScope.data.search.suffix1;
                }
                $rootScope.toCreate.push( $data );
            }
        }


        if ( $rootScope.data.search.gender ) {
            $rootScope.toCreate.push(
                {
                    title: 'Gender',
                    value: $rootScope.data.search.gender
                }
            );
        }

        if ( $rootScope.data.search.birthDate || $rootScope.data.search.birthPlace ) {
            $data = {
                title: 'Birth',
                value: ''
            };
            if ( $rootScope.data.search.birthDate ) {
                if ($rootScope.data.search.birthDate.normalized) {
                    $data.value += $rootScope.data.search.birthDate.normalized;
                } else {
                    $data.value += $rootScope.data.search.birthDate;
                }
            }
            if ( $rootScope.data.search.birthPlace ) {
                if ( $rootScope.data.search.birthDate ) {
                    $data.value += '<br />';
                }
                $data.value += $rootScope.data.search.birthPlace;
            }
            $rootScope.toCreate.push( $data );
        }
        if ( ( $rootScope.data.search.deathDate || $rootScope.data.search.deathPlace ) && $rootScope.data.search.status != 'Living' ) {
            $data = {
                title: 'Death',
                value: ''
            };
            if ( $rootScope.data.search.deathDate ) {
                if ($rootScope.data.search.deathDate.normalized) {
                    $data.value += $rootScope.data.search.deathDate.normalized;
                } else {
                    $data.value += $rootScope.data.search.deathDate;
                }
            }
            if ( $rootScope.data.search.deathPlace ) {
                if ( $rootScope.data.search.deathDate ) {
                    $data.value += '<br />';
                }
                $data.value += $rootScope.data.search.deathPlace;
            }
            $rootScope.toCreate.push( $data );
        } else if ( $rootScope.data.search.status ) {
            $rootScope.toCreate.push(
                {
                    title: 'Death',
                    value: '<span class="text-muted">' + $rootScope.data.search.status + '</span>'
                }
            );
        }
        //if ( $rootScope.data.search.fatherGiven || $rootScope.data.search.fatherSurname ) {
        //    $data = {
        //        title: 'Father',
        //        value: ''
        //    };
        //    if ( $rootScope.data.search.fatherGiven ) {
        //        $data.value += $rootScope.data.search.fatherGiven;
        //    }
        //    if ( $rootScope.data.search.fatherSurname ) {
        //        $data.value += $rootScope.data.search.fatherSurname;
        //    }
        //    $rootScope.toCreate.push( $data );
        //}
        //if ( $rootScope.data.search.motherGiven || $rootScope.data.search.motherSurname ) {
        //    $data = {
        //        title: 'Mother',
        //        value: ''
        //    };
        //    if ( $rootScope.data.search.motherGiven ) {
        //        $data.value += $rootScope.data.search.motherGiven;
        //    }
        //    if ( $rootScope.data.search.motherSurname ) {
        //        $data.value += $rootScope.data.search.motherSurname;
        //    }
        //    $rootScope.toCreate.push( $data );
        //}
        //if ( $rootScope.data.search.spouseGiven || $rootScope.data.search.spouseSurname ) {
        //    $data = {
        //        title: 'Spouse',
        //        value: ''
        //    };
        //    if ( $rootScope.data.search.spouseGiven ) {
        //        $data.value += $rootScope.data.search.spouseGiven;
        //    }
        //    if ( $rootScope.data.search.spouseSurname ) {
        //        $data.value += $rootScope.data.search.spouseSurname;
        //    }
        //    $rootScope.toCreate.push( $data );
        //}

        $scope.goBack = function() {
            $location.path( '/fs-addperson' );
        };
        $scope.goNext = function() {
            $location.path( '/fs-complete' );
        };

        //$rootScope.toCreate =
        //    [
        //        {
        //            title: 'Name',
        //            sub: 'Kanji',
        //            value: 'Dovydas'
        //        },
        //        {
        //            title: 'Name',
        //            sub: 'Roman',
        //            value: 'Dovy'
        //        }
        //    ];
    }]
);
