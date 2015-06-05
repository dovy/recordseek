'use strict';

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
    ['$rootScope', '$location', '$cookies', '$window', function( $rootScope, $location, $cookie, $window ) {

        // For debugging purposes obviously
        $rootScope.debug = false;
        $rootScope.service = "";
        $rootScope.expires = 15; // Mins until the cookie is expired

        if ( $location.$$absUrl.indexOf( '?_' ) > -1 && $location.$$absUrl.indexOf( '/#' ) == -1 ) {
            var $url = $location.$$absUrl.replace( '?_', '#/?_' );
            $window.location.href = $url;
            return;
        }

        $rootScope.personURL = 'https://familysearch.org/tree/#view=ancestor&person=';
        $rootScope.sourceBoxURL = 'https://familysearch.org/links-gadget/linkpage.jsp?referrer=/links-gadget/linkpage.jsp#sbp';

        if ( $location.$$search && $location.$$search.url ) {
            var obj = $location.$$search;

            for ( var prop in obj ) {
                var value = obj[prop], type = typeof value;
                if ( value !== null && (type === 'string') && obj.hasOwnProperty( prop ) ) {
                    obj[prop] = obj[prop].trim();
                }
            }

            //obj.box = [{"RecordSeek.com"}];

            $rootScope.data = obj;

            var $dateVal = '/Date(' + $rootScope.data._ + ')/';
            var $date = new Date( parseFloat( $dateVal.substr( 6 ) ) );
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = $date.getFullYear();
            var month = months[$date.getMonth()];
            var date = $date.getDate();
            $rootScope.data.time = date + ' ' + month + '. ' + year;
            if ( $rootScope.data.url && $rootScope.data.url !== "" ) {
                if ( $rootScope.data.url.indexOf( 'ancestry' ) > -1 ) {
                    $rootScope.data.url = $rootScope.data.url.replace(
                        'ancestryinstitution.com', 'ancestry.com'
                    ).replace( 'ancestrylibrary.com', 'ancestry.com' ).replace(
                        'ancestrylibrary.proquest.com', 'ancestry.com'
                    );
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

            }


            if ( $rootScope.data.notes && $rootScope.data.notes.trim() != "" ) {
                $rootScope.data.notes += '\n\n';
            } else {
                $rootScope.data.notes = '';
            }
            $rootScope.data.notes += 'This source was created for free with http://RecordSeek.com.';

            if ( !$rootScope.data.title ) {
                $rootScope.data.title = '';
            }
            if ( !$rootScope.data.citation ) {
                $rootScope.data.citation = '';
            }
            if ( !$rootScope.data.notes ) {
                $rootScope.data.notes = '';
            }


            $location.url( $location.path() );
        } else {

            if ( !$rootScope.data ) {
                $rootScope.data = angular.fromJson( $cookie.get( 'recordseek' ) );
            }
        }

        $rootScope.$on(
            '$routeChangeSuccess', function( route, next, current ) {
                if ( $rootScope.data ) {
                    if ( $location.$$path !== "/about" && $location.$$path !== "/support" && $location.$$path !== "/expired" && $rootScope.data ) {
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
        );
        if ( !$rootScope.data ) {
            $rootScope.data = {};
        }

        $rootScope.auth = {};

        $rootScope.resetSearch = function() {
            if ( $rootScope.data.search && $rootScope.data.search.advanced ) {
                var advanced = $rootScope.data.search.advanced;
            }
            $rootScope.data.search = {
                givenName: '',
                givenNameExact: '',
                surname: '',
                surnameExact: '',
                gender: '',
                eventType: '',
                eventDate: '',
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
            if ( advanced ) {
                $rootScope.data.search.advanced = advanced;
            }
        };

        if ( !$rootScope.data.search ) {
            $rootScope.resetSearch();
            $rootScope.data.search.advanced = false;
        }
        $rootScope.isEmpty = function( obj ) {
            for ( var i in obj ) if ( obj.hasOwnProperty( i ) ) return false;
            return true;
        };
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
            '/fs-addPerson', {
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
