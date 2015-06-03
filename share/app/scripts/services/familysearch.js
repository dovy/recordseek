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
    'fsAPI', function() {
        /* jshint camelcase:false */
        var client_id = 'WCQY-7J1Q-GKVV-7DNM-SQ5M-9Q5H-JX3H-CMJK';
        var environment = 'beta';
        var redirect_uri = 'http://localhost:9000/#!/auth';
        this.authToken = "";

        this.setClientId = function( appKey ) {
            client_id = appKey;
            return this;
        };

        this.setEnvironmentName = function( environmentName ) {
            environment = environmentName;
            return this;
        };

        this.setRedirectUri = function( authCallback ) {
            redirect_uri = authCallback;
            return this;
        };

        this.$get = function( $window, $http, $q, $timeout, $rootScope ) {
            if ( client_id && environment && redirect_uri ) {
                $window.FamilySearch.init(
                    {
                        client_id: client_id,
                        environment: environment,
                        redirect_uri: redirect_uri,
                        http_function: $http,
                        deferred_function: $q.defer,
                        timeout_function: $timeout,
                        save_access_token: true,
                        auto_expire: true,
                        auto_signin: false,
                        expire_callback: function() {
                            $rootScope.$emit( 'sessionExpired' );
                        }
                    }
                );
            }

            $window.FamilySearch.Person.prototype._isMale = function() {
                return this.gender && this.gender.type === 'http://gedcomx.org/Male';
            };

            return $window.FamilySearch;
        };

    }
);


    angular.module('recordseekApp')
        .directive('fsReAuthenticate', function($rootScope, fsReAuthenticateModal) {
            return {
                template: '<div></div>',
                link: function(scope) {
                    var unbind = $rootScope.$on('sessionExpired', function() {
                        fsReAuthenticateModal.open();
                    });

                    scope.$on('$destroy', unbind);
                }
            };
        });


    angular.module('recordseekApp')
        .directive('fsReAuthenticate', function($rootScope, fsReAuthenticateModal) {
            return {
                template: '<div></div>',
                link: function(scope) {
                    var unbind = $rootScope.$on('sessionExpired', function() {
                        fsReAuthenticateModal.open();
                    });

                    scope.$on('$destroy', unbind);
                }
            };
        });
angular.module('recordseekApp')
    .factory('fsReAuthenticateModal', function($modal, $rootScope, fsApi) {
        return {
            open: function() {
                return $modal.open({
                    templateUrl: 'views/fsReAuthenticateModal.html',
                    size: 'sm',
                    controller: function($scope) {
                        $scope.signin = function() {
                            $scope.$close();
                            fsApi.getAccessToken().then(function() {
                                $rootScope.$emit('newSession');
                            });
                        };
                    }
                }).result;
            }
        };
    });