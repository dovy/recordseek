'use strict';

var RecordSeek = RecordSeek || {};
RecordSeek.helpers = {
    isNotString: function( str ) {
        return (typeof str !== 'string');
    }
};

if ( 'addEventListener' in document ) {
    document.addEventListener(
        'DOMContentLoaded', function() {
            FastClick.attach( document.body );
        }, false
    );
}


/**
 * @ngdoc overview
 * @name recordseekApp
 * @description
 * # recordseekApp
 *
 * Main module of the application.
 */
angular
    .module(
        'recordseekApp', [
            'ngAnimate',
            'ngCookies',
            'ngMessages',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'ui.bootstrap',
        ]
    )
    .run(
        ['$rootScope', '$location', '$cookies', '$window', 'fsAPI', '$http', '$log', '$timeout', function( $rootScope, $location, $cookie, $window, fsAPI, $http, $log, $timeout ) {
            /* global ga, _ */
            /* jshint camelcase: true */
            // For debugging purposes obviously
            $http.defaults.useXDomain = true;
            delete $http.defaults.headers.common['X-Requested-With'];

            // window.location.origin is not supported by IE11
            if ( !window.location.origin ) {
                window.location.origin = window.location.protocol + '//' +
                    window.location.hostname +
                    (window.location.port ? ':' + window.location.port : '');
            }
            if ( !document.location.origin ) {
                document.location.origin = window.location.origin;
            }
            //var referrer = window.location.href.substring(window.location.origin.length, window.location.href.length);

            $rootScope.helpers = RecordSeek.helpers;
            $rootScope.attachMsg = 'Source created by http://RecordSeek.com';

            $rootScope.debug = (fsAPI.settings.environment == 'production' || fsAPI.settings.environment == 'beta') ? false : true;

            if ( !$rootScope.debug ) {
                ga( 'create', 'UA-16096334-10' );
                ga( 'send', 'pageview' );
            }

            $rootScope.service = '';
            $rootScope.expires = 15; // Mins until the cookie is expired

            $rootScope.log = function( $message ) {
                if ( $rootScope.debug ) {
                    $log.debug( $message );
                }
            };
            $rootScope.setCookie = function( $key, $data ) {
                var date = new Date(),
                    $exp = new Date( date );
                $exp.setMinutes( date.getMinutes() + $rootScope.expires );
                $cookie.put(
                    $key, $data, {
                        expires: $exp
                    }
                );
            };
            $rootScope.logout = function() {
                $rootScope.log( fsAPI );
                if ( $rootScope.service === "FamilySearch" ) {
                    // fsAPI.invalidateAccessToken();
                    fsAPI.helpers.eraseAccessToken( true );
                    $rootScope.user = ""
                    $location.path( '/' );
                }
            };

            $rootScope.safeApply = function() {
                var phase = this.$root.$$phase;
                if ( phase == '$apply' || phase == '$digest' ) {
                } else {
                    this.$apply();
                }
            };

            $rootScope.track = function( event ) {
                if ( !$rootScope.debug ) {
                    ga( 'send', 'event', event );
                } else {
                    $rootScope.log( event );
                }
            };

            $rootScope.actionTaken = function( $event ) {
                var $el = $event.currentTarget.attributes;
                if ( $el['data-tracking'] ) {
                    $rootScope.track( {eventCategory: 'App', eventAction: $el['data-tracking'].value} );
                }

                // Redirect if they've already been to the main page before
                if ( $el['data-tracking'] && ($el['data-tracking'].value === "FamilySearch" || $el['data-tracking'].value === "Ancestry") ) {
                    $rootScope.setCookie( 'recordseek-last-service', $el['data-tracking'].value );
                }

                if ( $el['target'] && $el['target'].value === "_blank" ) {
                    $window.open( $el['data-href'].value );
                } else {
                    $location.path( $el['data-href'].value );
                }
            };

            var split = document.URL.split( '#/' );

            var params = fsAPI.helpers.decodeQueryString( split[0] );

            if ( params.tags ) {
                var $todo = params.tags.split( ',' );
                params.tags = {};
                $todo.map(
                    function( item ) {
                        params.tags[item.toLowerCase()] = true;
                    }
                );
            } else {
                params.tags = {};
            }
            if ( params.birthPlace || params.birthDate ) {
                params.tags.birth = true;
            }
            if ( params.deathPlace || params.deathDate ) {
                params.tags.death = true;
            }
            if ( params.givenName || params.surname ) {
                params.tags.name = true;
            }
            if ( params.gender ) {
                params.tags.gender = true;
            }
            $rootScope.log( params );
            if ( params.r == 1 ) {
                delete params.r;
                var cData = $cookie.get( 'recordseek-auth' );
                if ( cData != "" ) {
                    params = angular.fromJson( cData );
                }
            }

            if ( $location.$$absUrl.indexOf( '?_' ) > -1 && $location.$$absUrl.indexOf( '/#' ) === -1 ) {
                //var $url = $location.$$absUrl.replace( '?_', '#/?_' );
                //$window.location.href = $url;
                //return;
            }

            //$rootScope.log(document.location.origin+'/');

            if ( params ) {
                var obj = params;
                var personData = {};
                var skip = [
                    'h1'
                ];

                for ( var prop in obj ) {
                    var value = obj[prop], type = typeof value;
                    if ( value !== null && (type === 'string') && obj.hasOwnProperty( prop ) ) {
                        if ( prop.indexOf( '.' ) !== -1 ) {
                            var index = prop.split( '.' );
                            obj[index[0]] = (obj[index[0]]) ? obj[index[0]] : [];
                            obj[index[0]][index[1]] = obj[prop].replace( /(\r\n|\n|\r)/gm, "" ).replace(
                                / +(?= )/g, ''
                            ).trim();
                        } else {
                            obj[prop] = obj[prop].replace( /(\r\n|\n|\r)/gm, "" ).replace( / +(?= )/g, '' ).trim();
                        }
                        if ( skip.indexOf( prop ) === -1 && obj[prop] != "" ) {
                            personData[prop] = obj[prop];
                        }
                    }
                }

                if ( !angular.equals( {}, personData ) ) {
                    $rootScope.log( personData );
                    $rootScope.personData = personData;
                }
                var date = new Date();
                Date.prototype.yyyymmdd = function() {
                    var yyyy = this.getFullYear().toString();
                    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
                    var dd = this.getDate().toString();
                    return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
                };
                obj.time = date.yyyymmdd();

                if ( obj.url && obj.url.indexOf( 'billiongraves.com' ) > -1 ) {
                    var $removeHash = obj.url.split( '#' );
                    obj.url = $removeHash[0];
                }
                $rootScope.data = obj;

                if ( !$rootScope.data.sourceFormat ) {
                    $rootScope.data.sourceFormat = 'MLA';
                }

                var $dateVal = '/Date(' + $rootScope.data._ + ')/';
                var $date = new Date( parseFloat( $dateVal.substr( 6 ) ) );
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var year = $date.getFullYear();
                var month = months[$date.getMonth()];
                var date = $date.getDate();
                $rootScope.data.time = date + ' ' + month + '. ' + year;
                if ( $rootScope.data.url && $rootScope.data.url !== '' ) {
                    if ( $rootScope.data.url.indexOf( 'ancestry' ) > -1 ) {
                        $rootScope.data.url = $rootScope.data.url.replace(
                            'ancestryinstitution.com', 'ancestry.com'
                        ).replace( 'ancestrylibrary.com', 'ancestry.com' ).replace(
                            'ancestrylibrary.proquest.com', 'ancestry.com'
                        );
                    }
                    // Clean up the Ancestry search URLs

                    var ancestry_parts = [
                        'pid',
                        'h',
                        'db',
                        'indiv',
                        'treeid'
                    ];

                    if ( $rootScope.data.url && $rootScope.data.url.indexOf( 'ancestry.com' ) > -1 ) {
                        var urlData = fsAPI.helpers.decodeQueryString( $rootScope.data.url );

                        var newURL = {};
                        angular.forEach(
                            ancestry_parts, function( value ) {
                                if ( urlData[value] ) {
                                    this[value] = urlData[value];
                                }
                            }, newURL
                        );

                        $rootScope.data.url = fsAPI.helpers.appendQueryParameters(
                            fsAPI.helpers.removeQueryString( $rootScope.data.url ), newURL
                        );
                    }

                    if ( $rootScope.data.url && $rootScope.data.url.indexOf( 'billiongraves.com' ) > -1 ) {
                        var $split = $rootScope.data.url.split( '/' );
                        $rootScope.data.citation = '"Billion Graves Record," BillionGraves (' + $rootScope.data.url + ' accessed ' + $rootScope.data.time + '), ' + $rootScope.data.title + ' Record #' + $split[($split.length - 1)] + '. Citing BillionGraves, Headstones, BillionGraves.com.';
                    } else if ( !$rootScope.data.citation ) {
                        $rootScope.data.citation = '"' + $rootScope.data.title + '." ' + $rootScope.data.title + '. N.p., n.d. Web. ' + $rootScope.data.time + '. <' + $rootScope.data.url + '>.';
                    }

                    if ( $rootScope.data.url ) {
                        var $dSplit = $rootScope.data.url.split( '//' );
                        var $domain = $dSplit[1];
                        if ( $domain ) {
                            $dSplit = $domain.replace( 'www.', '' ).split( '/' )[0];

                            $rootScope.data.domain = $dSplit.charAt( 0 ).toUpperCase() + $dSplit.slice( 1 );
                            console.log( $rootScope.data.domain );
                            $rootScope.track(
                                {
                                    eventCategory: 'Domain',
                                    eventAction: $rootScope.data.domain.toLowerCase().replace( 'www.', '' )
                                }
                            );
                        }
                    }
                }
                if ( $rootScope.data.notes ) {
                    $rootScope.data.notes = $rootScope.data.notes.trim().replace( '#/fs-source', '' );
                }

                if ( $rootScope.data.notes && $rootScope.data.notes.trim() !== '' ) {
                    $rootScope.data.notes += '\n\n';
                } else {
                    $rootScope.data.notes = '';
                }
                if ( $rootScope.data.notes.indexOf( $rootScope.attachMsg ) === -1 ) {
                    $rootScope.data.notes += $rootScope.attachMsg;
                }
                if ( !$rootScope.data.title ) {
                    $rootScope.data.title = '';
                }
                if ( !$rootScope.data.citation ) {
                    $rootScope.data.citation = '';
                }
            } else {
                if ( ( document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com' ) && !$rootScope.data ) {
                    //$rootScope.data = angular.fromJson( $cookie.get( 'recordseek' ) );
                }
            }

            $rootScope.$on(
                '$routeChangeSuccess', function() {
                    if ( ( document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com' ) ) {
                        if ( $rootScope.data ) {
                            if ( $location.$$path !== '/about' && $location.$$path !== '/support' && $location.$$path !== '/expired' && $rootScope.data ) {
                                //var date = new Date(),
                                //    $exp = new Date( date );
                                //$exp.setMinutes( date.getMinutes() + $rootScope.expires );
                                //$cookie.put(
                                //    'recordseek', angular.toJson( $rootScope.data ), {
                                //        expires: $exp
                                //    }
                                //);
                            }
                        }

                    }
                }
            );

            if ( !$rootScope.data ) {
                $rootScope.data = {};
            }

            if ( !$rootScope.data.addPerson ) {
                $rootScope.data.addPerson = {};
            }

            $rootScope.auth = {};

            var advanced = '';
            $rootScope.resetSearch = function( $data ) {
                if ( $rootScope.data.search && $rootScope.data.search.advanced ) {
                    advanced = $rootScope.data.search.advanced;
                }
                var $blank = {
                    givenName: '',
                    givenNameExact: '',
                    surname: '',
                    surnameExact: '',
                    gender: '',
                    eventType: '',
                    eventDate: '',
                    eventDateFrom: '',
                    eventDateTo: '',
                    eventPlace: '',
                    eventPlaceExact: '',
                    spouseGivenName: '',
                    spouseGivenNameExact: '',
                    spouseSurname: '',
                    spouseSurnameExact: '',
                    motherGivenName: '',
                    motherGivenNameExact: '',
                    motherSurname: '',
                    motherSurnameExact: '',
                    fatherGivenName: '',
                    fatherGivenNameExact: '',
                    fatherSurname: '',
                    fatherSurnameExact: '',
                    pid: '',
                    status: '',
                };
                if ( advanced !== '' ) {
                    $blank.advanced = advanced;
                } else {
                    advanced = false;
                }
                if ( $data ) {
                    return $blank;
                } else {
                    $rootScope.data.search = $blank;
                }
            };

            $rootScope.tagCounting = function() {
                var count = 0;
                angular.forEach(
                    $rootScope.data.tags, function( value, key ) {
                        if ( value === true ) {
                            count++;
                        }
                    }, count
                );
                if ( count === 0 ) {
                    count = '';
                }
                $rootScope.tagCount = count;
            }
            $rootScope.tagCounting();

            $rootScope.closeTags = function() {
                $timeout(
                    function() {
                        angular.element( '#sourceTags' ).trigger( 'click' );
                    }, 0
                );
            }

            if ( !$rootScope.data.search ) {
                $rootScope.resetSearch();
                $rootScope.data.search.advanced = false;
                if ( $rootScope.personData && !angular.equals( {}, $rootScope.personData ) ) {
                    for ( var prop in $rootScope.personData ) {
                        $rootScope.personData[prop];
                        if ( $rootScope.data.search.hasOwnProperty( prop ) !== -1 ) {
                            $rootScope.data.search[prop] = $rootScope.personData[prop];
                        }
                    }
                }
            }
        }]
    )
    .constant( '_', _ )
    .config(
        ["$provide", "$routeProvider", function( $provide, $routeProvider ) {
            $provide.decorator(
                "$exceptionHandler", ["$delegate", "$window", function( $delegate, $window ) {
                    return function( exception, cause ) {
                        if ( $window.trackJs ) {
                            $window.trackJs.track( exception );
                        }
                        // (Optional) Pass the error through to the delegate formats it for the console
                        $delegate( exception, cause );
                    };
                }]
            )
            $routeProvider
                .when(
                    '/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                        //templateUrl: 'views/fs-source.html',
                        //controller: 'FsSourceCtrl'
                    }
                )
                .when(
                    '/about', {

                        templateUrl: 'views/about.html',
                        controller: 'AboutCtrl'
                    }
                )
                .when(
                    '/loading', {
                        templateUrl: 'views/loading.html',
                        controller: 'LoadingCtrl'
                    }
                )
                .when(
                    '/support', {
                        templateUrl: 'views/support.html',
                        controller: 'SupportCtrl'
                    }
                )
                .when(
                    '/fs-source', {
                        templateUrl: 'views/fs-source.html',
                        controller: 'FsSourceCtrl'
                    }
                )
                .when(
                    '/fs-upload', {
                        templateUrl: 'views/fs-upload.html',
                        controller: 'FsUploadCtrl'
                    }
                )
                .when(
                    '/fs-search', {
                        templateUrl: 'views/fs-search.html',
                        controller: 'FsSearchCtrl'
                    }
                )
                .when(
                    '/fs-addperson', {
                        templateUrl: 'views/fs-addperson.html',
                        controller: 'FsAddpersonCtrl'
                    }
                )
                .when(
                    '/fs-attach', {
                        templateUrl: 'views/fs-attach.html',
                        controller: 'FsAttachCtrl'
                    }
                )
                .when(
                    '/fs-addattach', {
                        templateUrl: 'views/fs-addattach.html',
                        controller: 'FsAddAttachCtrl'
                    }
                )
                .when(
                    '/fs-complete', {
                        templateUrl: 'views/fs-complete.html',
                        controller: 'FsCompleteCtrl'
                    }
                )
                .when(
                    '/a-source', {
                        templateUrl: 'views/a-source.html',
                        controller: 'ASourceCtrl'
                    }
                )

                .when(
                    '/fs-results', {
                        templateUrl: 'views/fs-results.html',
                        controller: 'FsResultsCtrl'
                    }
                )
                .when(
                    '/fs-create', {
                        templateUrl: 'views/fs-create.html',
                        controller: 'FsCreateCtrl'
                    }
                )
                .otherwise(
                    {
                        redirectTo: '/'
                    }
                )
        }]
    );
