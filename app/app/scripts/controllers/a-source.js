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

            $scope.goNext = function() {
                if ( $rootScope.debug ) {
                    $cookie.remove( 'recordseek' );
                }
                var $url = 'https://www.ancestry.com/savetoancestry/';

                var $aObj = {
                    "citationTitle": $rootScope.data.citation,
                    "citationUrl": $rootScope.data.url,
                    "mediaNote": $rootScope.data.notes,
                    "mediaUrl": 'https://recordseek.com/assets/images/ancestry.jpg',
                    "repositoryDomain": $rootScope.data.domain,
                    "sourcePublishedDate": "",
                    "sourcePublishedLocation": "",
                    "sourcePublisherName": $rootScope.data.domain,
                    "sourceTitle": $rootScope.data.title
                }

                function htmlToPlaintext(text) {
                    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
                }

                $rootScope.data.title = String($rootScope.data.title).replace(/<[^>]+>/gm, '');

                // var $aObj = {
                //     'citation': {
                //         'title': $rootScope.data.citation,
                //         'url': $rootScope.data.url
                //     },
                //     'source': {
                //         'title': $rootScope.data.title,
                //         'publisherName': $rootScope.data.domain,
                //         // 'publishedDate': '',
                //         // 'publishedLocation': ''
                //     },
                //     'repositoryDomain': $rootScope.data.domain,
                //     'media': {
                //         'url': 'https://recordseek.com/assets/images/ancestry.jpg',
                //         'note': $rootScope.data.notes
                //     }
                // };

                // $url += encodeURIComponent( JSON.stringify( $aObj ) );

                $rootScope.track( {eventCategory: 'Ancestry', eventAction: 'Source', eventLabel: $url} );

                // $http.post($url, $aObj).then(function(resp) {
                //     console.log(resp);
                // });

                $("form").get(0).setAttribute( "action", $url );

                // $http({
                //     method  : 'POST',
                //     url     : $url,
                //     data    : $.param($aObj),  // pass in data as strings
                //     // headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                // }).then(function(response){
                //     //successfully posted data
                //     $location.path('/');
                // }, function(response){
                //     //error has occurred
                // })

                // $window.location.href = $url;
            };

            $scope.goBack = function() {
                $rootScope.service = '';
                $cookie.remove( 'recordseek-last-service' );
                $location.path( '/' );
            };
        }]
    );
