'use strict';
/**
 * Return an empty object if passed in a null or undefined, similar to the maybe monad
 * @param {*} value Value to test
 * @returns {*} Original value or empty object
 */
window.maybe = function (value) {
  return value != null ? value : {}; // != null also covers undefined
};
var RecordSeek = RecordSeek || {};
var HEADER_NAME = 'MyApp-Handle-Errors-Generically';
var specificallyHandleInProgress = false;
RecordSeek.helpers = {
  isNotString: function (str) {
    return (typeof str !== 'string');
  },
  decodeQueryString: function (url) {
    var obj = {};
    if (url) {
      var pos = url.indexOf('?');
      if (pos !== -1) {
        var segments = "";
        if (url.indexOf('amp;') > 0) {
          segments = decodeURIComponent(url).substring(pos + 1).split('&amp;');
        } else {
          segments = decodeURIComponent(url).substring(pos + 1).split('&');
        }
        segments.forEach(function (segment) {
          var posEqual = segment.indexOf('=');
          var kv = segment.split('=', 2);
          if (kv && kv[0]) {
            var key = decodeURIComponent(kv[0]);
            var value = (kv[1] != null ? decodeURIComponent(segment.substring(posEqual + 1)) : kv[1]); // catches null and undefined
            if (obj[key] != null && !Array.isArray(obj[key])) {
              obj[key] = [obj[key]];
            }
            if (obj[key] != null) {
              obj[key].push(value);
            } else {
              obj[key] = value;
            }
          }
        });
      }
    }
    return obj;
  },
  /**
   * Append query parameters object to a url
   * @param {string} url
   * @param {Object} params
   * @returns {String} url + query string
   */
  appendQueryParameters: function (url, params) {
    var queryString = this.encodeQueryString(params);
    if (queryString.length === 0) {
      return url;
    }
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + queryString;
  },
  /**
   * Remove the query string from the url
   * @param {string} url url
   * @returns {string} url without query string
   */
  removeQueryString: function (url) {
    if (url) {
      var pos = url.indexOf('?');
      if (pos !== -1) {
        url = url.substring(0, pos);
      }
    }
    return url;
  },
  /**
   * Create a URL-encoded query string from an object
   * @param {Object} params Parameters
   * @returns {string} URL-encoded string
   */
  encodeQueryString: function (params) {
    var arr = [];
    this.forEach(params, function (value, key) {
      key = encodeURIComponent(key);
      var param;
      if (Array.isArray(value)) {
        param = _.map(value, function (elm) {
          //noinspection JSValidateTypes
          return key + '=' + encodeURIComponent(elm);
        }).join('&');
      } else if (value != null) { // catches null and undefined
        param = key + '=' + encodeURIComponent(value);
      } else {
        param = key;
      }
      arr.push(param);
    });
    return arr.join('&');
  },

  /**
   * borrowed from underscore.js
   * @param {Array|Object} obj Object or array to iterate over
   * @param {function(elm)} iterator Function to call
   * @param {Object=} context Object for this
   */
  forEach: function (obj, iterator, context) {
    if (obj == null) { // also catches undefined
      return;
    }
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}) {
          return;
        }
      }
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (iterator.call(context, obj[key], key, obj) === {}) {
            return;
          }
        }
      }
    }
  }

};

if ('addEventListener' in document) {
  document.addEventListener(
    'DOMContentLoaded', function () {
      FastClick.attach(document.body);
    }, false
  );
}


/**
 * @ngdoc overview
 * @name recordseekApp
 * @description
 * # recordseekApp
 *
 * Main module of the application.
 */
