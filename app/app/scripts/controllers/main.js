'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'MainCtrl', function( $scope, $rootScope ) {
        $rootScope.service = '';
    }
);

// at the bottom of your controller
var init = function () {
    var width = 800;
    var height = 675;
    window.resizeTo(width, height);
    window.moveTo(((screen.width - width)), ((screen.height - height) / 2));
};
init();