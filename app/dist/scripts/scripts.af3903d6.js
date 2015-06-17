"use strict";angular.module("recordseekApp",["ngAnimate","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap"]).run(["$rootScope","$location","$cookies","$window",function(a,b,c,d){if(a.debug=!1,a.service="",a.expires=15,window.liveSettings={api_key:"11643e1c6ccd4371bfb889827b19fde3",picker:"#languagePicker",detectlang:!0,dynamic:!0,autocollect:!0,staging:!0},b.$$absUrl.indexOf("?_")>-1&&-1===b.$$absUrl.indexOf("/#")){var e=b.$$absUrl.replace("?_","#/?_");return void(d.location.href=e)}if(a.sourceBoxURL="https://familysearch.org/links-gadget/linkpage.jsp?referrer=/links-gadget/linkpage.jsp#sbp",b.$$search&&b.$$search.url){var f=b.$$search;for(var g in f){var h=f[g],i=typeof h;null!==h&&"string"===i&&f.hasOwnProperty(g)&&(f[g]=f[g].trim())}a.data=f,a.data.sourceFormat||(a.data.sourceFormat="MLA");var j="/Date("+a.data._+")/",k=new Date(parseFloat(j.substr(6))),l=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],m=k.getFullYear(),n=l[k.getMonth()],o=k.getDate();if(a.data.time=o+" "+n+". "+m,a.data.url&&""!==a.data.url){if(a.data.url.indexOf("ancestry")>-1&&(a.data.url=a.data.url.replace("ancestryinstitution.com","ancestry.com").replace("ancestrylibrary.com","ancestry.com").replace("ancestrylibrary.proquest.com","ancestry.com")),a.data.url.indexOf("billiongraves.com")>-1){var p=a.data.url.split("/");a.data.citation='"Billion Graves Record," BillionGraves ('+a.data.url+" accessed ".$rootScope.data.time+"), ".$rootScope.data.description+" Record #"+p[p.length-1]+". Citing BillionGraves, Headstones, BillionGraves.com."}else a.data.citation||(a.data.citation='"'+a.data.title+'." '+a.data.title+". N.p., n.d. Web. "+a.data.time+". <"+a.data.url+">.");var q=a.data.url.split("//"),r=q[1];q=r.split("/"),a.data.domain=q[0].charAt(0).toUpperCase()+q[0].slice(1),ga("send","event",{eventCategory:"Domain",eventAction:a.data.domain.toLowerCase().replace("www.","")})}a.data.notes&&""!==a.data.notes.trim()?a.data.notes+="\n\n":a.data.notes="",a.data.notes+="This source was created for free with http://RecordSeek.com.",a.data.title||(a.data.title=""),a.data.citation||(a.data.citation=""),a.data.notes||(a.data.notes="")}else"http://recordseek.com"===document.location.origin||"https://recordseek.com"===document.location.origin||a.data||(a.data=angular.fromJson(c.get("recordseek")));a.$on("$routeChangeSuccess",function(){if("http://recordseek.com"!==document.location.origin&&"https://recordseek.com"!==document.location.origin&&a.data&&"/about"!==b.$$path&&"/support"!==b.$$path&&"/expired"!==b.$$path&&a.data){var d=new Date,e=new Date(d);e.setMinutes(d.getMinutes()+a.expires),c.put("recordseek",angular.toJson(a.data),{expires:e})}}),a.data||(a.data={}),a.auth={};var s="";a.resetSearch=function(){a.data.search&&a.data.search.advanced&&(s=a.data.search.advanced),a.data.search={givenName:"",givenNameExact:"",surname:"",surnameExact:"",gender:"",eventType:"",eventDate:"",eventDateFrom:"",eventDateTo:"",eventPlace:"",eventPlaceExact:"",spouseGivenName:"",spouseGivenNameExact:"",spouseSurname:"",spouseSurnameExact:"",motherGivenName:"",motherGivenNameExact:"",motherSurname:"",motherSurnameExact:"",fatherGivenName:"",fatherGivenNameExact:"",fatherSurname:"",fatherSurnameExact:"",pid:""},""!==s&&(a.data.search.advanced=s)},a.data.search||(a.resetSearch(),a.data.search.advanced=!1),a.isEmpty=function(a){for(var b in a)if(a.hasOwnProperty(b))return!1;return!0},a.actionTaken=function(a){ga("send","event",{eventCategory:"Action",eventAction:a})}}]).constant("_",_).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/support",{templateUrl:"views/support.html",controller:"SupportCtrl"}).when("/fs-source",{templateUrl:"views/fs-source.html",controller:"FsSourceCtrl"}).when("/fs-upload",{templateUrl:"views/fs-upload.html",controller:"FsUploadCtrl"}).when("/fs-search",{templateUrl:"views/fs-search.html",controller:"FsSearchCtrl"}).when("/fs-addPerson",{templateUrl:"views/fs-addperson.html",controller:"FsAddpersonCtrl"}).when("/fs-attach",{templateUrl:"views/fs-attach.html",controller:"FsAttachCtrl"}).when("/fs-complete",{templateUrl:"views/fs-complete.html",controller:"FsCompleteCtrl"}).when("/a-source",{templateUrl:"views/a-source.html",controller:"ASourceCtrl"}).when("/fs-results",{templateUrl:"views/fs-results.html",controller:"FsResultsCtrl"}).when("/fs-create",{templateUrl:"views/fs-create.html",controller:"FsCreateCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("recordseekApp").controller("MainCtrl",["$scope","$rootScope",function(a,b){b.service=""}]);var init=function(){var a=800,b=675;window.resizeTo(a,b),window.moveTo(screen.width-a,(screen.height-b)/2)};init(),angular.module("recordseekApp").controller("AboutCtrl",["$rootScope",function(a){a.service=""}]),angular.module("recordseekApp").controller("SupportCtrl",["$rootScope",function(a){a.service=""}]),angular.module("recordseekApp").controller("FsSourceCtrl",["$cookies","$rootScope","$location","$scope","fsAPI",function(a,b,c,d,e){b.service="FamilySearch",e.getAccessToken().then(function(a){e.getCurrentUser().then(function(a){})}),d.origSource=b.data.citation,d.goNext=function(){c.path("/fs-search"),d.origSource!==b.data.citation&&ga("send","event",{eventCategory:"FamilySearch",eventAction:"Citation",eventLabel:"Modified"})},d.goBack=function(){b.service="",c.path("/")},d.goUpload=function(){c.path("/fs-upload")},d.createNow=function(){ga("send","event",{eventCategory:"FamilySearch",eventAction:"Create",eventLabel:"Now"}),c.path("/fs-create")}}]),angular.module("recordseekApp").controller("FsUploadCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("recordseekApp").controller("FsSearchCtrl",["$rootScope","$location","$scope","fsAPI","fsUtils",function(a,b,c,d,e){a.service="FamilySearch",d.getAccessToken().then(function(a){d.getCurrentUser().then(function(a){})}),a.data.search.advanced?c.advancedButtonText="Basic":c.advancedButtonText="Advanced",c.getLocation=function(){return d.getPlaceSearch(a.data.search.eventPlace,{count:"10"}).then(function(a){var b=a.getPlaces(),c=[];return angular.forEach(b,function(a){c.length<9&&this.push(a.$getNormalizedPlace())},c),c})},c.removeEmpty=e.removeEmptyProperties,c.advancedSearch=function(){a.data.search.advanced?(a.data.search.advanced=!1,c.advancedButtonText="Advanced"):(c.advancedButtonText="Basic",a.data.search.advanced=!0)},c.goNext=function(){b.path("/fs-results")},c.goBack=function(){b.path("/fs-source")}}]),angular.module("recordseekApp").controller("FsAddpersonCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("recordseekApp").controller("FsAttachCtrl",["$rootScope","$location","$scope","fsAPI",function(a,b,c,d){a.service="FamilySearch",d.getAccessToken().then(function(a){d.getCurrentUser().then(function(a){})}),a.data.attach||(a.data.search?b.path("/fs-results"):b.path("/fs-search")),a.data.attach.justification||(a.data.attach.justification=""),c.goBack=function(){b.path("/fs-results")},c.goNext=function(){b.path("/fs-create")}}]),angular.module("recordseekApp").controller("FsCompleteCtrl",["fsAPI","fsUtils","$rootScope","$scope","$location",function(a,b,c,d,e){c.service="FamilySearch",d.goSearch=function(){e.path("/fs-search")}}]),angular.module("recordseekApp").provider("fsAPI",["_",function(){this.environment="sandbox",("http://recordseek.com"===document.location.origin||"https://recordseek.com"===document.location.origin)&&(this.environment="production"),"sandbox"===this.environment?this.client_id="a0T3000000ByxnUEAR":this.client_id="S1M9-QH77-ZGJK-2HB1-MYZZ-6YN9-SBNQ-6YPS",this.redirect_uri=document.location.origin,"http://localhost:9000"!==document.location.origin&&(this.redirect_uri+="/share/"),this.removeEmptyProperties=function(a){return _.omit(a,function(a){return _.isEmpty(a)&&0!==a})},this.$get=["$window","$http","$q","$timeout","$rootScope",function(a,b,c,d,e){return this.client_id&&this.environment&&this.redirect_uri&&a.FamilySearch.init({client_id:this.client_id,environment:this.environment,redirect_uri:this.redirect_uri,http_function:b,deferred_function:c.defer,save_access_token:!0,auto_expire:!0,timeout_function:d,auto_signin:!0,expire_callback:function(){}}),a.FamilySearch.Person.prototype._isMale=function(){return this.gender&&"http://gedcomx.org/Male"===this.gender.type},a.FamilySearch}]}]),angular.module("recordseekApp").factory("fsAgentCache",["$q","fsAPI",function(a,b){var c={};return{getAgent:function(d){var e=d.substr(d.indexOf("?")+1);return c[e]?a.when(c[e]):b.getAgent(d).then(function(a){var b=a.getAgent();return c[e]=b,b})}}}]),angular.module("recordseekApp").factory("fsUtils",["_","$q","fsAPI","fsCurrentUserCache","fsAgentCache",function(a,b,c,d,e){return{mixinStateFunctions:function(a,c){function d(a,d){var e=[];d.forEach(function(a){var b=a(c);b&&b.then&&e.push(b)}),e.length&&(c._state="loading",b.all(e).then(function(){c._state=a}))}c._state=c._state||"closed",c._isOpen=function(){return"open"===this._state},c._isEditing=function(){return"editing"===this._state},c._exists=function(){return!!this.id},c._toggleOpen=function(){this._state="open"===this._state?"closed":"open"},c._open=function(){this._state="open"},c._close=function(){this._state="closed"},c._edit=function(){this._state="editing"},c._onOpen=function(a){c._onOpenCallbacks||(c._onOpenCallbacks=[]),c._onOpenCallbacks.push(a),"open"===c._state&&a(c)},c._onEdit=function(a){c._onEditCallbacks||(c._onEditCallbacks=[]),c._onEditCallbacks.push(a),"editing"===c._state&&a(c)},a.$watch(function(){return c._state},function(a){"open"===a&&c._onOpenCallbacks?d(a,c._onOpenCallbacks):"editing"===a&&c._onEditCallbacks&&d(a,c._onEditCallbacks)})},copyItemStates:function(b,c){a.forEach(c,function(c){var d=a.find(b,{id:c.id});d&&(c._state=d._state,c._onOpenCallbacks=d._onOpenCallbacks,c._onEditCallbacks=d._onEditCallbacks)})},agentSetter:function(a){return function(b){return b&&b.attribution&&b.attribution.$getAgentUrl()&&!a.agent?e.getAgent(b.attribution.$getAgentUrl()).then(function(b){a.agent=b}):null}},getItemTag:function(a){return a instanceof c.Name?"http://gedcomx.org/Name":a instanceof c.Fact?a.type:"http://gedcomx.org/Gender"},findById:function(b,c){return a.find(b,function(a){return c?a.id===c:!a.id})},findElement:function(a,b){for(var c=a.find("span"),d=0,e=c.length;e>d;d++)if(c[d].className.indexOf(b)>=0)return angular.element(c[d]);return null},approximateAttribution:function(a){d.getUser().then(function(b){a.attribution.contributor={resourceId:b.treeUserId},a.attribution.modified=Date.now()})},encodeCustomFactType:function(a){return"data:,"+encodeURI(a)},allPromisesSerially:function(a,c){function d(e){return e<a.length?c(a[e]).then(function(){return d(e+1)}):b.when(null)}return d(0)},setConstructor:function(b,c){var d=Object.create(c.prototype);return a.extend(d,b),d},removeEmptyProperties:function(b){return a.omit(b,function(b){return a.isEmpty(b)&&0!==b})},getChildrenWithParentsId:function(b,c){return a.map(b,function(b){return{person:b,parentsId:a.find(c,function(a){return a.$getChildId()===b.id}).id}})},makeUrl:function(a){return a&&!a.match(/^https?:\/\//)?"http://"+a:a},removeQueryFromUrl:function(a){var b=a.indexOf("?");return b>=0?a.substr(0,b):a},refresh:function(b,c){for(var d in b)b.hasOwnProperty(d)&&"_"!==d.charAt(0)&&delete b[d];a.extend(b,c)},getSourceRefContexts:function(a,d,f){return a.$getSourceRefsQuery().then(function(a){function g(a){return d?e.getAgent(a.attribution.$getAgentUrl()):b.when(null)}var h=[];return a.getPersonSourceRefs().forEach(function(a){(0>=f||h.length<f)&&h.push(b.all([c.getPerson(a.$personId),g(a)]).then(function(b){return{sourceRef:a,person:b[0].getPerson(),agent:b[1]}}))}),a.getCoupleSourceRefs().forEach(function(a){(0>=f||h.length<f)&&h.push(b.all([c.getCouple(a.$coupleId,{persons:!0}),g(a)]).then(function(b){var c=b[0].getRelationship();return{sourceRef:a,couple:c,husband:b[0].getPerson(c.$getHusbandId()),wife:b[0].getPerson(c.$getWifeId()),agent:b[1]}}))}),a.getChildAndParentsSourceRefs().forEach(function(a){(0>=f||h.length<f)&&h.push(b.all([c.getChildAndParents(a.$childAndParentsId,{persons:!0}),g(a)]).then(function(b){var c=b[0].getRelationship();return{sourceRef:a,parents:c,child:b[0].getPerson(c.$getChildId()),father:c.$getFatherId()?b[0].getPerson(c.$getFatherId()):null,mother:c.$getMotherId()?b[0].getPerson(c.$getMotherId()):null,agent:b[1]}}))}),b.all(h)})}}}]),angular.module("recordseekApp").controller("ASourceCtrl",["$rootScope","$location","$scope","$window","$cookies",function(a,b,c,d,e){a.service="Ancestry",c.goNext=function(){e.remove("recordseek");var b="http://trees.ancestry.com/savetoancestry?o_sch=Web+Property";a.data.url&&(b+="&url="+encodeURIComponent(a.data.url)),a.data.domain&&(b+="&domain="+encodeURIComponent(a.data.domain)),a.data.title&&(b+="&collection="+encodeURIComponent(a.data.title)),a.data.citation&&(b+="&details="+encodeURIComponent(a.data.citation)),ga("send","event",{eventCategory:"Ancestry",eventAction:"Source",eventLabel:b}),d.location.href=b},c.goBack=function(){a.service="",b.path("/")}}]),angular.module("recordseekApp").controller("FsResultsCtrl",["$rootScope","$location","$scope","fsAPI","fsUtils",function(a,b,c,d,e){a.service="FamilySearch",c.goBack=function(){ga("send","event",{eventCategory:"FamilySearch",eventAction:"Search",eventLabel:"Refine"}),b.path("/fs-search")},c.goNext=function(c,d,e){ga("send","event",{eventCategory:"FamilySearch",eventAction:"Selected",eventLabel:c}),a.data.attach={pid:c,name:d,url:e,justification:""},b.path("/fs-attach")},c.pageChanged=function(){delete c.searchResults,c.getResults()},c.getResults=function(){function f(a){for(var b=[],c=0,d=a.length;d>c;c++)a[c].living||b.push({pid:a[c].id,url:a[c].$getPersistentIdentifier(),name:a[c].$getDisplayName(),gender:a[c].$getDisplayGender(),data:a[c]});return b}function g(a){return{pid:a.id,name:a.$getDisplayName(),birthDate:a.$getBirthDate(),gender:a.$getDisplayGender(),url:a.$getPersistentIdentifier(),birthPlace:a.$getBirthPlace(),deathDate:a.$getDeathDate(),deathPlace:a.$getDeathPlace()}}var h=angular.copy(a.data.search);h.eventDate="",h.eventType&&(h.eventDateFrom&&""!==h.eventDateFrom?(h.eventDate+=h.eventDateFrom,h.eventDateTo&&""!==h.eventDateTo&&h.eventDateFrom!==h.eventDateTo&&(h.eventDate+="-"+h.eventDateTo)):h.eventDateTo&&""!==h.eventDateTo&&(h.eventDate=h.eventDateTo),h[h.eventType+"Place"]=h.eventPlace,h[h.eventType+"Date"]=String(h.eventDate)+"~"),h.advanced===!0?(h.givenName+="1"!==h.givenNameExact&&""!==h.givenName?"~":"",h.surname+="1"!==h.surnameExact&&""!==h.surname?"~":"",h.spouseGivenName+="1"!==h.spouseGivenNameExact&&""!==h.spouseGivenName?"~":"",h.spouseSurname+="1"!==h.spouseSurnameExact&&""!==h.spouseSurname?"~":"",h.fatherGivenName+="1"!==h.fatherGivenNameExact&&""!==h.fatherGivenName?"~":"",h.fatherSurname+="1"!==h.fatherSurnameExact&&""!==h.fatherSurname?"~":"",h.motherGivenName+="1"!==h.motherGivenNameExact&&""!==h.motherGivenName?"~":"",h.motherSurname+="1"!==h.motherSurnameExact&&""!==h.motherSurname?"~":"",h.eventPlace+="1"!==h.eventPlaceExact&&""!==h.eventPlace?"~":""):(h.givenName=""!==h.givenName?h.givenName+"~":"",h.surname=""!==h.surname?h.surname+"~":"",h.spouseGivenName=""!==h.spouseGivenName?h.spouseGivenName+"~":"",h.spouseSurname=""!==h.spouseSurname?h.spouseSurname+"~":"",h.fatherGivenName=""!==h.fatherGivenName?h.fatherGivenName+"~":"",h.fatherSurname=""!==h.fatherSurname?h.fatherSurname+"~":"",h.motherGivenName=""!==h.motherGivenName?h.motherGivenName+"~":"",h.motherSurname=""!==h.motherSurname?h.motherSurname+"~":"",h.eventPlace=""!==h.eventPlace?h.eventPlace+"~":""),delete h.eventType,delete h.eventDate,delete h.eventDateFrom,delete h.eventDateTo,delete h.eventPlace,delete h.advanced,delete h.givenNameExact,delete h.surnameExact,delete h.spouseGivenNameExact,delete h.spouseSurnameExact,delete h.fatherGivenNameExact,delete h.fatherSurnameExact,delete h.motherGivenNameExact,delete h.motherSurnameExact,delete h.eventPlaceExact,h=e.removeEmptyProperties(h),0===Object.keys(h).length&&b.path("/fs-search"),c.context&&(h.context=c.context),c.min=15*c.currentPage-14,c.max=15*c.currentPage,c.min<1&&(c.min=1),c.bigTotalItems&&c.max>c.bigTotalItems&&(c.max=c.bigTotalItems),c.maxSize=5,d.getAccessToken().then(function(){h.pid&&""!==h.pid?d.getPersonWithRelationships(h.pid,{persons:!0}).then(function(a){c.searchResults=[];var b=a.getPrimaryPerson();if(b){c.bigTotalItems=c.max=1,c.index=0;var d=g(b);d.confidence=5,d.father=f(a.getFathers()),d.mother=f(a.getMothers()),d.spouse=f(a.getSpouses()),d.children=f(a.getChildren()),c.searchResults.push(d)}}):d.getPersonSearch(h).then(function(a){var b=a.getSearchResults();c.bigTotalItems=a.getResultsCount(),c.index=a.getIndex(),c.max>c.bigTotalItems&&(c.max=c.bigTotalItems),c.searchResults=[];for(var d=0,e=b.length;e>d;d++){var h=b[d],i=h.$getPrimaryPerson(),j=g(i);j.confidence=b[d].confidence,j.father=f(h.$getFathers()),j.mother=f(h.$getMothers()),j.spouse=f(h.$getSpouses()),j.children=f(h.$getChildren()),c.searchResults.push(j)}ga("send","event",{eventCategory:"FamilySearch",eventAction:"Search",eventLabel:"Results",eventValue:b.length})})})},c.currentPage=1,d.getAccessToken().then(function(a){c.getResults()})}]),angular.module("recordseekApp").service("rsData",function(){}),angular.module("recordseekApp").factory("fsCurrentUserCache",["$q","$rootScope","fsAPI",function(a,b,c){var d=null;return b.$on("newSession",function(){d=null}),{getUser:function(){return d?a.when(d):c.getCurrentUser().then(function(a){return d=a.getUser()})}}}]),angular.module("recordseekApp").directive("resize",["$window",function(a){return function(b){var c=angular.element(a);b.$watch(function(){return{h:c.height(),w:c.width()}},function(a){b.windowHeight=a.h,b.windowWidth=a.w,b.style=function(){return{height:a.h-100+"px",width:a.w-100+"px"}}},!0),c.bind("resize",function(){b.$apply()})}}]),angular.module("recordseekApp").controller("FsCreateCtrl",["fsAPI","fsUtils","$rootScope","$scope","$location",function(a,b,c,d,e){function f(){c.data.sourceDescription&&(c.data.attach||(c.data.complete="noAttachment",delete c.data.attach,e.path("/fs-complete"))),delete c.data.complete,d.status="Attaching Source to "+c.data.attach.name;var b=new a.SourceRef({$personId:c.data.attach.pid,sourceDescription:c.data.sourceDescription.id});return b.$save(c.data.attach.justification.trim()).then(function(a){b.id=a,ga("send","event",{eventCategory:"FamilySearch",eventAction:"Source Attached",eventLabel:a}),c.data.complete=c.data.attach,c.data.complete.sourceRef=b,delete c.data.attach,e.path("/fs-complete")})}c.service="FamilySearch",a.getAccessToken().then(function(e){a.getCurrentUser().then(function(e){if(!c.data.sourceDescription&&c.data.url){d.status="Generating Source";var g=new a.SourceDescription(b.removeEmptyProperties({about:c.data.url.trim()?c.data.url.trim():"",citation:c.data.citation.trim()?c.data.citation.trim():"",title:c.data.title.trim()?c.data.title.trim():"",text:c.data.notes.trim()?c.data.notes.trim():""}));g.$save(null,!0).then(function(){c.data.sourceDescription=g,ga("send","event",{eventCategory:"FamilySearch",eventAction:"Source Created",eventLabel:c.data.sourceDescription.id}),f()})}else ga("send","event",{eventCategory:"FamilySearch",eventAction:"Source Attached to Another"}),f()})})}]);