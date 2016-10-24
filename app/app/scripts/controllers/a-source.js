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
                        "title": encodeURIComponent( $rootScope.data.citation ),
                        "url": encodeURIComponent( $rootScope.data.url )
                    },
                    "source": {
                        "title": encodeURIComponent( $rootScope.data.title ),
                        "publisherName": "http://recordseek.com",
                        "publishedDate": "",
                        "publishedLocation": ""
                    },
                    "repositoryDomain": encodeURIComponent( $rootScope.data.domain ),
                    "media": {
                        "url": "",
                        "note": encodeURIComponent( $rootScope.data.notes )
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
