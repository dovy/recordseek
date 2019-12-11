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

            if ( !$rootScope.data.attach && $rootScope.data.complete != 'noAttachment' ) {
                $location.path( '/fs-search' );
            }

            fsAPI.displayUser( $scope );

            function createPerson() {
                $scope.status = 'Creating Person Profile for ' + $rootScope.data.search.givenName1 + ' ' + $rootScope.data.search.surname1;
                // $scope.$apply();
                $rootScope.safeApply();
                var person = fsAPI.createPerson();

                if ( $rootScope.toCreate.names ) {
                    angular.forEach(
                        $rootScope.toCreate.names, function( value, key ) {
                            person.$addName( value );
                        }
                    );
                }

                if ( $rootScope.toCreate.events ) {
                    angular.forEach(
                        $rootScope.toCreate.events, function( value, key ) {
                            person.$addFact( value );
                        }
                    );
                }
                if ( $rootScope.toCreate.gender ) {
                    person.$setGender( $rootScope.toCreate.gender );
                }
                person.$save( $rootScope.attachMsg, true ).then(
                    function( response ) {
                        if ( !$rootScope.data.attach ) {
                            $rootScope.data.attach = {};
                        }
                        $rootScope.data.attach.pid = response;
                        $rootScope.data.attach.name = person.$getDisplayName();
                        $rootScope.data.attach.url = person.identifiers["http://gedcomx.org/Persistent"][0];
                        delete $rootScope.toCreate;
                        attachSource();
                    }
                );
            }

            function createSource() {
                // Check if the source has been created, or create it.
                if ( !$rootScope.data.sourceDescription && $rootScope.data.url ) {
                    $scope.status = 'Generating Source';

                    let draftSourceDescription = fsUtils.removeEmptyProperties(
                    {
                        about: $rootScope.data.url.trim() ? $rootScope.data.url.trim() : 'SOMEOTHER-ABOUT',
                        citation: $rootScope.data.citation.trim() ? $rootScope.data.citation.trim() : 'SOMEOTHER-citation',
                        title: $rootScope.data.title.trim() ? $rootScope.data.title.trim() : 'SOMEOTHER-title',
                        text: $rootScope.data.notes.trim() ? $rootScope.data.notes.trim() : 'SOMEOTHER-text',
                        changeMessage: $rootScope.attachMsg.trim() ? $rootScope.attachMsg.trim() : 'CHANGED-message'
                    });

                    fsAPI.createSourceDescription(draftSourceDescription).then(
                        function( response ) {
                            $rootScope.track(
                                {
                                    eventCategory: 'FamilySearch',
                                    eventAction: 'Source Created',
                                    eventLabel: response.headers['x-entity-id']
                                }
                            );
                            $rootScope.data.sourceDescription = draftSourceDescription;
                            $rootScope.data.sourceDescription.id = response.headers['x-entity-id'];
                            sourceFolder();
                        }
                    );
                } else {
                    $rootScope.track( {eventCategory: 'FamilySearch', eventAction: 'Source Attached to Another'} );
                    // Already a source description
                    sourceFolder();
                }
            }


            function sourceFolder() {
                console.log($rootScope.data.sourcebox);
                if ( !$rootScope.data.sourcebox || $rootScope.data.sourcebox == "" ) {
                    attachSource();
                    return;
                }

                $scope.status = 'Moving Source to Collection';
                $rootScope.safeApply();
                if ( $rootScope.data.sourcebox == "CREATE" ) {
                    fsAPI.createCollection(
                        {'title': 'RecordSeek'}
                    ).then(function(response) {
                        console.log(response);
                        $rootScope.data.sourcebox = $rootScope.sourcebox['RecordSeek'] = $rootScope.data.sourceboxfolder.getCollectionUrl();
                        fsAPI.moveSourceDescriptionsToCollection(
                            $rootScope.data.sourcebox + '/descriptions', [$rootScope.data.sourceDescriptionID]
                        ).then(
                            function( response ) {
                                attachSource();
                            }
                        );
                    });
                } else {
                    fsAPI.moveSourceDescriptionsToCollection(
                        $rootScope.data.sourcebox + '/descriptions', [$rootScope.data.sourceDescriptionID]
                    ).then(
                        function( response ) {
                            attachSource();
                        }
                    );
                }


            }


            function attachSource() {

                // We're just saving the source
                if ( !$rootScope.data.attach ) {
                    $location.path( '/fs-complete' );
                    return $rootScope.safeApply();
                }

                // Let's create a person
                if ( $rootScope.toCreate ) {
                    createPerson();
                    return;
                }

                if ( $rootScope.data.sourceDescription ) {
                    if ( $rootScope.data.complete == 'noAttachment' ) {
                        delete $rootScope.data.attach;
                        $location.path( '/fs-complete' );
                        return $rootScope.safeApply();

                    }
                }
                delete $rootScope.data.complete;

                $rootScope.data.attach.name = ( $rootScope.data.attach.name ) ? $rootScope.data.attach.name : 'this Profile';
                $scope.status = 'Attaching Source to ' + $rootScope.data.attach.name;
                $rootScope.safeApply();

                let attribution = { "changeMessage": $rootScope.data.attach.justification ? $rootScope.data.attach.justification : "Attached by RecordSeek" };
                var $tags = [];
                angular.forEach($rootScope.data.tags, function(value, key) {
                    if ( value === true ) {
                        this.push('http://gedcomx.org/' + key.charAt( 0 ).toUpperCase() + key.slice( 1 ));
                    }
                }, $tags);

                fsAPI.createPersonSourceRef($rootScope.data.attach.pid, attribution, $rootScope.data.sourceDescription.id, $tags).then(
                    function( response ) {
                        console.log(response);
                        let id = response.headers['x-entity-id'];
                        $rootScope.track(
                            {
                                eventCategory: 'FamilySearch',
                                eventAction: 'Source Attached',
                                eventLabel: id
                            }
                        );
                        $rootScope.data.complete = $rootScope.data.attach;
                        $rootScope.data.complete.sourceRef = id;
                        delete $rootScope.data.attach;
                        $location.path( '/fs-complete' );
                        $rootScope.safeApply();
                    }
                );

                return;
/* 
                var srcRef = fsAPI.createSourceRef(
                    {
                        sourceDescription: $rootScope.data.sourceDescription.getSourceDescriptionUrl()
                    }
                )
                    .setTags( tags );
                srcRef.save(
                    'https://familysearch.org/platform/tree/persons/' + $rootScope.data.attach.pid + '/source-references',
                    $rootScope.data.attach.justification
                )
                    .then(
                        function( response ) {
                            $rootScope.track(
                                {
                                    eventCategory: 'FamilySearch',
                                    eventAction: 'Source Attached',
                                    eventLabel: srcRef.getId()
                                }
                            );
                            $rootScope.data.complete = $rootScope.data.attach;
                            $rootScope.data.complete.sourceRef = srcRef.getId();
                            delete $rootScope.data.attach;
                            $location.path( '/fs-complete' );
                            $rootScope.safeApply();
                        }
                    );
                    */
            }

            createSource();


        }]
    );
