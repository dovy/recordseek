'use strict';

/**
 * @ngdoc service
 * @name recordseekApp.fsCurrentUserCache
 * @description
 * # fsCurrentUserCache
 * Factory in the recordseekApp.
 */
angular.module( 'recordseekApp' )
    .factory(
    'fsCurrentUserCache', function( $q, $rootScope, fsAPI ) {
        var currentUser = null;

        $rootScope.$on(
            'newSession', function() {
                currentUser = null;
            }
        );

        return {
            getUser: function() {
                if ( !!currentUser ) {
                    return $q.when( currentUser );
                }
                else {
                    return fsAPI.getCurrentUser().then(
                        function( response ) {
                            currentUser = response.getUser();
                            return currentUser;
                        }
                    );
                }
            }
        };
    }
);
