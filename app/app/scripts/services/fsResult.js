'use strict';

/**
 * @ngdoc service
 * @name recordseekApp.fsResult
 * @description
 * # get the response object and parse it to provide the utility methods for easy access
 * Factory in the recordseekApp.
 */
angular.module( 'recordseekApp' )
    .factory(
    'fsResult', function( _, $q, $rootScope ) {
        var data = null;
        var primaryPerson = null;
        var service = {};

        service.setData = function(response) {
            data = _.cloneDeep(response);
        }
        service.getPrimaryPerson = function () {
            let persons = this.getPersons(data);
            if (!persons) return null;
            for (let person of persons) {
                if (person.id === data.id) {
                    primaryPerson = {
                        'pid': person.id,
                        'name': person.display.name,
                        'birthDate': person.birthDate || '',
                        'gender': person.display.gender,
                        'url': this.redirectURL( person.id ),
                        'birthPlace': person.birthPlace || '',
                        'deathDate': person.deathDate || '',
                        'deathPlace': person.deathPlace || ''
                    };

                    return primaryPerson;
                }
            }
            return null;
        }

        service.getPersons = function() {
            return maybe(maybe(data.content).gedcomx).persons;
        }
        
        service.redirectURL = function($ID) {
            return $rootScope.fsURL.replace("api.", "www.") + '/tree/person/details/' + $ID;
        }

        /* Parent Helpers */
        service.getFathers = function() {
            let persons = this.getPersons();
            let parentIDs = this.getParentRelationshipIDs();
            return _.filter(persons, (person) => parentIDs.includes(person.id) && person.gender.type.includes("Female") === false);
        }

        service.getMothers = function() {
            let persons = this.getPersons();
            let parentIDs = this.getParentRelationshipIDs();
            return _.filter(persons, (person) => parentIDs.includes(person.id) && person.gender.type.includes("Female"));
        }

        service.getParentRelationshipIDs = function() {
            let parentRelationships = _.filter(data.content.gedcomx.relationships, (relationship) => relationship.type.includes("ParentChild") && relationship.person2.resourceId === primaryPerson.pid);
            return _.map(parentRelationships, 'person1.resourceId');
        }


        /* Spouse Helpers */
        service.getSpouses = function() {
            let persons = this.getPersons();
            let spouseIDs = this.getSpouseRelationshipIDs();
            return _.filter(persons, (person) => spouseIDs.includes(person.id));
        }

        service.getSpouseRelationshipIDs = function() {
            let spouseRelationships = _.filter(data.content.gedcomx.relationships, (relationship) => relationship.type.includes("Couple") && relationship.person2.resourceId === primaryPerson.pid);
            return _.map(spouseRelationships, 'person1.resourceId');
        }


        /* Children Helpers */
        service.getChildren = function() {
            let persons = this.getPersons();
            let childrenIDs = this.getChildrenRelationshipIDs();
            return _.filter(persons, (person) => childrenIDs.includes(person.id));
        }

        service.getChildrenRelationshipIDs = function() {
            let childrenRelationships = _.filter(data.content.gedcomx.relationships, (relationship) => relationship.type.includes("ParentChild") && relationship.person1.resourceId === primaryPerson.pid);
            return _.map(childrenRelationships, 'person2.resourceId');
        }
        return service;
    }
);