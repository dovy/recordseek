'use strict';

/**
 * @ngdoc service
 * @name recordseekApp.FamilySearch
 * @description
 * # FamilySearch
 * Provider in the recordseekApp.
 */
angular.module( 'recordseekApp' )
    .provider(
    'fsAPI', ['_', function() {
        /* jshint camelcase:false */
        /* global _ */

        this.environment = 'sandbox'; // production, sandbox, staging
alert(document.location.origin);
        if ( document.location.origin !== 'http://localhost:9000' ) {
            this.environment = 'production';
        }
        if ( document.location.origin === 'http://recordseeknew.dev' || document.location.origin === 'https://recordseeknew.dev' ) {
            //this.environment = 'production';
        }

        if ( this.environment === 'sandbox' ) {
            this.client_id = 'a0T3000000ByxnUEAR';
        } else {
            this.client_id = 'S1M9-QH77-ZGJK-2HB1-MYZZ-6YN9-SBNQ-6YPS';
        }

        //this.redirect_uri = document.location.protocol + '//recordseek.com/share/';
        this.redirect_uri = document.location.origin;

        if ( document.location.origin !== 'http://localhost:9000' ) {
            this.redirect_uri += '/share/';
        }


        this.$get = function( $window, $http, $q, $timeout, $rootScope, $injector, $location ) {

            if ( this.client_id && this.environment && this.redirect_uri ) {
                /* globals FamilySearch */
                this.FamilySearch = new FamilySearch(
                    {
                        client_id: this.client_id,
                        environment: this.environment,
                        redirect_uri: this.redirect_uri,
                        http_function: $http,
                        deferred_function: $q.defer,
                        save_access_token: true,
                        auto_expire: true,
                        timeout_function: $timeout,
                        expire_callback: function( FS ) {
                            var urlParams = FS.helpers.decodeQueryString( document.URL );
                            // Don't redirect if we already have a code!
                            if ( !urlParams || ( urlParams && !urlParams.code && !urlParams.state ) ) {
                                FS.getOAuth2AuthorizeURL(
                                    window.location.href
                                ).then(
                                    function( url ) {
                                        window.location = url;
                                    }
                                );
                            }
                        }
                    }
                );

                //$rootScope.loading = function() {
                //
                //    var modalInstance = $modal.open(
                //        {
                //            animation: $scope.animationsEnabled,
                //            templateUrl: 'myModalContent.html',
                //            controller: 'ModalInstanceCtrl',
                //            size: 'sm',
                //            resolve: {
                //                items: function() {
                //                    return $scope.items;
                //                }
                //            }
                //        }
                //    );
                //
                //    modalInstance.result.then(
                //        function( selectedItem ) {
                //            $scope.selected = selectedItem;
                //        }, function() {
                //            $log.info( 'Modal dismissed at: ' + new Date() );
                //        }
                //    );
                //};

                this.urlParams = this.FamilySearch.helpers.decodeQueryString( document.URL );
                // Check if we have a code and do what we should accordingly
                if ( this.urlParams.code && this.urlParams.state ) {
                    $rootScope.status = 'Authenticating, please wait.';
                    $location.path( '/loading' );
                    var redirect = this.urlParams.state.split( '#' );
                    redirect = redirect[0] += '#/fs-source';
                    this.FamilySearch.getAccessToken( this.urlParams.code ).then(
                        function() {
                            window.location = redirect;
                        }
                    );
                }
            }


            return this.FamilySearch;
        };

    }]
);