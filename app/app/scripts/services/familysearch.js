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
    'fsAPI', ['_', function( _ ) {
        /* jshint camelcase:false */

        this.environment = 'sandbox'; // production, sandbox, staging

        if ( document.location.origin === 'http://recordseek.com' ) {
            this.environment = 'production';
        } else if ( document.location.origin !== 'http://localhost:9000' ) {
            this.environment = 'sandbox';
        } else {
            this.environment = 'beta';
        }

        if ( document.location.origin === 'http://recordseeknew.dev' || document.location.origin === 'https://recordseeknew.dev' ) {
            //this.environment = 'production';
        }

        if ( this.environment === 'sandbox' ) {
            this.client_id = 'a0T3000000ByxnUEAR';
        } else {
            this.client_id = 'S1M9-QH77-ZGJK-2HB1-MYZZ-6YN9-SBNQ-6YPS';
        }

        this.redirect_uri = document.location.origin;

        if ( document.location.origin !== 'http://localhost:9000' ) {
            this.redirect_uri += '/share/';
        }



        this.$get = function( $window, $http, $q, $timeout, $rootScope, $injector, $location ) {
            if ( this.client_id && this.environment && this.redirect_uri ) {
                this.getEnvironment = function() {
                    return this.environment;
                }

                $http.defaults.useXDomain = true;
                delete $http.defaults.headers.common['X-Requested-With'];

                /* globals FamilySearch */
                this.client = new FamilySearch(
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
                this.urlParams = this.client.helpers.decodeQueryString( document.URL );
                // Check if we have a code and do what we should accordingly
                if ( this.urlParams.code && this.urlParams.state ) {
                    $rootScope.status = 'Authenticating, please wait.';
                    $location.path( '/loading' );
                    var redirect = this.urlParams.state.split( '#' );
                    redirect = redirect[0] += '#/fs-source';
                    this.client.getAccessToken( this.urlParams.code ).then(
                        function() {
                            window.location = redirect;
                        }
                    );
                }
            }
            return this.client;
        };
    }]
);