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

        function createPerson() {
            $scope.status = 'Creating Person Profile for ' + $rootScope.data.search.givenName1+ ' '+$rootScope.data.search.surname1;

            var person = fsAPI.createPerson();

            if ($rootScope.toCreate.names) {
                angular.forEach($rootScope.toCreate.names, function(value, key) {
                    person.$addName(value);
                });
            }

            if ($rootScope.toCreate.events) {
                angular.forEach($rootScope.toCreate.events, function(value, key) {
                    person.$addFact(value);
                });
            }
            if ($rootScope.toCreate.gender) {
                person.$setGender($rootScope.toCreate.gender);
            }
            person.$save($rootScope.attachMsg, true).then(function(response) {
                if (!$rootScope.data.attach) {
                    $rootScope.data.attach = {};
                }
                $rootScope.data.attach.pid = response;
                $rootScope.data.attach.name = person.$getDisplayName();
                $rootScope.data.attach.url = person.identifiers["http://gedcomx.org/Persistent"][0];
                delete $rootScope.toCreate;
                attachSource();
            });
        }

        function attachSource() {
            if ($rootScope.toCreate) {
                createPerson();
                return;
            }

            if ( $rootScope.data.sourceDescription ) {
                if ( !$rootScope.data.attach ) {
                    $rootScope.data.complete = 'noAttachment';
                    delete $rootScope.data.attach;
                    $location.path( '/fs-complete' );
                }
            }
            delete $rootScope.data.complete;

            $scope.status = 'Attaching Source to ' + $rootScope.data.attach.name;
            var tags = [];
            angular.forEach(
                $rootScope.data.tags, function( value, key ) {
                    if ( value === true ) {
                        this.push( 'http://gedcomx.org/' + key );
                    }
                }, tags
            );
            fsAPI.createSourceRef(
                {
                    $personId: $rootScope.data.attach.pid,
                    $sourceDescription: $rootScope.data.sourceDescription,
                    $tags: tags
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
                            eventLabel: sourceDescriptionId
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
