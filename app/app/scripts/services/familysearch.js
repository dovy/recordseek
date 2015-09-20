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

        //        this.environment = 'sandbox'; // production, sandbox, staging

        if ( document.location.origin === 'http://recordseek.com' || document.location.origin === 'https://recordseek.com' ) {
            this.environment = 'production';
        } else {
            this.environment = 'sandbox';
        }

        //if ( document.location.origin === 'http://recordseek.com' || document.location.origin === 'https://recordseek.com' ) {
        //    this.environment = 'production';
        //} else if ( document.location.origin === 'http://localhost:9000' || document.location.origin === 'http://localhost:9001' ) {
        //    this.environment = 'sandbox';
        //} else {
        //    this.environment = 'beta';
        //}

        //if ( document.location.origin === 'http://recordseeknew.dev' || document.location.origin === 'https://recordseeknew.dev' ) {
        //this.environment = 'production';
        //}

        if ( this.environment === 'sandbox' ) {
            this.client_id = 'a0T3000000ByxnUEAR';
        } else {
            this.client_id = 'S1M9-QH77-ZGJK-2HB1-MYZZ-6YN9-SBNQ-6YPS';
        }

        this.redirect_uri = document.location.origin;

        if ( document.location.origin !== 'http://localhost:9000' && document.location.origin !== 'http://localhost:9001' ) {
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
                                var url = FS.helpers.removeQueryString( document.URL );

                                if ( $rootScope.data.sourceDescription && $rootScope.data.sourceDescription.id != '' ) {
                                    $rootScope.personData.sourceDescription = {
                                        id: $rootScope.data.sourceDescription.id
                                    }
                                }

                                $rootScope.setCookie( 'recordseek-auth', angular.toJson( $rootScope.data ) );
                                url = FS.helpers.appendQueryParameters( url, {r: 1, '_': $rootScope.data['_']} );
                                $rootScope.log( url );


                                FS.getOAuth2AuthorizeURL(
                                    url
                                ).then(
                                    function( url ) {
                                        window.location = url;
                                    }
                                );
                            }
                        }
                    }
                );

                $rootScope.sourceBoxURL = this.client.settings.apiServer[this.client.settings.environment] + '/links-gadget/linkpage.jsp?referrer=/#sbp';
                $rootScope.treeViewURL = this.client.settings.apiServer[this.client.settings.environment] + '/tree/#view=tree&section=pedigree';

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