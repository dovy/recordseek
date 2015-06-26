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
    ['$rootScope', '$location', '$cookies', '$window', 'fsAPI', '$httpProvider', function( $rootScope, $location, $cookie, $window, fsAPI, $httpProvider ) {
        /* global ga, _ */
        /* jshint camelcase: true */
        // For debugging purposes obviously

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        // window.location.origin is not supported by IE11
        if ( !window.location.origin ) {
            window.location.origin = window.location.protocol + "//"
            + window.location.hostname
            + (window.location.port ? ':' + window.location.port : '');
        }
        if ( !document.location.origin ) {
            document.location.origin = window.location.origin;
        }
        //var referrer = window.location.href.substring(window.location.origin.length, window.location.href.length);


        $rootScope.helpers = RecordSeek.helpers;
        $rootScope.attachMsg = 'This source was created for free with http://RecordSeek.com';

        $rootScope.debug = (fsAPI.settings.environment == 'production' || fsAPI.settings.environment == 'beta') ? false : true;

        if ( !$rootScope.debug ) {
            ga( 'create', 'UA-16096334-10' );
            ga( 'send', 'pageview' );
        }

        $rootScope.service = '';

        $rootScope.log = function( $log ) {
            if ( $rootScope.debug ) {
                console.log( $log );
            }
        };
        $rootScope.logout = function() {
            if ( $rootScope.service === "FamilySearch" ) {
                fsAPI.helpers.eraseAccessToken( true );
                $location.path( '/' );
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
            if ( $el['target'] && $el['target'].value === "_blank" ) {
                $window.open( $el['data-href'].value );
            } else {
                $location.path( $el['data-href'].value );
            }
        };

        $rootScope.expires = 15; // Mins until the cookie is expired
        window.liveSettings = {
            api_key: '11643e1c6ccd4371bfb889827b19fde3',
            picker: '#languagePicker',
            detectlang: true,
            dynamic: true,
            autocollect: true,
            staging: true
        };

        var params = fsAPI.helpers.decodeQueryString( document.URL );

        if ( $location.$$absUrl.indexOf( '?_' ) > -1 && $location.$$absUrl.indexOf( '/#' ) === -1 ) {
            //var $url = $location.$$absUrl.replace( '?_', '#/?_' );
            //$window.location.href = $url;
            //return;
        }

        //console.log(document.location.origin+'/');

        $rootScope.sourceBoxURL = 'https://familysearch.org/links-gadget/linkpage.jsp?referrer=/links-gadget/linkpage.jsp#sbp';

        if ( params ) {
            var obj = params;

            for ( var prop in obj ) {
                var value = obj[prop], type = typeof value;
                if ( value !== null && (type === 'string') && obj.hasOwnProperty( prop ) ) {
                    obj[prop] = obj[prop].trim();
                }
            }

            //obj.box = [{"RecordSeek.com"}];

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
                if ( $rootScope.data.url.indexOf( 'search.ancestry.com' ) > -1 ) {
                    var urlData = fsAPI.helpers.decodeQueryString( $rootScope.data.url );
                    var newURL = {};
                    if ( urlData.h ) {
                        newURL.h = urlData.h;
                    }
                    if ( urlData.db ) {
                        newURL.db = urlData.db;
                    }
                    if ( urlData.indiv ) {
                        newURL.indiv = urlData.indiv;
                    }
                    $rootScope.data.url = fsAPI.helpers.appendQueryParameters(
                        fsAPI.helpers.removeQueryString( $rootScope.data.url ), newURL
                    );
                }
                // Clean up the ancestry interactive URLs
                if ( $rootScope.data.url.indexOf( 'interactive.ancestry.com' ) > -1 ) {
                    $rootScope.data.url = fsAPI.helpers.removeQueryString( $rootScope.data.url );
                }
                if ( $rootScope.data.url.indexOf( 'billiongraves.com' ) > -1 ) {
                    var $split = $rootScope.data.url.split( '/' );
                    $rootScope.data.citation = '"Billion Graves Record," BillionGraves (' + $rootScope.data.url + ' accessed '.$rootScope.data.time + '), '.$rootScope.data.description + ' Record #' + $split[($split.length - 1)] + '. Citing BillionGraves, Headstones, BillionGraves.com.';
                } else if ( !$rootScope.data.citation ) {
                    $rootScope.data.citation = '"' + $rootScope.data.title + '." ' + $rootScope.data.title + '. N.p., n.d. Web. ' + $rootScope.data.time + '. <' + $rootScope.data.url + '>.';
                }

                var $dSplit = $rootScope.data.url.split( '//' );
                var $domain = $dSplit[1];
                $dSplit = $domain.split( '/' );
                $rootScope.data.domain = $dSplit[0].charAt( 0 ).toUpperCase() + $dSplit[0].slice( 1 );
                $rootScope.track(
                    {
                        eventCategory: 'Domain',
                        eventAction: $rootScope.data.domain.toLowerCase().replace( 'www.', '' )
                    }
                );


            }

            if ( $rootScope.data.notes && $rootScope.data.notes.trim() !== '' ) {
                $rootScope.data.notes += '\n\n';
            } else {
                $rootScope.data.notes = '';
            }
            $rootScope.data.notes += $rootScope.attachMsg;

            if ( !$rootScope.data.title ) {
                $rootScope.data.title = '';
            }
            if ( !$rootScope.data.citation ) {
                $rootScope.data.citation = '';
            }
        } else {
            if ( ( document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com' ) && !$rootScope.data ) {
                $rootScope.data = angular.fromJson( $cookie.get( 'recordseek' ) );
            }
        }

        $rootScope.$on(
            '$routeChangeSuccess', function() {
                if ( ( document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com' ) ) {
                    if ( $rootScope.data ) {
                        if ( $location.$$path !== '/about' && $location.$$path !== '/support' && $location.$$path !== '/expired' && $rootScope.data ) {
                            var date = new Date(),
                                $exp = new Date( date );
                            $exp.setMinutes( date.getMinutes() + $rootScope.expires );
                            $cookie.put(
                                'recordseek', angular.toJson( $rootScope.data ), {
                                    expires: $exp
                                }
                            );
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
        $rootScope.resetSearch = function() {
            if ( $rootScope.data.search && $rootScope.data.search.advanced ) {
                advanced = $rootScope.data.search.advanced;
            }
            $rootScope.data.search = {
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
                pid: ''
            };
            if ( advanced !== '' ) {
                $rootScope.data.search.advanced = advanced;
            }
        };

        if ( !$rootScope.data.search ) {
            $rootScope.resetSearch();
            $rootScope.data.search.advanced = false;
        }


    }]
)
    .constant( '_', _ )
    .config(
    function( $routeProvider ) {
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
        );
    }
);
