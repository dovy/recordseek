'use strict';

/**
 * @ngdoc directive
 * @name recordseekApp.directive:resize
 * @description
 * # resize
 */
angular.module( 'recordseekApp' )
    .directive(
    'resize', function( $window ) {
        return function( scope ) {
            var w = angular.element( $window );
            scope.$watch(
                function() {
                    return {'h': w.height(), 'w': w.width()};
                }, function( newValue ) {
                    scope.windowHeight = newValue.h;
                    scope.windowWidth = newValue.w;

                    scope.style = function() {
                        return {
                            'height': (newValue.h - 100) + 'px',
                            'width': (newValue.w - 100) + 'px'
                        };
                    };

                }, true
            );

            w.bind(
                'resize', function() {
                    scope.$apply();
                }
            );
        };
    }
);