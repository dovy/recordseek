'use strict';

/**
 * @ngdoc function
 * @name recordseekApp.controller:FsCreateCtrl
 * @description
 * # FsCreateCtrl
 * Controller of the recordseekApp
 */
angular.module( 'recordseekApp' )
    .controller(
    'FsCreateCtrl',
    ['fsAPI', 'fsUtils', '$rootScope', '$scope', '$location', function( fsAPI, fsUtils, $rootScope, $scope, $location ) {
        /* global ga */
        $rootScope.service = 'FamilySearch';
        fsAPI.getAccessToken();


        //
        //
        //if (!$rootScope.data.sourceDescription) {
        //    $scope.status = "Generating Source";
        //    var sourceDescription = new fsAPI.SourceDescription(
        //        fsUtils.removeEmptyProperties(
        //            {
        //                about: $rootScope.data.url ? $rootScope.data.url.trim() : '',
        //                citation: $rootScope.data.citation ? $rootScope.data.citation.trim() : '',
        //                title: $rootScope.data.title ? $rootScope.data.title.trim() : '',
        //                text: $rootScope.data.notes ? $rootScope.data.notes.trim() : ''
        //            }
        //        )
        //    );
        //    sourceDescription.$save( null, true ).then(
        //        function() {
        //            $rootScope.data.sourceDescription = sourceDescription;
        //            attachSource();
        //        }
        //    );
        //} else {
        //    if ($rootScope.data.complete.pid == $rootScope.data.attach.pid && $rootScope.data.sourceRefID) {
        //        delete $rootScope.data.attach;
        //        $location.path( '/fs-complete' );
        //    }
        //
        //    attachSource();
        //}


        function attachSource() {
            if ( $rootScope.data.sourceDescription ) {
                if ( !$rootScope.data.attach ) {
                    $rootScope.data.complete = 'noAttachment';
                    delete $rootScope.data.attach;
                    $location.path( '/fs-complete' );
                }
            }
            delete $rootScope.data.complete;


            $scope.status = 'Attaching Source to ' + $rootScope.data.attach.name;

            var sourceRef = new fsAPI.SourceRef(
                {
                    $personId: $rootScope.data.attach.pid,
                    sourceDescription: $rootScope.data.sourceDescription.id
                }
            );
            // Source tags
            //sourceRef.$addTag('Birth');

            return sourceRef.$save( $rootScope.data.attach.justification.trim() ).then(
                function( sourceRefId ) {
                    sourceRef.id = sourceRefId;
                    //sourceRef.$setTags(['birth', 'death']);
                    //sourceRef.$save();
                    ga(
                        'send', 'event',
                        {eventCategory: 'FamilySearch', eventAction: 'Source Attached', eventLabel: sourceRefId}
                    );
                    $rootScope.data.complete = $rootScope.data.attach;
                    $rootScope.data.complete.sourceRef = sourceRef;
                    delete $rootScope.data.attach;
                    $location.path( '/fs-complete' );
                }
            );

        }

        if ( !$rootScope.data.sourceDescription && $rootScope.data.url ) {
            $scope.status = 'Generating Source';
            var sourceDescription = new fsAPI.SourceDescription(
                fsUtils.removeEmptyProperties(
                    {
                        about: $rootScope.data.url.trim() ? $rootScope.data.url.trim() : '',
                        citation: $rootScope.data.citation.trim() ? $rootScope.data.citation.trim() : '',
                        title: $rootScope.data.title.trim() ? $rootScope.data.title.trim() : '',
                        text: $rootScope.data.notes.trim() ? $rootScope.data.notes.trim() : ''
                    }
                )
            );

            sourceDescription.$save( null, true ).then(
                function() {
                    $rootScope.data.sourceDescription = sourceDescription;
                    ga(
                        'send', 'event', {
                            eventCategory: 'FamilySearch',
                            eventAction: 'Source Created',
                            eventLabel: $rootScope.data.sourceDescription.id
                        }
                    );
                    attachSource();
                }
            );
        } else {
            ga( 'send', 'event', {eventCategory: 'FamilySearch', eventAction: 'Source Attached to Another'} );
            // Already a source description
            attachSource();
        }
    }]
);
