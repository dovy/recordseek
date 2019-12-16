'use strict';
/**
 * Return an empty object if passed in a null or undefined, similar to the maybe monad
 * @param {*} value Value to test
 * @returns {*} Original value or empty object
 */
window.maybe = function(value) {
    return value != null ? value : {}; // != null also covers undefined
};
var RecordSeek = RecordSeek || {};
var HEADER_NAME = 'MyApp-Handle-Errors-Generically';
var specificallyHandleInProgress = false;
RecordSeek.helpers = {
    isNotString: function( str ) {
        return (typeof str !== 'string');
    },
    decodeQueryString: function(url) {
        var obj = {};
        if (url) {
            var pos = url.indexOf('?');
            if (pos !== -1) {
                var segments = url.substring(pos+1).split('&');
                segments.forEach(function(segment) {
                    var kv = segment.split('=', 2);
                    if (kv && kv[0]) {
                        var key = decodeURIComponent(kv[0]);
                        var value = (kv[1] != null ? decodeURIComponent(kv[1]) : kv[1]); // catches null and undefined
                        if (obj[key] != null && !utils.isArray(obj[key])) {
                            obj[key] = [ obj[key] ];
                        }
                        if (obj[key] != null) {
                            obj[key].push(value);
                        }
                        else {
                            obj[key] = value;
                        }
                    }
                });
            }
        }
        return obj;
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
            'ui-notification'
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
            $rootScope.attachMsg = 'Source created by RecordSeek.com';

            $rootScope.debug = fsAPI.environment == 'production' ? false : true;

            if ( !$rootScope.debug ) {
                ga( 'create', 'UA-16096334-10' );
                ga( 'send', 'pageview' );
                try {
                    Sentry.init({ dsn: 'https://446c24f6e25e4168b4d71a90cbf74794@sentry.io/105393' });
                } catch(error) {
                    console.error('Sentry failing');
                }
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
                    fsAPI.deleteAccessToken();
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

                // Allow people to remove the RecordSeek icon from sources for Ancestry
                if ( $el['data-tracking'].value == "Ancestry" && $el['id']['nodeValue'] ) {
                    $rootScope.data.media_url = "https://recordseek.com/assets/images/ancestry.jpg";
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

            var split = document.URL.split( '#' );
            var params = $rootScope.helpers.decodeQueryString( split[0] );

            if ( $rootScope.debug ) {
                console.log( params );
            }

            if (params.code) {
                if (fsAPI.getAccessToken()) {
                    // redirect to non params URL
                    var out = [];

                    for (var key in params) {
                        if (params.hasOwnProperty(key) && key !== 'code') {
                            out.push(key + '=' + encodeURIComponent(params[key]));
                        }
                    }
                    let origin = ( ( document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com' ) ) ? document.location.origin : '';
                    var url = origin + "/#" + ((split && split[1]) ? split[1] : '') + out.join('&');
                    location.href = url;
                }
                fsAPI.oauthToken(params.code, function(error, tokenResponse){
    
                    // error will be set when there was a networking error (i.e. the request
                    // didn't make it to the FS API or we didn't receive the response from the
                    // API). If we did get a response then we still check the status code 
                    // to make sure the user successfully signed in.
                    if(error || tokenResponse.statusCode >= 400){
                        console.log("From oauthToken", error || tokenResponse.statusCode);
                    }

                    fsAPI.setAccessToken(tokenResponse.data.access_token);

                    // redirect to non params URL
                    var out = [];

                    for (var key in params) {
                        if (params.hasOwnProperty(key) && key !== 'code') {
                            out.push(key + '=' + encodeURIComponent(params[key]));
                        }
                    }
                    let origin = ( ( document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com' ) ) ? document.location.origin : '';
                    var url = origin + "/#" + ((split && split[1]) ? split[1] : '') + out.join('&');
                    location.href = url;

                });
            }

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
                        ).replace( 'ancestryclassroom.com', 'ancestry.com' ).replace(
                            'ancestrylibrary.proquest.com', 'ancestry.com'
                        );
                    }
                    // Clean up the Ancestry search URLs
                    if ( $rootScope.data.url && ( $rootScope.data.url.indexOf(
                            'www.ancestry.' ) > -1 || $rootScope.data.url.indexOf( 'search.ancestry.' ) > -1 ) ) {
                        var urlData = fsAPI.helpers.decodeQueryString( $rootScope.data.url );
                        var $x = urlData['dbid'] ? 'dbid' : 'db';
                        var newURL = {
                            indiv: 'try',
                            h: urlData['h'],
                        };
                        newURL[$x] = urlData[$x];

                        $rootScope.data.url = fsAPI.helpers.appendQueryParameters(
                            fsAPI.helpers.removeQueryString( $rootScope.data.url ), newURL
                        );
                    }

                    if ( $rootScope.data.url && $rootScope.data.url.indexOf( 'billiongraves.com' ) > -1 ) {
                        var $split = $rootScope.data.url.split( '/' );
                        $rootScope.data.citation = '"Billion Graves Record," BillionGraves (' + $rootScope.data.url + ' accessed ' + $rootScope.data.time + '), ' + $rootScope.data.title + ' Record #' + $split[($split.length - 1)] + '. Citing BillionGraves, Headstones, BillionGraves.com.';
                    } else if ( !$rootScope.data.citation ) {
                        var $formats = {
                            'MLA': "“{title}.” {publisher}{hasPublisher}{url}. Accessed {time}."
                        }

                        var publisher = '';
                        var has_publisher = '';
                        var title = $rootScope.data.title.split('|')[0];

                        var split_key = '';
                        if ( $rootScope.data.title.includes('|')) {
                            split_key = '|';
                        } else if ( $rootScope.data.title.includes('—')) {
                            split_key = '—';
                        }

                        if ( split_key != '' ) {
                            var title_split = $rootScope.data.title.split(split_key);
                            publisher = "<i>"+title_split[title_split.length-1]
                            title = title_split[0]
                            has_publisher = "</i>, "
                        }
                        $rootScope.data.citation = $formats[$rootScope.data.sourceFormat];
                        if ( title.includes('"') ) {
                            title = title.replace(new RegExp('"', 'g'), "'");
                        }
                        $rootScope.data.citation = $rootScope.data.citation.replace('{title}', title);
                        $rootScope.data.citation = $rootScope.data.citation.replace('{publisher}', publisher);
                        $rootScope.data.citation = $rootScope.data.citation.replace('{hasPublisher}', has_publisher);
                        $rootScope.data.citation = $rootScope.data.citation.replace('{url}', $rootScope.data.url);
                        $rootScope.data.citation = $rootScope.data.citation.replace('{time}', $rootScope.data.time);

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
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'bottom'
        });
    })
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
    )
    .factory('RequestsErrorHandler', ['$q', function($q) {
        return {
            // --- The user's API for claiming responsiblity for requests ---
            specificallyHandled: function(specificallyHandledBlock) {
                specificallyHandleInProgress = true;
                try {
                    return specificallyHandledBlock();
                } finally {

                    specificallyHandleInProgress = false;
                }
            },

            // --- Response interceptor for handling errors generically ---
            responseError: function(rejection) {
                var shouldHandle = (rejection && rejection.config && rejection.config.headers
                    && rejection.config.headers[HEADER_NAME]);
                alert("response Error")
                if (shouldHandle) {
                    alert("An error occured");
                    console.log(rejection)
                    // --- Your generic error handling goes here ---
                }

                return $q.reject(rejection);
            }
        };
    }])
    .config(['$provide', '$httpProvider', function($provide, $httpProvider) {
        $httpProvider.interceptors.push('RequestsErrorHandler');

        // --- Decorate $http to add a special header by default ---

        function addHeaderToConfig(config) {
            config = config || {};
            config.headers = config.headers || {};

            // Add the header unless user asked to handle errors himself
            if (!specificallyHandleInProgress) {
                config.headers[HEADER_NAME] = true;
            }

            return config;
        }

        // The rest here is mostly boilerplate needed to decorate $http safely
        $provide.decorator('$http', ['$delegate', function($delegate) {
            function decorateRegularCall(method) {
                return function(url, config) {
                    return $delegate[method](url, addHeaderToConfig(config));
                };
            }

            function decorateDataCall(method) {
                return function(url, data, config) {
                    return $delegate[method](url, data, addHeaderToConfig(config));
                };
            }

            function copyNotOverriddenAttributes(newHttp) {
                for (var attr in $delegate) {
                    if (!newHttp.hasOwnProperty(attr)) {
                        if (typeof($delegate[attr]) === 'function') {
                            newHttp[attr] = function() {
                                return $delegate[attr].apply($delegate, arguments);
                            };
                        } else {
                            newHttp[attr] = $delegate[attr];
                        }
                    }
                }
            }

            var newHttp = function(config) {
                return $delegate(addHeaderToConfig(config));
            };

            newHttp.get = decorateRegularCall('get');
            newHttp.delete = decorateRegularCall('delete');
            newHttp.head = decorateRegularCall('head');
            newHttp.jsonp = decorateRegularCall('jsonp');
            newHttp.post = decorateDataCall('post');
            newHttp.put = decorateDataCall('put');

            copyNotOverriddenAttributes(newHttp);

            return newHttp;
        }]);
    }]);;
