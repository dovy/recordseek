var FamilySearch =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};

  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {

    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId])
    /******/ 			return installedModules[moduleId].exports;

    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
      /******/ 			exports: {},
      /******/ 			id: moduleId,
      /******/ 			loaded: false
      /******/ 		};

    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    /******/ 		// Flag the module as loaded
    /******/ 		module.loaded = true;

    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}


  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;

  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;

  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";

  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(0);
  /******/ })
/************************************************************************/
/******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

    var cookies = __webpack_require__(1),
      Request = __webpack_require__(2),
      requestHandler = __webpack_require__(3),
      utils = __webpack_require__(4),
      requestMiddleware = __webpack_require__(5),
      responseMiddleware = __webpack_require__(13);

    /**
     * Create an instance of the FamilySearch SDK Client
     *
     * @param {Object} options See a description of the possible options in the docs for config().
     */
    var FamilySearch = function(options){

      // Set the default options
      this.appKey = '';
      this.environment = 'integration';
      this.redirectUri = '';
      this.tokenCookie = 'FS_AUTH_TOKEN';
      this.maxThrottledRetries = 10;
      this.saveAccessToken = false;
      this.accessToken = '';
      this.jwt = '';
      this.middleware = {
        request: [
          requestMiddleware.url,
          requestMiddleware.defaultAcceptHeader,
          requestMiddleware.authorizationHeader,
          requestMiddleware.disableAutomaticRedirects,
          requestMiddleware.body
        ],
        response: [
          responseMiddleware.redirect,
          responseMiddleware.throttling,
          responseMiddleware.json
        ]
      };

      // Process options
      this.config(options);
    };

    /**
     * Set the configuration options of the SDK client.
     *
     * @param {Object} options
     * @param {String} options.environment Reference environment: production, beta,
     * or integration. Defaults to integration.
     * @param {String} options.appKey Application Key
     * @param {String} options.redirectUri OAuth2 redirect URI
     * @param {String} options.saveAccessToken Save the access token to a cookie
     * and automatically load it from that cookie. Defaults to false.
     * @param {String} options.accessToken Initialize the client with an access token.
     * @param {String} options.tokenCookie Name of the cookie that the access token
     * will be saved in when `saveAccessToken` is true. Defaults to 'FS_AUTH_TOKEN'.
     * @param {String} options.tokenCookiePath Path value of the access token cookie.
     * Defaults to current path (which is probably not what you want).
     * @param {String} options.maxThrottledRetries Maximum number of a times a
     * throttled request should be retried. Defaults to 10.
     * @param {Array} options.pendingModifications List of pending modifications
     * that should be activated.
     * @param {Integer} options.requestInterval Minimum interval between requests in milliseconds (ms).
     * By default this behavior is disabled; i.e. requests are issued immediately.
     * When this option is set then requests are queued to ensure there is at least
     * {requestInterval} ms between them. This is useful for smoothing out bursts
     * of requests and thus playing nice with the API servers.
     */
    FamilySearch.prototype.config = function(options){
      this.appKey = options.appKey || this.appKey;
      this.environment = options.environment || this.environment;
      this.redirectUri = options.redirectUri || this.redirectUri;
      this.tokenCookie = options.tokenCookie || this.tokenCookie;
      this.tokenCookiePath = options.tokenCookiePath || this.tokenCookiePath;
      this.maxThrottledRetries = options.maxThrottledRetries || this.maxThrottledRetries;
      this.saveAccessToken = (options.saveAccessToken === true) || this.saveAccessToken;

      if(options.accessToken){
        this.setAccessToken(options.accessToken);
      }

      if(Array.isArray(options.pendingModifications) && options.pendingModifications.length > 0){
        this.addRequestMiddleware(requestMiddleware.pendingModifications(options.pendingModifications));
      }

      if(parseInt(options.requestInterval, 10)) {
        this.addRequestMiddleware(requestMiddleware.requestInterval(parseInt(options.requestInterval, 10)));
      }

      // When the SDK is configured to save the access token in a cookie and we don't
      // presently have an access token then we try loading one from the cookie.
      //
      // We only do this when the saveAccessToken value changes, thus we examine
      // the value from the options object instead of the SDK. But the accessToken
      // has already been processed above so we check the SDK to see whether or not
      // an access token is already available.
      if(options.saveAccessToken && !this.getAccessToken()) {
        var token = cookies.get(this.tokenCookie);
        if(token){
          this.setAccessToken(token);
        }
      }
    };

    /**
     * Start the OAuth2 redirect flow by redirecting the user to FamilySearch.org
     *
     * @param {String} state
     */
    FamilySearch.prototype.oauthRedirect = function(state){
      window.location.href = this.oauthRedirectURL(state);
    };

    /**
     * Generate the OAuth 2 redirect URL
     *
     * @param {String} state
     */
    FamilySearch.prototype.oauthRedirectURL = function(state){
      var url = this.identHost() + '/cis-web/oauth2/v3/authorization?response_type=code&scope=openid profile email qualifies_for_affiliate_account country'
        + '&client_id=' + this.appKey + '&redirect_uri=' + this.redirectUri;
      if(state){
        url +=  '&state=' + state;
      }
      return url;
    };

    /**
     * Handle an OAuth2 redirect response by extracting the code from the query
     * and exchanging it for an access token. The token is automatically saved
     * in a cookie when that behavior is enabled.
     *
     * @param {String=} state
     * @param {Function} callback that receives the access token response
     * @return {Boolean} true if a code was detected; false no code was found or if
     * a state param was given and it doesn't match the state param in the query.
     * This does not indicate whether an access token was successfully requested,
     * just whether a code was found in the query param and a request was sent to
     * exchange the code for a token.
     */
    FamilySearch.prototype.oauthResponse = function(state, callback){

      // Allow the state parameter to be optional
      if(arguments.length === 1){
        callback = state;
        state = undefined;
      }

      // Compare state params
      var stateQuery = utils.getParameterByName('state');
      if(state && state !== stateQuery){
        return false;
      }

      // Extract the code from the query params
      var code = utils.getParameterByName('code');
      if(code){

        // Exchange the code for an access token
        this.oauthToken(code, callback);
        return true;
      }

      // Didn't have a code to exchange
      return false;
    };

    /**
     * Exchange an OAuth code for an access token. You don't need to call this in
     * the browser if you use oauthResponse() to automatically get the URL from the
     * query parameters.
     *
     * @param {String} code
     * @param {Function} callback that receives the access token response
     */
    FamilySearch.prototype.oauthToken = function(code, callback){
      var client = this;
      client.post(client.identHost() + '/cis-web/oauth2/v3/token', {
        body: {
          grant_type: 'authorization_code',
          code: code,
          client_id: client.appKey,
          redirect_uri: this.redirectUri,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, function(error, response){
        // Save the OpenId Connect JWT
        client.jwt = response.data.id_token;
        client.processOauthResponse(error, response, callback);
      });
    };

    /**
     * Obtain an access token for an unauthenticated session. Currently unauthenticated
     * access tokens only grant access to the Dates and Places endpoints.
     *
     * @param {String} ipAddress The IP address of the user
     * @param {Function} callback that receives the access token response
     */
    FamilySearch.prototype.oauthUnauthenticatedToken = function(ipAddress, callback){
      var client = this;
      client.post(client.identHost() + '/cis-web/oauth2/v3/token', {
        body: {
          grant_type: 'unauthenticated_session',
          ip_address: ipAddress,
          client_id: client.appKey
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, function(error, response){
        client.processOauthResponse(error, response, callback);
      });
    };

    /**
     * OAuth2 password authentication
     *
     * @param {String} username
     * @param {String} password
     * @param {Function} callback
     */
    FamilySearch.prototype.oauthPassword = function(username, password, callback){
      var client = this;
      this.post(this.identHost() + '/cis-web/oauth2/v3/token', {
        body: {
          grant_type: 'password',
          client_id: this.appKey,
          username: username,
          password: password
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, function(error, response){
        client.processOauthResponse(error, response, callback);
      });
    };

    /**
     * Process an OAuth2 access_token response
     */
    FamilySearch.prototype.processOauthResponse = function(error, response, callback){
      if(response && response.statusCode === 200 && response.data){
        this.setAccessToken(response.data.access_token);
      }
      if(callback){
        setTimeout(function(){
          callback(error, response);
        });
      }
    };

    /**
     * Set the access token. The token is also saved to a cookie if that behavior
     * is enabled.
     *
     * @param {String} accessToken
     * @return {FamilySearch} client
     */
    FamilySearch.prototype.setAccessToken = function(accessToken){
      this.accessToken = accessToken;
      if(this.saveAccessToken){
        // Expire in 24 hours because tokens never last longer than that, though
        // they can expire before that after 1 hour of inactivity.
        cookies.set(this.tokenCookie, accessToken, { expires: 1, path: this.tokenCookiePath });
      }
      return this;
    };

    /**
     * Get the access token if one is currently set
     *
     * @return {String} access token
     */
    FamilySearch.prototype.getAccessToken = function(){
      return this.accessToken;
    };

    /**
     * Delete the access token
     *
     * @return {FamilySearch} client
     */
    FamilySearch.prototype.deleteAccessToken = function(){
      this.accessToken = undefined;
      if(this.saveAccessToken){
        cookies.remove(this.tokenCookie, { path: this.tokenCookiePath });
      }
      return this;
    };

    /**
     * Add request middleware
     *
     * @param {Function} middleware
     * @return {FamilySearch} client
     */
    FamilySearch.prototype.addRequestMiddleware = function(middleware){
      this.middleware.request.push(middleware);
      return this;
    };

    /**
     * Add response middleware
     *
     * @param {Function} middleware
     * @return {FamilySearch} client
     */
    FamilySearch.prototype.addResponseMiddleware = function(middleware){
      this.middleware.response.push(middleware);
      return this;
    };

    /**
     * Execute an HTTP GET
     *
     * @param {String} url
     * @param {Object=} options See request() for an explanation of the options
     * @param {Function} callback
     */
    FamilySearch.prototype.get = _req('GET');

    /**
     * Execute an HTTP POST
     *
     * @param {String} url
     * @param {Object=} options See request() for an explanation of the options
     * @param {Function} callback
     */
    FamilySearch.prototype.post = _req('POST');

    /**
     * Execute an HTTP HEAD
     *
     * @param {String} url
     * @param {Object=} options See request() for an explanation of the options
     * @param {Function} callback
     */
    FamilySearch.prototype.head = _req('HEAD');

    /**
     * Execute an HTTP DELETE
     *
     * @param {String} url
     * @param {Object=} options See request() for an explanation of the options
     * @param {Function} callback
     */
    FamilySearch.prototype.delete = _req('DELETE');

    /**
     * Construct a request wrapper for the specified HTTP method
     */
    function _req(method){

      /**
       * @param {String} url
       * @param {Object=} options See request() for an explanation of the options
       * @param {Function} callback
       */
      return function(url, options, callback){

        // Allow for options to not be given in which case the callback will be
        // the second argument
        if(typeof options === 'function'){
          callback = options;
          options = {};
        }

        options.method = method;

        this.request(url, options, callback);
      };
    }

    /**
     * Execute an HTTP request
     *
     * @param {String} url
     * @param {Object=} options
     * @param {String} options.method HTTP method. Defaults to GET
     * @param {Object} options.headers HTTP headers. `{'Content-Type':'application/x-fs-v1+json'}`
     * @param {String|Object} options.body Request body. May be a JavaScript object
     * or a string. If an object is detected then the SDK will attempt automatically
     * set the `Content-Type` header to `application/x-fs-v1+json` if it's missing.
     * @param {Function} callback
     */
    FamilySearch.prototype.request = function(url, options, callback){

      // Allow for options to not be given in which case the callback will be
      // the second argument
      if(typeof options === 'function'){
        callback = options;
        options = {};
      }

      this._execute(new Request(url, options, callback), callback);
    };

    /**
     * Execute a request
     *
     * @param {Object} request
     */
    FamilySearch.prototype._execute = function(request, callback){
      var client = this;

      // First we run request middleware
      client._runRequestMiddleware(request, function(error, middlewareResponse){

        // Return the error if one was received from the middleware
        if(error || middlewareResponse){
          responseHandler(error, middlewareResponse);
        }

        // If we didn't receive a response from the request middleware then we
        // proceed with executing the actual request.
        else {
          requestHandler(request, responseHandler);
        }
      });

      function responseHandler(error, response){
        // If the request errored then we immediately return and don't run
        // response middleware because we don't have an HTTP response
        if(error){
          setTimeout(function(){
            callback(error);
          });
        }

        // Run response middleware
        else {
          client._runResponseMiddleware(request, response, function(error){
            setTimeout(function(){
              if(error){
                callback(error);
              } else {
                callback(undefined, response);
              }
            });
          });
        }
      }
    };

    /**
     * Run request middleware
     *
     * @param {Object} request
     * @param {Function} callback(error, response)
     */
    FamilySearch.prototype._runRequestMiddleware = function(request, callback){
      var client = this;
      utils.asyncEach(this.middleware.request, function(middleware, next){
        middleware(client, request, function(error, newResponse){
          if(error || newResponse){
            callback(error, newResponse);
          } else {
            next();
          }
        });
      }, callback);
    };

    /**
     * Run response middleware
     *
     * @param {Object} request
     * @param {Object} response
     * @param {Function} callback(error)
     */
    FamilySearch.prototype._runResponseMiddleware = function(request, response, callback){
      var client = this;
      utils.asyncEach(this.middleware.response, function(middleware, next){
        middleware(client, request, response, function(error, cancel){
          if(error){
            callback(error);
          } else if(typeof cancel === 'undefined') {
            next();
          }
        });
      }, callback);
    };

    /**
     * Get the ident host name for OAuth
     *
     * @return string
     */
    FamilySearch.prototype.identHost = function(){
      switch (this.environment) {
        case 'production':
          return 'https://ident.familysearch.org';
        case 'beta':
          return 'https://identbeta.familysearch.org';
        default:
          return 'https://identint.familysearch.org';
      }
    };

    /**
     * Get the host name for the platform API
     *
     * @return string
     */
    FamilySearch.prototype.platformHost = function(){
      switch (this.environment) {
        case 'production':
          return 'https://api.familysearch.org';
        case 'beta':
          return 'https://beta.familysearch.org';
        default:
          return 'https://api-integ.familysearch.org';
      }
    };

    module.exports = FamilySearch;


    /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {

    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.2.0
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
    ;(function (factory) {
      var registeredInModuleLoader = false;
      if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        registeredInModuleLoader = true;
      }
      if (true) {
        module.exports = factory();
        registeredInModuleLoader = true;
      }
      if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
          window.Cookies = OldCookies;
          return api;
        };
      }
    }(function () {
      function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
          var attributes = arguments[ i ];
          for (var key in attributes) {
            result[key] = attributes[key];
          }
        }
        return result;
      }

      function init (converter) {
        function api (key, value, attributes) {
          var result;
          if (typeof document === 'undefined') {
            return;
          }

          // Write

          if (arguments.length > 1) {
            attributes = extend({
              path: '/'
            }, api.defaults, attributes);

            if (typeof attributes.expires === 'number') {
              var expires = new Date();
              expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
              attributes.expires = expires;
            }

            // We're using "expires" because "max-age" is not supported by IE
            attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

            try {
              result = JSON.stringify(value);
              if (/^[\{\[]/.test(result)) {
                value = result;
              }
            } catch (e) {}

            if (!converter.write) {
              value = encodeURIComponent(String(value))
                .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
            } else {
              value = converter.write(value, key);
            }

            key = encodeURIComponent(String(key));
            key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
            key = key.replace(/[\(\)]/g, escape);

            var stringifiedAttributes = '';

            for (var attributeName in attributes) {
              if (!attributes[attributeName]) {
                continue;
              }
              stringifiedAttributes += '; ' + attributeName;
              if (attributes[attributeName] === true) {
                continue;
              }
              stringifiedAttributes += '=' + attributes[attributeName];
            }
            return (document.cookie = key + '=' + value + stringifiedAttributes);
          }

          // Read

          if (!key) {
            result = {};
          }

          // To prevent the for loop in the first place assign an empty array
          // in case there are no cookies at all. Also prevents odd result when
          // calling "get()"
          var cookies = document.cookie ? document.cookie.split('; ') : [];
          var rdecode = /(%[0-9A-Z]{2})+/g;
          var i = 0;

          for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookie = parts.slice(1).join('=');

            if (!this.json && cookie.charAt(0) === '"') {
              cookie = cookie.slice(1, -1);
            }

            try {
              var name = parts[0].replace(rdecode, decodeURIComponent);
              cookie = converter.read ?
                converter.read(cookie, name) : converter(cookie, name) ||
                cookie.replace(rdecode, decodeURIComponent);

              if (this.json) {
                try {
                  cookie = JSON.parse(cookie);
                } catch (e) {}
              }

              if (key === name) {
                result = cookie;
                break;
              }

              if (!key) {
                result[name] = cookie;
              }
            } catch (e) {}
          }

          return result;
        }

        api.set = api;
        api.get = function (key) {
          return api.call(api, key);
        };
        api.getJSON = function () {
          return api.apply({
            json: true
          }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
          api(key, '', extend(attributes, {
            expires: -1
          }));
        };

        api.withConverter = init;

        return api;
      }

      return init(function () {});
    }));


    /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

    /**
     * Representation of an HTTP request.
     *
     * @param {String} url
     * @param {Object} options {method, headers, body, retries}
     * @param {Function} callback
     */
    var Request = function(url, options, callback){

      // Inititialize and set defaults
      this.url = url;
      this.callback = callback || function(){};
      this.method = 'GET';
      this.headers = {};
      this.retries = 0;
      this.options = {};

      // Process request options. We use a for loop so that we can stuff all
      // non-standard options into the options object on the reuqest.
      var opt;
      for(opt in options){
        if(options.hasOwnProperty(opt)){
          switch(opt){

            case 'method':
            case 'body':
            case 'retries':
              this[opt] = options[opt];
              break;

            case 'headers':
              // We copy the headers object so that we don't have to worry about the developer
              // and the SDK stepping on each other's toes by modifying the headers object.
              this.headers = JSON.parse(JSON.stringify(options.headers));
              break;

            default:
              this.options[opt] = options[opt];
          }
        }
      }
    };

    /**
     * Does this request have the specified header?
     *
     * @param {String} header
     * @return {Boolean}
     */
    Request.prototype.hasHeader = function(header){
      return typeof this.headers[header] !== 'undefined';
    };

    /**
     * Set a header on the request
     *
     * @param {String} header
     * @param {String} value
     */
    Request.prototype.setHeader = function(header, value){
      this.headers[header] = value;
      return this;
    };

    /**
     * Get a header's value
     *
     * @param {String} header
     * @return {String} value
     */
    Request.prototype.getHeader = function(header){
      return this.headers[header];
    };

    /**
     * Get all the headers
     *
     * @return {Object} headers
     */
    Request.prototype.getHeaders = function(){
      return this.headers;
    };

    /**
     * Return true if this request is for an API in the /platform/ directory
     *
     * @return {Boolean}
     */
    Request.prototype.isPlatform = function(){
      return this.url.indexOf('/platform/') !== -1;
    };

    module.exports = Request;

    /***/ }),
  /* 3 */
  /***/ (function(module, exports) {

    /**
     * XMLHttpRequest wrapper used for making requests in the browser
     *
     * @param {Object} request {url, method, headers, body, retries}
     * @param {Function} callback function(response)
     */

    var headersRegex = /^(.*?):[ \t]*([^\r\n]*)$/mg;

    module.exports = function(request, callback){

      // Create the XMLHttpRequest
      var xhr = new XMLHttpRequest();
      xhr.open(request.method, request.url);

      // Set headers
      var headers = request.getHeaders();
      for(var name in headers){
        if(headers.hasOwnProperty(name)) {
          xhr.setRequestHeader(name, headers[name]);
        }
      }

      // Attach response handler
      xhr.onload = function(){
        var response = createResponse(xhr, request);
        setTimeout(function(){
          callback(null, response);
        });
      };

      // Attach error handler
      xhr.onerror = function(error){
        setTimeout(function(){
          callback(error);
        });
      };

      // Now we can send the request
      xhr.send(request.body);

    };

    /**
     * Convert an XHR response to a standard response object
     *
     * @param {XMLHttpRequest} xhr
     * @param {Object} request {url, method, headers, retries}
     * @return {Object} response
     */
    function createResponse(xhr, request){

      // XHR header processing borrowed from jQuery
      var responseHeaders = {}, match;
      while ((match = headersRegex.exec(xhr.getAllResponseHeaders()))) {
        responseHeaders[match[1].toLowerCase()] = match[2];
      }

      return {
        statusCode: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        originalUrl: request.url,
        effectiveUrl: request.url,
        redirected: false,
        requestMethod: request.method,
        requestHeaders: request.headers,
        body: xhr.responseText,
        retries: 0,
        throttled: false
      };
    }

    /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

    module.exports = {

      /**
       * URL encode an object
       *
       * http://stackoverflow.com/a/1714899
       *
       * @param {Object}
       * @return {String}
       */
      urlEncode: function(obj){
        var str = [];
        for(var p in obj){
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        }
        return str.join("&");
      },

      /**
       * Get a query parameter by name
       *
       * http://stackoverflow.com/a/5158301
       */
      getParameterByName: function(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
      },

      /**
       * Iterate over data asynchronously in series.
       *
       * @param {Array} list
       * @param {Function} iterator function(item, next)
       * @param {Function} finished function()
       */
      asyncEach: function(data, iterator, callback){
        function nextCall(i){
          if(i === data.length){
            setTimeout(callback);
          } else {
            iterator(data[i], function(){
              setTimeout(function(){
                nextCall(++i);
              });
            });
          }
        }
        nextCall(0);
      }

    };

    /***/ }),
  /* 5 */
  /***/ (function(module, exports, __webpack_require__) {

    module.exports = {
      authorizationHeader: __webpack_require__(6),
      body: __webpack_require__(7),
      defaultAcceptHeader: __webpack_require__(8),
      disableAutomaticRedirects: __webpack_require__(9),
      pendingModifications: __webpack_require__(10),
      requestInterval: __webpack_require__(11),
      url: __webpack_require__(12)
    };

    /***/ }),
  /* 6 */
  /***/ (function(module, exports) {

    // Set the Authorization header if we have an access token
    module.exports = function(client, request, next){
      if(!request.hasHeader('Authorization') && client.getAccessToken() && request.isPlatform()){
        request.setHeader('Authorization', 'Bearer ' + client.getAccessToken());
      }
      next();
    };

    /***/ }),
  /* 7 */
  /***/ (function(module, exports, __webpack_require__) {

    var utils = __webpack_require__(4);

    // Process a request body
    //
    // Allow for a string or object. If an object is given then stringify it.
    // Try to guess the appropriate `Content-Type` value if it's missing.
    module.exports = function(client, request, next){

      if(request.body && (request.method === 'POST' || request.method === 'PUT')){

        // Try to guess the content type if it's missing
        if(!request.hasHeader('Content-Type') && request.isPlatform()){
          request.setHeader('Content-Type', 'application/x-fs-v1+json');
        }

        // Turn objects into strings
        if(typeof request.body !== 'string'){

          // JSON.stringify() if the content-type is JSON
          if(request.hasHeader('Content-Type') && request.getHeader('Content-Type').indexOf('json') !== -1){
            request.body = JSON.stringify(request.body);
          }

          // URL encode
          else {
            request.body = utils.urlEncode(request.body);
          }

        }
      }

      next();
    };

    /***/ }),
  /* 8 */
  /***/ (function(module, exports) {

    // Set the Accept header if it's missing on /platform URLs
    module.exports = function(client, request, next){
      if(!request.hasHeader('Accept') && request.isPlatform()){
        request.setHeader('Accept', 'application/x-fs-v1+json');
      }
      next();
    };

    /***/ }),
  /* 9 */
  /***/ (function(module, exports) {

    /**
     * Disable automatic redirects. Useful client-side so that the browser doesn't
     * automatically follow 3xx redirects; that causes problems if the browser
     * doesn't replay all request options such as the Accept header.
     */
    module.exports = function(client, request, next){
      if(!request.hasHeader('X-Expect-Override') && request.isPlatform()){
        request.setHeader('X-Expect-Override', '200-ok');
      }
      next();
    };

    /***/ }),
  /* 10 */
  /***/ (function(module, exports) {

    /**
     * Add headers for enabling pending modifications. Call this method when adding
     * the middleware to pass the header list that will be processed and cached.
     *
     * `client.addMiddleware(pendingModificationMiddleware(modfifications));`
     *
     * @param {Array} mods list of modifications
     * @return {Function} middleware
     */
    module.exports = function(mods){

      // Cache the header value so we don't have to do this on every request
      var headerValue = mods.join(',');

      // Return the actual middleware
      return function(client, request, next){
        request.headers['X-FS-Feature-Tag'] = headerValue;
        next();
      };
    };

    /***/ }),
  /* 11 */
  /***/ (function(module, exports) {

    /**
     * Enforce a minimum interval between requests.
     * See https://github.com/FamilySearch/fs-js-lite/issues/30
     *
     * @param {Integer} interval Minimum time between requests, in milliseconds (ms)
     * @return {Function} middleware
     */
    module.exports = function(interval) {

      var lastRequestTime = 0,
        requestQueue = [],
        timer;

      /**
       * Add a request to the queue
       *
       * @param {Function} next The next method that was sent to the middleware with the request.
       */
      function enqueue(next) {
        requestQueue.push(next);
        startTimer();
      }

      /**
       * Start the timer that checks for when a request in the queue is ready to go.
       * This fires every {interval} ms to enforce a minimum time between requests.
       * The actual time between requests may be longer.
       */
      function startTimer() {
        if(!timer) {
          timer = setInterval(checkQueue, interval);
        }
      }

      /**
       * Check to see if we're ready to send any requests.
       */
      function checkQueue() {
        if(!inInterval()) {
          if(requestQueue.length) {
            var next = requestQueue.shift();
            sendRequest(next);
          } else if(timer) {
            clearInterval(timer); // No need to leave the timer running if we don't have any requests.
          }
        }
      }

      /**
       * Send a request by calling it's next() method and mark the current time so
       * that we can accurately enforce the interval.
       */
      function sendRequest(next) {
        lastRequestTime = Date.now();
        next();
      }

      /**
       * Returns true if the most recent request was less then {interval} ms in the past
       *
       * @return {Boolean}
       */
      function inInterval() {
        return Date.now() - lastRequestTime < interval;
      }

      return function(client, request, next) {

        // If there are any requests in the queue or if the previous request was issued
        // too recently then add this request to the queue.
        if(requestQueue.length || inInterval()) {
          enqueue(next);
        }

        else {
          sendRequest(next);
        }
      };

    };

    /***/ }),
  /* 12 */
  /***/ (function(module, exports) {

    // Calculate the URL
    //
    // For now we just need to know whether the protocol + host were provided
    // because if we just received a path such as /platform/tree/persons then
    // we want to automatically prepend the platform host.
    module.exports = function(client, request, next){
      if(request.url.indexOf('https://') === -1){
        request.url = client.platformHost() + request.url;
      }
      next();
    };

    /***/ }),
  /* 13 */
  /***/ (function(module, exports, __webpack_require__) {

    module.exports = {
      json: __webpack_require__(14),
      redirect: __webpack_require__(15),
      throttling: __webpack_require__(16)
    };

    /***/ }),
  /* 14 */
  /***/ (function(module, exports) {

    // Parse JSON response
    module.exports = function(client, request, response, next){
      var contentType = response.headers['content-type'];
      if(contentType && contentType.indexOf('json') !== -1){
        try {
          response.data = JSON.parse(response.body);
        } catch(e) {
          // Should we handle this error? how could we?
        }
      }
      next();
    };

    /***/ }),
  /* 15 */
  /***/ (function(module, exports) {

    /**
     * Automatically follow a redirect. This behavior is optional because you don't
     * allways want to follow redirects such as when requesting a person's profile.
     *
     * This middleware is enabled per request by setting the `followRedirect` request
     * option to true.
     */
    module.exports = function(client, request, response, next){
      var location = response.headers['location'];
      if(request.options.followRedirect && location && location !== request.url ){
        var originalUrl = request.url;
        request.url = response.headers['location'];
        client._execute(request, function(error, response){
          if(response){
            response.originalUrl = originalUrl;
            response.redirected = true;
          }
          setTimeout(function(){
            request.callback(error, response);
          });
        });
        return next(undefined, true);
      }
      next();
    };

    /***/ }),
  /* 16 */
  /***/ (function(module, exports) {

    // Automatically replay all throttled requests
    module.exports = function(client, request, response, next){
      // Throttled responses have an HTTP status code of 429. We also check to make
      // sure we haven't maxed out on throttled retries.
      if(response.statusCode === 429 && request.retries < client.maxThrottledRetries){

        // Throttled responses include a retry header that tells us how long to wait
        // until we retry the request
        var retryAfter = parseInt(response.headers['retry'] || response.headers['retry-after'], 10) * 1000 || 1000;
        setTimeout(function(){
          client._execute(request, function(error, response){
            response.throttled = true;
            response.retries = ++request.retries;
            setTimeout(function(){
              request.callback(error, response);
            });
          });
        }, retryAfter);
        return next(undefined, true);
      }
      next();
    };

    /***/ })
  /******/ ]);
