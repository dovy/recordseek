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
            var $url = 'http://trees.ancestry.com/savetoancestry?o_sch=Web+Property';
            if ( $rootScope.data.url ) {
                $url += '&url=' + encodeURIComponent( $rootScope.data.url );
            }
            if ( $rootScope.data.domain ) {
                $url += '&domain=' + encodeURIComponent( $rootScope.data.domain );
            }
            if ( $rootScope.data.title ) {
                $url += '&collection=' + encodeURIComponent( $rootScope.data.title );
            }
            if ( $rootScope.data.citation ) {
                $url += '&details=' + encodeURIComponent( $rootScope.data.citation );
            }
            $rootScope.track( {eventCategory: 'Ancestry', eventAction: 'Source', eventLabel: $url} );

            $window.location.href = $url;
        };

        $scope.goBack = function() {
            $rootScope.service = '';
            $location.path( '/' );
        };
    }]
);
