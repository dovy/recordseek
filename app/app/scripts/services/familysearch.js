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
        'fsAPI', ['_', function( _) {
            /* jshint camelcase:false */

            //        this.environment = 'sandbox'; // production, sandbox, staging

            if ( document.location.origin === 'http://recordseek.com' || document.location.origin === 'https://recordseek.com' ) {
                this.environment = 'production';
            } else {
                this.environment = 'beta';
            }
		    this.environment = 'production';

            if ( this.environment === 'sandbox' ) {
                this.client_id = 'a0T3000000ByxnUEAR';
            } else {
                this.client_id = 'S1M9-QH77-ZGJK-2HB1-MYZZ-6YN9-SBNQ-6YPS';
            }

            this.redirect_uri = document.location.origin;

            if ( document.location.origin !== 'http://localhost:9000' && document.location.origin !== 'http://localhost:9001' ) {
                this.redirect_uri += '/share/';
            }
            this.logout = function() {
                // alert( 'Logout' )
            }

            this.$get = function( $window, $http, $q, $timeout, $rootScope, $injector, $location ) {
                if ( this.client_id && this.environment && this.redirect_uri ) {
                    this.getEnvironment = function() {
                        return this.environment;
                    }


                    $http.defaults.useXDomain = true;
                    delete $http.defaults.headers.common['X-Requested-With'];

                    /* globals FamilySearch */
                    this.client = new FamilySearch(
                        {
                            appKey: this.client_id,
                            environment: this.environment,
                            redirectUri: this.redirect_uri,
                            saveAccessToken: true,
                            http_function: $http,
                            deferred_function: $q.defer,
                            auto_expire: true,
                            timeout_function: $timeout,
                            expire_callback: function( FS ) {
                                var urlParams = FS.helpers.decodeQueryString( document.URL );
                                // Don't redirect if we already have a code!
                                if ( !urlParams || ( urlParams && !urlParams.code && !urlParams.state ) ) {
                                    var url = FS.helpers.removeQueryString( document.URL );
                                    if ( $rootScope.data.sourceDescription && $rootScope.data.sourceDescription.id != '' ) {
                                        $rootScope.personData.sourceDescription = {
                                            id: $rootScope.data.sourceDescription.id
                                        }
                                    }

                                    $rootScope.setCookie( 'recordseek-auth', angular.toJson( $rootScope.data ) );
                                    url = FS.helpers.appendQueryParameters( url, {r: 1, '_': $rootScope.data['_']} );
                                    $rootScope.log( url );

                                    redirect = FS.getOAuth2AuthorizeURL( url );
                                    window.location = redirect;
                                }
                            }
                        }
                    );
                    var that = this;
                    
                    this.client.handleError = function(error, response) {
                        if (error) {
                            alert("Network Error");
                            return true;
                        } else if(response.statusCode >= 500){
                            alert("Oops, it's not you, neither us, I suspect it is the problem of FamilySearch. Please try again.");
                            return true;
                        } else if(response.statusCode == 401){
                            that.client.deleteAccessToken();
                            // In case of any errors of current user, we first redirect user to homepage
                            location.href = that.client.oauthRedirectURL();
                            return true;
                        } else if(response.statusCode >= 400){
                            alert('Ouch, looks like an another change in Family Search API. Please notify the administrator.');
                            return true;
                        }
                        return false;
                    }
                    this.client.displayUser = function( $scope ) {
                        if (!$rootScope.user ) {
                            if (that.client.getAccessToken()) {
                                that.client.get('/platform/users/current', {
                                    Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()}
                                },
                                function( error, userResponse ) {
                                    if (that.client.handleError(error, userResponse)){

                                        return;
                                    }
                                    
                                    if(error || userResponse.data.errors){
                                        if (error) console.error(error);
                                        if (userResponse.data.errors) 
                                            userResponse.data.errors.forEach(function (error) {console.error(error)});

                                        that.client.deleteAccessToken();
                                        // In case of any errors of current user, we first redirect user to homepage
                                        location.href = that.client.oauthRedirectURL();

                                    } else {
                                        if (userResponse.data && userResponse.data.users && userResponse.data.users.length > 0) {
                                            $rootScope.user = userResponse.data.users[0];
                                            $scope.user = $rootScope.user;
                                            $rootScope.log( $scope.user );
                                            $scope.$apply();
                                            that.client.fetchCollections($scope);
                                        }
                                    }
                                });
                                
                            } else {
                                location.href = that.client.oauthRedirectURL();
                                that.client.deleteAccessToken();
                            }
                        }
                        that.client.fetchCollections($scope);

                    }

                    that.client.fetchCollections = function($scope) {

                        if ( !$rootScope.sourcebox && $rootScope.user && $rootScope.user.id && $rootScope.user.personId ) {
                            $scope.getSourceBoxes = true;
                            $rootScope.data.sourcebox = "";
                            $scope.sourcebox = {'Home (Unorganized)': '', 'RecordSeek': 'CREATE'};

                            that.client.get('/platform/sources/' + $rootScope.user.id +'/collections', {
                                Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()}
                            }, function( error, response ) {
                                if (that.client.handleError(error, response))
                                    return;
                                var collections = [];
                                if (response && response.data) collections = response.data.collections;
                                var data = {};
                                angular.forEach(
                                    collections, function( key ) {
                                        if ( key.title != "" ) {
                                            data[key.title] = '/platform/sources/collections/' + key.id;
                                        }
                                    }, data
                                );
                                if ( !data['RecordSeek'] ) {
                                    data['RecordSeek'] = "CREATE";
                                }
                                var ordered = {
                                    'Home (Unorganized)': ''
                                };
                                Object.keys( data ).sort().forEach(
                                    function( key ) {
                                        ordered[key] = data[key];
                                    }
                                );

                                $rootScope.sourcebox = ordered;
                                $rootScope.log( $rootScope.sourcebox );
                                $scope.sourcebox = $rootScope.sourcebox;
                                $scope.getSourceBoxes = false;
                            });
                        }
                    }

                    // create source description: prepare request object from general object and send the request to create a source description
                    this.client.createSourceDescription = function(sourceDescriptionData) {
                        var draft = {};
                        if (sourceDescriptionData.about) draft.about = sourceDescriptionData.about;
                        if (sourceDescriptionData.citation) {
                            draft.citations = [];
                            draft.citations.push({value: sourceDescriptionData.citation});
                        }
                        if (sourceDescriptionData.title) {
                            draft.titles = [];
                            draft.titles.push({value: sourceDescriptionData.title});
                        }
                        if (sourceDescriptionData.text) {
                            draft.notes = [];
                            draft.notes.push({text: sourceDescriptionData.text});
                        }

                        if (sourceDescriptionData.changeMessage) {
                            draft.attribution = {};
                            draft.attribution.changeMessage = sourceDescriptionData.changeMessage;
                            if ($rootScope.user && $rootScope.user.id)
                                draft.attribution.contributor = {"resource": "https://api.familysearch.org/platform/users/agents/" + $rootScope.user.id, "resourceId": $rootScope.user.id};
                        }

                        return new Promise(function(resolve, reject) {
                            that.client.post('/platform/sources/descriptions', {
                                Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()},
                                body: { sourceDescriptions: [draft] }
                            }, function( error, response ) {
                                if (that.client.handleError(error, response))
                                    return reject(error);
                                return resolve(response);
                            });
                        });
                    }


                    // Create source box and return promise
                    this.client.createCollection = function(collectionData) {
                        var draft = {}
                        Object.assign(draft, {}, collectionData);
                        console.log("DRAFT in createCollection", draft);
                        return new Promise(function (resolve, reject)  {
                            that.client.post('/platform/sources/collections', {
                                Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()},
                                body: { collections: [draft] }
                            }, function( error, response ) {
                                if (that.client.handleError(error, response))
                                    return reject(error);
                                return resolve(response);
                            });
                        });
                    }

                    this.client.completeLogout = function() {
                        that.client.deleteAccessToken();
                        delete $rootScope.user;
                        $location.path( '/' );
                    }

                    // Not sure it's called from somewhere, however made this function to be compatible with new library
                    this.client.user = function() {
                        if (!$rootScope.user) {
                            // Get the current user. From the user profile, extract the tree person id.
                            that.client.get('/platform/users/current', {
                                    Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()}
                                }, function( error, userResponse ) {
                                    if (that.client.handleError(error, response)) {
                                        console.log(error, response);
                                        return;
                                    }
                                    if (userResponse.data && userResponse.data.users && userResponse.data.users.length > 0) {
                                        $rootScope.user = userResponse.data.users[0];
                                        $scope.user = $rootScope.user;
                                        $rootScope.log( $scope.user );
                                        $scope.$apply();
                                    }
                                }
                            )
                        }
                        return $rootScope.user;
                    }

                    // Get source folder collections for user.
                    this.client.getCollectionsForUser = function() {
                        return new Promise(function(resolve, reject) {
                            if (!$rootScope.user || !$rootScope.user.personId) reject(null);
                            that.client.get('/platform/sources/collections', {
                                Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()}
                            }, function( error, response ) {
                                if (that.client.handleError(error, response))
                                    return reject(error);
                                return resolve(response);
                            });
                        });
                    }

                    // Moving already created source descriptions to the specified folder(sourceBoxURL)
                    this.client.moveSourceDescriptionsToCollection = function(sourceBoxURL, sourceDescription) {
                        return new Promise(function(resolve, reject) {
                            that.client.post(sourceBoxURL, {
                                Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()},
                                body: { sourceDescriptions: [sourceDescription] }
                            }, function( error, response ) {
                                if (that.client.handleError(error, response))
                                    return reject(error);
                                return resolve(response);
                            });
                        });

                    }

                    // attach created source description to the person
                    this.client.createPersonSourceRef = function(personPID, attribution, sourceDescriptionID, tags) {
                        var dataRequest = {
                                "sources" : [ {
                                    "attribution" : attribution,
                                    "description" : "https://api.familysearch.org/platform/sources/descriptions/" + sourceDescriptionID,
                                    "tags" : tags
                                } ]
                            };
                        return new Promise(function(resolve, reject) {
                            that.client.post('/platform/tree/persons/' + personPID, {
                                Header: {'Authorization': 'Bearer ' + that.client.getAccessToken()},
                                body: { persons: [dataRequest] }
                            }, function( error, response ) {
                                if (that.client.handleError(error, response))
                                    return reject(error);
                                return resolve(response);
                            });
                        });
                    }



                    this.urlParams = RecordSeek.helpers.decodeQueryString( document.URL );

                    // Check if we have a code and do what we should accordingly
                    if ( this.urlParams.code) {//&& this.urlParams.state ) {

                        $rootScope.status = 'Authenticating, please wait.';
                        $location.path( '/loading' );
                        var redirect = '#/fs-source';
                        if (!this.client.getAccessToken()) {
                            this.client.oauthToken(this.urlParams.code, function(error, tokenResponse){
        
                                // error will be set when there was a networking error (i.e. the request
                                // didn't make it to the FS API or we didn't receive the response from the
                                // API). If we did get a response then we still check the status code 
                                // to make sure the user successfully signed in.
                                if(error || tokenResponse.statusCode >= 400){
                                    $rootScope.log(error || restError(tokenResponse));
                                }
                                that.client.setAccessToken(tokenResponse.data.access_token);
                                window.location = redirect;
                            });
                        }
                    }
                    $rootScope.fsURL = "https://api.familysearch.org";
/*                   
                    $rootScope.sourceBoxURL = this.client.settings.apiServer[this.client.settings.environment] + '/links-pages/sourceBox';
                    $rootScope.treeViewURL = this.client.settings.apiServer[this.client.settings.environment] + '/tree/#view=tree';
                    $rootScope.fsURL = this.client.settings.apiServer[this.client.settings.environment];
                    $rootScope.fsAccessToken = this.client.settings.accessToken;                   
*/
                }

                return this.client;
            };
        }]
    );

angular.module( 'ErrorCatcher', [] )
    .factory(
        'errorHttpInterceptor', ['$q', function( $q ) {
            return {
                responseError: function responseError( rejection ) {
                    Raven.captureException(
                        new Error( 'HTTP response error' ), {
                            extra: {
                                config: rejection.config,
                                status: rejection.status
                            }
                        }
                    );
                    return $q.reject( rejection );
                }
            };
        }]
    )
    .config(
        ['$httpProvider', function( $httpProvider ) {
            $httpProvider.interceptors.push( 'errorHttpInterceptor' );
        }]
    );
