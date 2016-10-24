'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:ASourceCtrl
 * @description
 * # ASourceCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
        'ASourceCtrl',
        ['$rootScope', '$location', '$scope', '$window', '$cookies', function( $rootScope, $location, $scope, $window, $cookie ) {
            $rootScope.service = 'Ancestry';

            $scope.goNext = function() {
                if ( $rootScope.debug ) {
                    $cookie.remove( 'recordseek' );
                }
                var $url = 'https://www.ancestry.com/savetoancestry/?postData=';

                $url += JSON.stringify( {
                    "citation": {
                        "title": $rootScope.data.citation,
                        "url": $rootScope.data.url
                    },
                    "source": {
                        "title": $rootScope.data.title,
                        "publisherName": "http://recordseek.com",
                        "publishedDate": "",
                        "publishedLocation": ""
                    },
                    "repositoryDomain": $rootScope.data.domain,
                    "media": {
                        "url": "",
                        "note": $rootScope.data.notes
                    }
                } );

                $rootScope.track( {eventCategory: 'Ancestry', eventAction: 'Source', eventLabel: $url} );

                $window.location.href = $url;
            };

            $scope.goBack = function() {
                $rootScope.service = '';
                $cookie.remove( 'recordseek-last-service' );
                $location.path( '/' );
            };
        }]
    );
