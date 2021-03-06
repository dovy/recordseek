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
        var id = null;
        var primaryPerson = null;
        var service = {};

        service.setData = function(personID, input) {
            id = personID;
            data = _.cloneDeep(input);
        }
        service.getPrimaryPerson = function () {
            var persons = this.getPersons(data);
            if (!persons) return null;

            for (var idx in persons) {
                var person = persons[idx];
                if (person.id === id) {
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
            return data.persons;
        }
        
        service.redirectURL = function($ID) {
            return $rootScope.fsURL.replace("api.", "www.") + '/tree/person/details/' + $ID;
        }

        /* Parent Helpers */
        service.getFathers = function() {
            var persons = this.getPersons();
            var parentIDs = this.getParentRelationshipIDs();
            return _.filter(persons, function (person) {
                return parentIDs.includes(person.id) && person.gender.type.includes("Female") === false
            });
        }

        service.getMothers = function() {
            var persons = this.getPersons();
            var parentIDs = this.getParentRelationshipIDs();
            return _.filter(persons, function(person){
                return parentIDs.includes(person.id) && person.gender.type.includes("Female")
            });
        }

        service.getParentRelationshipIDs = function() {
            var parentRelationships = _.filter(data.relationships, function(relationship) {
                return relationship.type.includes("ParentChild") && relationship.person2.resourceId === primaryPerson.pid;
            });
            return _.map(parentRelationships, 'person1.resourceId');
        }


        /* Spouse Helpers */
        service.getSpouses = function() {
            var persons = this.getPersons();
            var spouseIDs = this.getSpouseRelationshipIDs();
            return _.filter(persons, function(person) {
                spouseIDs.includes(person.id)
            });
        }

        service.getSpouseRelationshipIDs = function() {
            var spouseRelationships = _.filter(data.relationships, function (relationship){
                return relationship.type.includes("Couple") && relationship.person2.resourceId === primaryPerson.pid;
            });
            return _.map(spouseRelationships, 'person1.resourceId');
        }


        /* Children Helpers */
        service.getChildren = function() {
            var persons = this.getPersons();
            var childrenIDs = this.getChildrenRelationshipIDs();
            return _.filter(persons, function (person) {
                return childrenIDs.includes(person.id);
            });
        }

        service.getChildrenRelationshipIDs = function() {
            var childrenRelationships = _.filter(data.relationships, function (relationship) {
                return (relationship.type.includes("ParentChild") && relationship.person1.resourceId === primaryPerson.pid);
            });
            return _.map(childrenRelationships, 'person2.resourceId');
        }
        return service;
    }
);