angular
  .module(
    'recordseekApp', [
      'ngAnimate',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ui.bootstrap'
    ]
  )
  .run(
    ['$rootScope', '$location', '$cookies', '$window', 'fsAPI', '$http', '$log', '$timeout', function ($rootScope, $location, $cookie, $window, fsAPI, $http, $log, $timeout) {
      /* global ga, _ */
      /* jshint camelcase: true */
      // For debugging purposes obviously
      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];

      // window.location.origin is not supported by IE11
      if (!window.location.origin) {
        window.location.origin = window.location.protocol + '//' +
          window.location.hostname +
          (window.location.port ? ':' + window.location.port : '');
      }
      if (!document.location.origin) {
        document.location.origin = window.location.origin;
      }
      //var referrer = window.location.href.substring(window.location.origin.length, window.location.href.length);

      $rootScope.helpers = RecordSeek.helpers;
      $rootScope.attachMsg = 'Source created by RecordSeek.com';

      // $rootScope.debug = true; //fsAPI.environment == 'production' ? false : true;
      $rootScope.debug = location.hostname === "localhost" ? true : false;

      if (!$rootScope.debug) {
        ga('create', 'UA-16096334-10');
        ga('send', 'pageview');
        try {
          Sentry.init({dsn: 'https://446c24f6e25e4168b4d71a90cbf74794@sentry.io/105393'});
        } catch (error) {
          console.error('Sentry failing');
        }
      }

      $rootScope.service = '';
      $rootScope.expires = 15; // Mins until the cookie is expired

      $rootScope.log = function ($message) {
        if ($rootScope.debug) {
          $log.debug($message);
        }
      };
      $rootScope.getCookie = function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      };
      $rootScope.setCookie = function ($key, $data) {
        var date = new Date(),
          $exp = new Date(date);
        $exp.setMinutes(date.getMinutes() + $rootScope.expires);
        $cookie.put(
          $key, $data, {
            expires: $exp
          }
        );
      };
      $rootScope.sourceFormats = {
        'APA': '{title}. ({year}, {month_full} {date}). Retrieved from {url}',
        'Harvard - AGPS': '{title}. [online] Available at: <{url}> [Accessed {date} {month}. {year}]',
        'MLA': '"{title}." {publisher} {url}. Accessed {date} {month}. {year}.',
        'Chicago': '"{title}", {publisher}, accessed {month_full} {date}, {year}, {url}',
      };
      $rootScope.generateCitation = function() {
        if (!$rootScope.data.sourceFormat) {
          var cookieCheck = $rootScope.getCookie('recordseek_source_format');
          if (cookieCheck !== '' && $rootScope.sourceFormats[cookieCheck] !== undefined) {
            $rootScope.data.sourceFormat = cookieCheck;
          } else {
            $rootScope.data.sourceFormat = 'MLA';
          }
        }

        $rootScope.data.citation = $rootScope.sourceFormats[$rootScope.data.sourceFormat];
        $rootScope.data.citation = $rootScope.data.citation.replace('{title}', $rootScope.data.title);
        $rootScope.data.citation = $rootScope.data.citation.replace('{publisher}', $rootScope.data.publisher);
        $rootScope.data.citation = $rootScope.data.citation.replace('{url}', $rootScope.data.url);
        $rootScope.data.citation = $rootScope.data.citation.replace('{time}', $rootScope.data.time);
        $rootScope.data.citation = $rootScope.data.citation.replace('{date}', $rootScope.data.date);
        $rootScope.data.citation = $rootScope.data.citation.replace('{year}', $rootScope.data.year);
        $rootScope.data.citation = $rootScope.data.citation.replace('{month}', $rootScope.data.month);
        $rootScope.data.citation = $rootScope.data.citation.replace('{month_full}', $rootScope.data.month_full);
      };
      $rootScope.setCitationFormat = function (format) {
        if ($rootScope.sourceFormats[format] !== undefined) {
          $rootScope.data.sourceFormat = format;
          $rootScope.setCookie('recordseek_source_format', format);
          $rootScope.generateCitation();
        }
      };

      $rootScope.logout = function () {
        $rootScope.log(fsAPI);
        if ($rootScope.service === "FamilySearch") {
          fsAPI.completeLogout().then(function () {
            window.location.href = fsAPI.oauthRedirectURL();
          });
        }
      };

      $rootScope.safeApply = function () {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
        } else {
          this.$apply();
        }
      };

      $rootScope.track = function (event) {
        if (!$rootScope.debug) {
          ga('send', 'event', event);
        } else {
          $rootScope.log(event);
        }
      };

      $rootScope.actionTaken = function ($event) {
        var $el = $event.currentTarget.attributes;
        if ($el['data-tracking']) {
          $rootScope.track({eventCategory: 'App', eventAction: $el['data-tracking'].value});
        }

        // Allow people to remove the RecordSeek icon from sources for Ancestry
        if ($el['data-tracking'].value == "Ancestry" && $el['id']['nodeValue']) {
          $rootScope.data.media_url = "https://recordseek.com/assets/images/ancestry.jpg";
        }

        // Redirect if they've already been to the main page before
        if ($el['data-tracking'] && ($el['data-tracking'].value === "FamilySearch" || $el['data-tracking'].value === "Ancestry")) {
          $rootScope.setCookie('recordseek-last-service', $el['data-tracking'].value);
        }

        if ($el['target'] && $el['target'].value === "_blank") {
          $window.open($el['data-href'].value);
        } else {
          $location.path($el['data-href'].value);
        }
      };

      var split = document.URL.split('#');
      var params = $rootScope.helpers.decodeQueryString(split[0]);

      if ($rootScope.debug) {
        console.log(params);
      }

      if (params.code) {
        if (fsAPI.getAccessToken() && fsAPI.getAccessToken() != "undefined") {
          var out = [];
          var url = '';
          for (var key in params) {
            if (params.hasOwnProperty(key) && key !== 'code') {
              out.push(key + '=' + encodeURIComponent(params[key]));
            }
          }
          if ((document.location.origin === 'http://recordseek.com' || document.location.origin === 'https://recordseek.com'))
            url = document.location.origin + "/share/#!/?" + out.join('&amp;') + "#" + ((split && split[1]) ? split[1] : '');
          location.href = 'http://localhost:9000/?' + out.join('&') + "#" + ((split && split[1]) ? split[1] : '');

        }
        fsAPI.oauthToken(params.code, function (error, tokenResponse) {

          // error will be set when there was a networking error (i.e. the request
          // didn't make it to the FS API or we didn't receive the response from the
          // API). If we did get a response then we still check the status code
          // to make sure the user successfully signed in.
          if (error || tokenResponse.statusCode >= 400) {
            console.log("From oauthToken", error || tokenResponse.statusCode);
            return;
          }

          fsAPI.setAccessToken(tokenResponse.data.access_token);


          var url = document.location.origin + "/#";
          if ((document.location.origin === 'http://recordseek.com' || document.location.origin === 'https://recordseek.com'))
            url = document.location.origin + "/share/#!/?";
          location.href = url;

        });
      }

      if (params.tags) {
        var $todo = params.tags.split(',');
        params.tags = {};
        $todo.map(
          function (item) {
            params.tags[item.toLowerCase()] = true;
          }
        );
      } else {
        params.tags = {};
      }
      if (params.birthPlace || params.birthDate) {
        params.tags.birth = true;
      }
      if (params.deathPlace || params.deathDate) {
        params.tags.death = true;
      }
      if (params.givenName || params.surname) {
        params.tags.name = true;
      }
      if (params.gender) {
        params.tags.gender = true;
      }
      $rootScope.log(params);
      if (params.r == 1) {
        delete params.r;
        var cData = $cookie.get('recordseek-auth');
        if (cData != "") {
          params = angular.fromJson(cData);
        }
      }

      if ($location.$$absUrl.indexOf('?_') > -1 && $location.$$absUrl.indexOf('/#') === -1) {
        //var $url = $location.$$absUrl.replace( '?_', '#/?_' );
        //$window.location.href = $url;
        //return;
      }

      //$rootScope.log(document.location.origin+'/');

      if (params) {
        var obj = params;
        var personData = {};
        var skip = [
          'h1'
        ];

        for (var prop in obj) {
          var value = obj[prop], type = typeof value;
          if (value !== null && (type === 'string') && obj.hasOwnProperty(prop)) {
            if (prop.indexOf('.') !== -1) {
              var index = prop.split('.');
              obj[index[0]] = (obj[index[0]]) ? obj[index[0]] : [];
              obj[index[0]][index[1]] = obj[prop].replace(/(\r\n|\n|\r)/gm, "").replace(
                / +(?= )/g, ''
              ).trim();
            } else {
              obj[prop] = obj[prop].replace(/(\r\n|\n|\r)/gm, "").replace(/ +(?= )/g, '').trim();
            }
            if (skip.indexOf(prop) === -1 && obj[prop] != "") {
              personData[prop] = obj[prop];
            }
          }
        }

        // special handling for fs-source, to fill in the data from/to localStorage.
        var sourceMaps = ['title', 'url', 'citation', 'notes', '_', 'publisher', 'year', 'month', 'date', 'full_month'];
        sourceMaps.forEach(function (key) {
          var localStorageValue = localStorage.getItem(key);
          if (!personData[key] && (!$rootScope.data || !$rootScope.data[key])) {
            if (localStorageValue && localStorageValue != "") {
              personData[key] = localStorageValue;
              obj[key] = localStorageValue;
            }
          } else {
            localStorage.setItem(key, personData[key]);
          }
        });


        if (!angular.equals({}, personData)) {
          $rootScope.log(personData);
          $rootScope.personData = personData;
        }
        var date = new Date();
        Date.prototype.yyyymmdd = function () {
          var yyyy = this.getFullYear().toString();
          var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
          var dd = this.getDate().toString();
          return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/' + (dd[1] ? dd : "0" + dd[0]); // padding
        };
        obj.time = date.yyyymmdd();

        if (obj.url && obj.url.indexOf('billiongraves.com') > -1) {
          var $removeHash = obj.url.split('#');
          obj.url = $removeHash[0];
        }
        $rootScope.data = obj;

        var $date = new Date();
        if ($rootScope.data._ !== undefined) {
          var $dateVal = '/Date(' + $rootScope.data._ + ')/';
          $date = new Date(parseFloat($dateVal.substr(6)));
        }

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var months_full = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var year = $date.getFullYear();
        var month = months[$date.getMonth()];
        var month_full = months_full[$date.getMonth()];
        var date = $date.getDate();
        $rootScope.data.time = date + ' ' + month + '. ' + year;
        $rootScope.data.year = $date.getFullYear();
        $rootScope.data.month = months[$date.getMonth()];
        $rootScope.data.month_full = months_full[$date.getMonth()];
        $rootScope.data.date = $date.getDate();

        if ($rootScope.data.url && $rootScope.data.url !== '') {
          if ($rootScope.data.url.indexOf('ancestry') > -1) {
            $rootScope.data.url = $rootScope.data.url.replace(
              'ancestryinstitution.com', 'ancestry.com'
            ).replace('ancestrylibrary.com', 'ancestry.com').replace(
              'ancestrylibrary.proquest.com', 'ancestry.com'
            ).replace('ancestryclassroom.com', 'ancestry.com').replace(
              'ancestrylibrary.proquest.com', 'ancestry.com'
            );
          }
          // Clean up the Ancestry search URLs
          if ($rootScope.data.url && ($rootScope.data.url.indexOf(
            'www.ancestry.') > -1 || $rootScope.data.url.indexOf('search.ancestry.') > -1)) {
            var urlData = RecordSeek.helpers.decodeQueryString($rootScope.data.url);
            var $x = urlData['dbid'] ? 'dbid' : 'db';
            var newURL = {
              indiv: 'try',
              h: urlData['h'],
            };
            newURL[$x] = urlData[$x];

            $rootScope.data.url = RecordSeek.helpers.appendQueryParameters(
              RecordSeek.helpers.removeQueryString($rootScope.data.url), newURL
            );
          }

          var publisher = '';
          if (!$rootScope.data.title) $rootScope.data.title = '';
          var title = $rootScope.data.title.split('|')[0];

          var split_key = '';
          if ($rootScope.data.title.includes('|')) {
            split_key = '|';
          } else if ($rootScope.data.title.includes('-')) {
            split_key = '-';
          } else if ($rootScope.data.title.includes(';')) {
            split_key = ';';
          }

          if (split_key != '') {
            var title_split = $rootScope.data.title.split(split_key);
            publisher = title_split[title_split.length - 1];
            title = title.replace(split_key + publisher, '');
            title = title.replace(split_key + ' ' + publisher, '').trim();
          }
          if (title.includes('"')) {
            title = title.replace(new RegExp('"', 'g'), "'");
          }
          if (title.includes($rootScope.data.url)) {
            title = title.replace($rootScope.data.url, '');
          }
          $rootScope.data.title = title;
          if (publisher === '') {
            publisher = $rootScope.data.url.replace('http://','').replace('www.','').replace('https://','').split(/[/?#]/)[0].split('.')[0];
          }
          $rootScope.data.publisher = publisher.charAt(0).toUpperCase() + publisher.slice(1);

          // if ($rootScope.data.url && $rootScope.data.url.indexOf('billiongraves.com') > -1) {
          //           //   var $split = $rootScope.data.url.split('/');
          //           //   $rootScope.data.citation = '"Billion Graves Record," BillionGraves (' + $rootScope.data.url + ' accessed ' + $rootScope.data.time + '), ' + $rootScope.data.title + ' Record #' + $split[($split.length - 1)] + '. Citing BillionGraves, Headstones, BillionGraves.com.';
          //           // }

          if ($rootScope.data.url) {
            var $dSplit = $rootScope.data.url.split('//');
            var $domain = $dSplit[1];
            if ($domain) {
              $dSplit = $domain.replace('www.', '').split('/')[0];

              $rootScope.data.domain = $dSplit.charAt(0).toUpperCase() + $dSplit.slice(1);
              $rootScope.track(
                {
                  eventCategory: 'Domain',
                  eventAction: $rootScope.data.domain.toLowerCase().replace('www.', '')
                }
              );
            }
          }
        }
        if ($rootScope.data.notes) {
          $rootScope.data.notes = $rootScope.data.notes.trim().replace('#/fs-source', '');
        }

        if ($rootScope.data.notes && $rootScope.data.notes.trim() !== '') {
          $rootScope.data.notes += '\n\n';
        } else {
          $rootScope.data.notes = '';
        }
        if ($rootScope.data.notes.indexOf($rootScope.attachMsg) === -1) {
          $rootScope.data.notes += $rootScope.attachMsg;
        }
        if (!$rootScope.data.title) {
          $rootScope.data.title = '';
        }
        if (!$rootScope.data.citation) {
          $rootScope.data.citation = '';
        }
        $rootScope.generateCitation();
      } else {
        if ((document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com') && !$rootScope.data) {
          //$rootScope.data = angular.fromJson( $cookie.get( 'recordseek' ) );
        }
      }

      $rootScope.$on(
        '$routeChangeSuccess', function () {
          if ((document.location.origin !== 'http://recordseek.com' && document.location.origin !== 'https://recordseek.com')) {
            if ($rootScope.data) {
              if ($location.$$path !== '/about' && $location.$$path !== '/support' && $location.$$path !== '/expired' && $rootScope.data) {
                //var date = new Date(),
                //    $exp = new Date( date );
                //$exp.setMinutes( date.getMinutes() + $rootScope.expires );
                //$cookie.put(
                //    'recordseek', angular.toJson( $rootScope.data ), {
                //        expires: $exp
                //    }
                //);
              }
            }

          }
        }
      );

      if (!$rootScope.data) {
        $rootScope.data = {};
      }

      if (!$rootScope.data.addPerson) {
        $rootScope.data.addPerson = {};
      }

      $rootScope.auth = {};

      var advanced = '';
      $rootScope.resetSearch = function ($data) {
        if ($rootScope.data.search && $rootScope.data.search.advanced) {
          advanced = $rootScope.data.search.advanced;
        }
        var $blank = {
          givenName: '',
          givenNameExact: '',
          surname: '',
          surnameExact: '',
          gender: '',
          eventType: '',
          eventDate: '',
          eventDateFrom: '',
          eventDateTo: '',
          eventPlace: '',
          eventPlaceExact: '',
          spouseGivenName: '',
          spouseGivenNameExact: '',
          spouseSurname: '',
          spouseSurnameExact: '',
          motherGivenName: '',
          motherGivenNameExact: '',
          motherSurname: '',
          motherSurnameExact: '',
          fatherGivenName: '',
          fatherGivenNameExact: '',
          fatherSurname: '',
          fatherSurnameExact: '',
          pid: '',
          status: '',
        };
        if (advanced !== '') {
          $blank.advanced = advanced;
        } else {
          advanced = false;
        }
        if ($data) {
          return $blank;
        } else {
          $rootScope.data.search = $blank;
        }
      };

      $rootScope.tagCounting = function () {
        var count = 0;
        angular.forEach(
          $rootScope.data.tags, function (value, key) {
            if (value === true) {
              count++;
            }
          }, count
        );
        if (count === 0) {
          count = '';
        }
        $rootScope.tagCount = count;
      }
      $rootScope.tagCounting();

      $rootScope.closeTags = function () {
        $timeout(
          function () {
            angular.element('#sourceTags').trigger('click');
          }, 0
        );
      };

      if (!$rootScope.data.search) {
        $rootScope.resetSearch();
        $rootScope.data.search.advanced = false;
        if ($rootScope.personData && !angular.equals({}, $rootScope.personData)) {
          for (var prop in $rootScope.personData) {
            $rootScope.personData[prop];
            if ($rootScope.data.search.hasOwnProperty(prop) !== -1) {
              $rootScope.data.search[prop] = $rootScope.personData[prop];
            }
          }
        }
      }
    }]
  )
  .constant('_', _)
  .config(
    ["$provide", "$routeProvider", function ($provide, $routeProvider) {
      $provide.decorator(
        "$exceptionHandler", ["$delegate", "$window", function ($delegate, $window) {
          return function (exception, cause) {
            if ($window.trackJs) {
              $window.trackJs.track(exception);
            }
            // (Optional) Pass the error through to the delegate formats it for the console
            $delegate(exception, cause);
          };
        }]
      )
      $routeProvider
        .when(
          '/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
            //templateUrl: 'views/fs-source.html',
            //controller: 'FsSourceCtrl'
          }
        )
        .when(
          '/about', {

            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
          }
        )
        .when(
          '/loading', {
            templateUrl: 'views/loading.html',
            controller: 'LoadingCtrl'
          }
        )
        .when(
          '/support', {
            templateUrl: 'views/support.html',
            controller: 'SupportCtrl'
          }
        )
        .when(
          '/fs-source', {
            templateUrl: 'views/fs-source.html',
            controller: 'FsSourceCtrl'
          }
        )
        .when(
          '/fs-upload', {
            templateUrl: 'views/fs-upload.html',
            controller: 'FsUploadCtrl'
          }
        )
        .when(
          '/fs-search', {
            templateUrl: 'views/fs-search.html',
            controller: 'FsSearchCtrl'
          }
        )
        .when(
          '/fs-addperson', {
            templateUrl: 'views/fs-addperson.html',
            controller: 'FsAddpersonCtrl'
          }
        )
        .when(
          '/fs-attach', {
            templateUrl: 'views/fs-attach.html',
            controller: 'FsAttachCtrl'
          }
        )
        .when(
          '/fs-addattach', {
            templateUrl: 'views/fs-addattach.html',
            controller: 'FsAddAttachCtrl'
          }
        )
        .when(
          '/fs-complete', {
            templateUrl: 'views/fs-complete.html',
            controller: 'FsCompleteCtrl'
          }
        )
        .when(
          '/a-source', {
            templateUrl: 'views/a-source.html',
            controller: 'ASourceCtrl'
          }
        )

        .when(
          '/fs-results', {
            templateUrl: 'views/fs-results.html',
            controller: 'FsResultsCtrl'
          }
        )
        .when(
          '/fs-create', {
            templateUrl: 'views/fs-create.html',
            controller: 'FsCreateCtrl'
          }
        )
        .otherwise(
          {
            redirectTo: '/'
          }
        )
    }]
  )
  .factory('RequestsErrorHandler', ['$q', function ($q) {
    return {
      // --- The user's API for claiming responsiblity for requests ---
      specificallyHandled: function (specificallyHandledBlock) {
        specificallyHandleInProgress = true;
        try {
          return specificallyHandledBlock();
        } finally {

          specificallyHandleInProgress = false;
        }
      },

      // --- Response interceptor for handling errors generically ---
      responseError: function (rejection) {
        var shouldHandle = (rejection && rejection.config && rejection.config.headers
          && rejection.config.headers[HEADER_NAME]);
        alert("response Error")
        if (shouldHandle) {
          alert("An error occured");
          console.log(rejection)
          // --- Your generic error handling goes here ---
        }

        return $q.reject(rejection);
      }
    };
  }])
  .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
    $httpProvider.interceptors.push('RequestsErrorHandler');

    // --- Decorate $http to add a special header by default ---

    function addHeaderToConfig(config) {
      config = config || {};
      config.headers = config.headers || {};

      // Add the header unless user asked to handle errors himself
      if (!specificallyHandleInProgress) {
        config.headers[HEADER_NAME] = true;
      }

      return config;
    }

    // The rest here is mostly boilerplate needed to decorate $http safely
    $provide.decorator('$http', ['$delegate', function ($delegate) {
      function decorateRegularCall(method) {
        return function (url, config) {
          return $delegate[method](url, addHeaderToConfig(config));
        };
      }

      function decorateDataCall(method) {
        return function (url, data, config) {
          return $delegate[method](url, data, addHeaderToConfig(config));
        };
      }

      function copyNotOverriddenAttributes(newHttp) {
        for (var attr in $delegate) {
          if (!newHttp.hasOwnProperty(attr)) {
            if (typeof ($delegate[attr]) === 'function') {
              newHttp[attr] = function () {
                return $delegate[attr].apply($delegate, arguments);
              };
            } else {
              newHttp[attr] = $delegate[attr];
            }
          }
        }
      }

      var newHttp = function (config) {
        return $delegate(addHeaderToConfig(config));
      };

      newHttp.get = decorateRegularCall('get');
      newHttp.delete = decorateRegularCall('delete');
      newHttp.head = decorateRegularCall('head');
      newHttp.jsonp = decorateRegularCall('jsonp');
      newHttp.post = decorateDataCall('post');
      newHttp.put = decorateDataCall('put');

      copyNotOverriddenAttributes(newHttp);

      return newHttp;
    }]);
  }]);
;
