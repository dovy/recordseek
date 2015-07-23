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
    ['$rootScope', '$location', '$scope', 'fsAPI', 'fsUtils', function( $rootScope, $location, $scope, fsAPI, fsUtils ) {

        $rootScope.service = 'FamilySearch';
        ;
        fsAPI.getCurrentUser().then(
            function( response ) {
                $rootScope.fsUser = response.getUser();
            }
        );

        $rootScope.log( $rootScope.data.search );

        $rootScope.data.search = fsUtils.cleanSearch( $rootScope.data.search );

        $rootScope.toCreate = [];
        var $data = "";
        var maybeMakePerson = {};




        if ( $rootScope.data.search.langTemplate ) {
            maybeMakePerson.names = {};
            if ( $rootScope.data.search.langTemplate == "Cyrillic" ) {
                maybeMakePerson.names.cyrillic = {};
                $data = {
                    title: 'Name',
                    sub: 'Cyrillic',
                    value: ''
                };
                if ( $rootScope.data.search.prefix1 ) {
                    $data.value += $rootScope.data.search.prefix1 + ' ';
                    maybeMakePerson.names.cyrillic.$prefix = $rootScope.data.search.prefix1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.cyrillic.$givenName = $rootScope.data.search.givenName1;
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.cyrillic.$surname = $rootScope.data.search.surname1;
                }
                if ( $rootScope.data.search.suffix1 ) {
                    $data.value += $rootScope.data.search.suffix1;
                    maybeMakePerson.names.cyrillic.$suffix = $rootScope.data.search.suffix1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.prefix2 ) {
                    $data.value += $rootScope.data.search.prefix2 + ' ';
                    maybeMakePerson.names.roman.$prefix = $rootScope.data.search.prefix2;
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName2;
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname2;
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
                maybeMakePerson.names.hanzi = {};
                if ( $rootScope.data.search.prefix1 ) {
                    $data.value += $rootScope.data.search.prefix1 + ' ';
                    maybeMakePerson.names.hanzi.$prefix = $rootScope.data.search.prefix1;
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.hanzi.$surname = $rootScope.data.search.surname1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.hanzi.$givenName = $rootScope.data.search.givenName1;
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

                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.prefix2 ) {
                    $data.value += $rootScope.data.search.prefix2 + ' ';
                    $rootScope.newPerson.names.roman.$prefix = $rootScope.data.search.prefix2;
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname2;
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName1;
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
                maybeMakePerson.names.kanji = {};

                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.kanji.$surname = $rootScope.data.search.surname1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.kanji.$givenName = $rootScope.data.search.givenName1;
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
                maybeMakePerson.names.kana = {};
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.kana.$surname = $rootScope.data.search.surname2;
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.kana.$givenName = $rootScope.data.search.givenName2;
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
                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.surname3 ) {
                    $data.value += $rootScope.data.search.surname3 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname3;
                }
                if ( $rootScope.data.search.givenName3 ) {
                    $data.value += $rootScope.data.search.givenName3 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName3;
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
                maybeMakePerson.names.khmer = {};
                if ( $rootScope.data.search.prefix1 ) {
                    $data.value += $rootScope.data.search.prefix1 + ' ';
                    $rootScope.newPerson.names.khmer.$prefix = $rootScope.data.search.prefix1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.khmer.$givenName = $rootScope.data.search.givenName1;
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.khmer.$surname = $rootScope.data.search.surname1;
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
                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.prefix2 ) {
                    maybeMakePerson.names.roman.$prefix = $rootScope.data.search.prefix2;
                    $data.value += $rootScope.data.search.prefix2 + ' ';
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName2;
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname2;
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
                maybeMakePerson.names.hangul = {};
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.hangul.$surname = $rootScope.data.search.surname1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.hangul.$givenName = $rootScope.data.search.givenName1;
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
                maybeMakePerson.names.hanja = {};
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.hanji.$surname = $rootScope.data.search.surname2;
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.hanja.$givenName = $rootScope.data.search.givenName2;
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
                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.surname3 ) {
                    $data.value += $rootScope.data.search.surname3 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname3;
                }
                if ( $rootScope.data.search.givenName3 ) {
                    $data.value += $rootScope.data.search.givenName3 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName3;
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
                maybeMakePerson.names.mongolian = {};
                if ( $rootScope.data.search.prefix1 ) {
                    $data.value += $rootScope.data.search.prefix1 + ' ';
                    maybeMakePerson.names.mongolian.$prefix = $rootScope.data.search.prefix1;
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.mongolian.$surname = $rootScope.data.search.surname1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.mongolian.$givenName = $rootScope.data.search.givenName1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.prefix2 ) {
                    $data.value += $rootScope.data.search.prefix2 + ' ';
                    maybeMakePerson.names.roman.$prefix = $rootScope.data.search.prefix2;
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname2;
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName2;
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
                maybeMakePerson.names.thai = {};
                if ( $rootScope.data.search.prefix1 ) {
                    $data.value += $rootScope.data.search.prefix1 + ' ';
                    maybeMakePerson.names.thai.$prefix = $rootScope.data.search.prefix1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.thai.$givenName = $rootScope.data.search.givenName1;
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.thai.$surname = $rootScope.data.search.surname1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.prefix2 ) {
                    $data.value += $rootScope.data.search.prefix2 + ' ';
                    maybeMakePerson.names.roman.$prefix = $rootScope.data.search.prefix2;
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName2;
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname2;
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
                maybeMakePerson.names.vietnamese = {};
                if ( $rootScope.data.search.prefix1 ) {
                    $data.value += $rootScope.data.search.prefix1 + ' ';
                    maybeMakePerson.names.vietnamese.$prefix = $rootScope.data.search.prefix1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.vietnamese.$givenName = $rootScope.data.search.givenName1;
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.vietnamese.$surname = $rootScope.data.search.surname1;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }
                $data = {
                    title: 'Name',
                    sub: 'Roman',
                    value: ''
                };
                maybeMakePerson.names.roman = {};
                if ( $rootScope.data.search.prefix2 ) {
                    $data.value += $rootScope.data.search.prefix2 + ' ';
                    maybeMakePerson.names.roman.$prefix = $rootScope.data.search.prefix2;
                }
                if ( $rootScope.data.search.givenName2 ) {
                    $data.value += $rootScope.data.search.givenName2 + ' ';
                    maybeMakePerson.names.roman.$givenName = $rootScope.data.search.givenName1;
                }
                if ( $rootScope.data.search.surname2 ) {
                    $data.value += $rootScope.data.search.surname2 + ' ';
                    maybeMakePerson.names.roman.$surname = $rootScope.data.search.surname2;
                }
                if ( $data.value !== '' ) {
                    $rootScope.toCreate.push( $data );
                }

            } else {
                $data = {
                    title: 'Name',
                    value: ''
                };
                maybeMakePerson.names.standard = {};
                if ( $rootScope.data.search.prefix1 ) {
                    $data.value += $rootScope.data.search.prefix1 + ' ';
                    maybeMakePerson.names.standard.$prefix = $rootScope.data.search.prefix1;
                }
                if ( $rootScope.data.search.givenName1 ) {
                    $data.value += $rootScope.data.search.givenName1 + ' ';
                    maybeMakePerson.names.standard.$givenName = $rootScope.data.search.givenName1;
                }
                if ( $rootScope.data.search.surname1 ) {
                    $data.value += $rootScope.data.search.surname1 + ' ';
                    maybeMakePerson.names.standard.$surname = $rootScope.data.search.surname1;
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
            maybeMakePerson.gender = 'http://gedcomx.org/'+$rootScope.data.search.gender;
        }
        maybeMakePerson.events = {};
        if ( $rootScope.data.search.birthDate || $rootScope.data.search.birthPlace ) {
            $data = {
                title: 'Birth',
                value: ''
            };
            maybeMakePerson.events.birth = {
                type: 'http://gedcomx.org/Birth',
            };
            if ( $rootScope.data.search.birthDate ) {
                if ( $rootScope.data.search.birthDate.normalized ) {
                    $data.value += $rootScope.data.search.birthDate.normalized;
                    maybeMakePerson.events.birth.$date = $rootScope.data.search.birthDate.normalized;
                } else {
                    $data.value += $rootScope.data.search.birthDate;
                    maybeMakePerson.events.birth.$date = $rootScope.data.search.birthDate;
                }
            }
            if ( $rootScope.data.search.birthPlace ) {
                if ( $rootScope.data.search.birthDate ) {
                    $data.value += '<br />';
                }
                $data.value += $rootScope.data.search.birthPlace;
                maybeMakePerson.events.birth.$place = $rootScope.data.search.birthPlace;
            }
            $rootScope.toCreate.push( $data );
        }
        if ( ( $rootScope.data.search.deathDate || $rootScope.data.search.deathPlace ) && $rootScope.data.search.status != 'Living' ) {
            $data = {
                title: 'Death',
                value: ''
            };
            maybeMakePerson.events.death = {
                type: 'http://gedcomx.org/Death',
            };
            if ( $rootScope.data.search.deathDate ) {
                if ( $rootScope.data.search.deathDate.normalized ) {
                    $data.value += $rootScope.data.search.deathDate.normalized;
                    maybeMakePerson.events.death.$date = $rootScope.data.search.deathDate.normalized;
                } else {
                    $data.value += $rootScope.data.search.deathDate;
                    maybeMakePerson.events.death.$date = $rootScope.data.search.deathDate;
                }
            }
            if ( $rootScope.data.search.deathPlace ) {
                if ( $rootScope.data.search.deathDate ) {
                    $data.value += '<br />';
                }
                $data.value += $rootScope.data.search.deathPlace;
                maybeMakePerson.events.death.$place = $rootScope.data.search.deathPlace;
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
            if ( !angular.equals( {}, maybeMakePerson ) ) {
                $rootScope.toCreate = maybeMakePerson;
            }
            $location.path( '/fs-create' );
        };

    }]
);
