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
        ['$rootScope', '$location', '$scope', '$window', '$cookies', '$http', function( $rootScope, $location, $scope, $window, $cookie, $http ) {
            $rootScope.service = 'Ancestry';

            $scope.clearMediaURL = function() {
                $rootScope.data.media_url = "";
            }

            // Shim to fix Ancestry URLs
            if ($rootScope.data.media_url === undefined) {
              $rootScope.data.media_url = 'https://recordseek.com/assets/images/ancestry.jpg';
            }

            $scope.goNext = function() {
                if ( $rootScope.debug ) {
                    $cookie.remove( 'recordseek' );
                }
                var $url = 'https://www.ancestry.com/savetoancestry/';

                var $aObj = {
                    "citationTitle": $rootScope.data.citation,
                    "citationUrl": $rootScope.data.url,
                    "mediaNote": $rootScope.data.notes,
                    "mediaUrl": $rootScope.data.media_url,
                    "repositoryDomain": $rootScope.data.domain,
                    "sourcePublishedDate": "",
                    "sourcePublishedLocation": "",
                    "sourcePublisherName": $rootScope.data.domain,
                    "sourceTitle": $rootScope.data.title
                };

                function htmlToPlaintext(text) {
                    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
                }

                $rootScope.data.title = String($rootScope.data.title).replace(/<[^>]+>/gm, '');

                $rootScope.track( {eventCategory: 'Ancestry', eventAction: 'Source', eventLabel: $url} );

                // $("form").get(0).setAttribute( "action", $url );
                return false;

            };

            $scope.sourceFormats = $rootScope.sourceFormats;
            $scope.sourceFormat = $rootScope.data.sourceFormat;
            $scope.changeFormat= function() {
              $rootScope.setCitationFormat($scope.sourceFormat);
            };

            $scope.goBack = function() {
                $rootScope.service = '';
                $cookie.remove( 'recordseek-last-service' );
                $location.path( '/' );
            };
        }]
    );
