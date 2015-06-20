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
    ['fsAPI', '$rootScope', '$scope', '$location', 'fsUtils', function( fsAPI, $rootScope, $scope, $location, fsUtils ) {
        $rootScope.service = 'FamilySearch';
        fsAPI.getCurrentUser().then(
            function( response ) {
                $rootScope.fsUser = response.getUser();
            }
        );

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

            fsAPI.createSourceRef(
                {
                    $personId: $rootScope.data.attach.pid,
                    $sourceDescription: $rootScope.data.sourceDescription,
                    //$tags: ['http://gedcomx.org/Name', 'http://gedcomx.org/Birth']
                }
            ).$save( $rootScope.data.attach.justification ).then(
                function( sourceRefId ) {
                    $rootScope.track(
                        {
                            eventCategory: 'FamilySearch',
                            eventAction: 'Source Attached',
                            eventLabel: sourceRefId
                        }
                    );
                    $rootScope.data.complete = $rootScope.data.attach;
                    $rootScope.data.complete.sourceRef = sourceRefId;
                    delete $rootScope.data.attach;
                    $location.path( '/fs-complete' );
                }
            );
        }

        if ( !$rootScope.data.sourceDescription && $rootScope.data.url ) {
            $scope.status = 'Generating Source';
            $rootScope.log(
                fsUtils.removeEmptyProperties(
                    {
                        about: $rootScope.data.url.trim() ? $rootScope.data.url.trim() : '',
                        citation: $rootScope.data.citation.trim() ? $rootScope.data.citation.trim() : '',
                        title: $rootScope.data.title.trim() ? $rootScope.data.title.trim() : '',
                        text: $rootScope.data.notes.trim() ? $rootScope.data.notes.trim() : ''
                    }
                )
            );
            fsAPI.createSourceDescription(
                fsUtils.removeEmptyProperties(
                    {
                        about: $rootScope.data.url.trim() ? $rootScope.data.url.trim() : '',
                        $citation: $rootScope.data.citation.trim() ? $rootScope.data.citation.trim() : '',
                        $title: $rootScope.data.title.trim() ? $rootScope.data.title.trim() : '',
                        $text: $rootScope.data.notes.trim() ? $rootScope.data.notes.trim() : ''
                    }
                )
            ).$save( $rootScope.attachMsg ).then(
                function( sourceDescriptionId ) {
                    $rootScope.data.sourceDescription = sourceDescriptionId;
                    $rootScope.track(
                        {
                            eventCategory: 'FamilySearch',
                            eventAction: 'Source Created',
                            eventLabel: $rootScope.data.sourceDescription.id
                        }
                    );
                    attachSource();
                }
            );
        } else {
            $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Source Attached to Another'} );
            // Already a source description
            attachSource();
        }
    }]
);
