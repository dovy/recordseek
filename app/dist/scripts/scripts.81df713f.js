"use strict";var RecordSeek=RecordSeek||{};RecordSeek.helpers={isNotString:function(a){return"string"!=typeof a}},"addEventListener"in document&&document.addEventListener("DOMContentLoaded",function(){FastClick.attach(document.body)},!1),angular.module("recordseekApp",["ngAnimate","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap"]).run(["$rootScope","$location","$cookies","$window","fsAPI","$http","$log",function(a,b,c,d,e,f,g){f.defaults.useXDomain=!0,delete f.defaults.headers.common["X-Requested-With"],window.location.origin||(window.location.origin=window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:"")),document.location.origin||(document.location.origin=window.location.origin),a.helpers=RecordSeek.helpers,a.attachMsg="This source was created for free with http://RecordSeek.com",a.debug="production"==e.settings.environment||"beta"==e.settings.environment?!1:!0,a.debug||(ga("create","UA-16096334-10"),ga("send","pageview")),a.service="",a.log=function(b){a.debug&&g.debug(g)},a.logout=function(){"FamilySearch"===a.service&&(e.helpers.eraseAccessToken(!0),b.path("/"))},a.track=function(b){a.debug?a.log(b):ga("send","event",b)},a.actionTaken=function(c){var e=c.currentTarget.attributes;e["data-tracking"]&&a.track({eventCategory:"App",eventAction:e["data-tracking"].value}),e.target&&"_blank"===e.target.value?d.open(e["data-href"].value):b.path(e["data-href"].value)},a.expires=15,window.liveSettings={api_key:"11643e1c6ccd4371bfb889827b19fde3",picker:"#languagePicker",detectlang:!0,dynamic:!0,autocollect:!0,staging:!0};var h=e.helpers.decodeQueryString(document.URL);if(b.$$absUrl.indexOf("?_")>-1&&-1===b.$$absUrl.indexOf("/#"),a.sourceBoxURL="https://familysearch.org/links-gadget/linkpage.jsp?referrer=/links-gadget/linkpage.jsp#sbp",h){var i=h;for(var j in i){var k=i[j],l=typeof k;null!==k&&"string"===l&&i.hasOwnProperty(j)&&(i[j]=i[j].trim())}a.data=i,a.data.sourceFormat||(a.data.sourceFormat="MLA");var m="/Date("+a.data._+")/",n=new Date(parseFloat(m.substr(6))),o=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],p=n.getFullYear(),q=o[n.getMonth()],r=n.getDate();if(a.data.time=r+" "+q+". "+p,a.data.url&&""!==a.data.url){if(a.data.url.indexOf("ancestry")>-1&&(a.data.url=a.data.url.replace("ancestryinstitution.com","ancestry.com").replace("ancestrylibrary.com","ancestry.com").replace("ancestrylibrary.proquest.com","ancestry.com")),a.data.url.indexOf("search.ancestry.com")>-1){var s=e.helpers.decodeQueryString(a.data.url),t={};s.h&&(t.h=s.h),s.db&&(t.db=s.db),s.indiv&&(t.indiv=s.indiv),a.data.url=e.helpers.appendQueryParameters(e.helpers.removeQueryString(a.data.url),t)}if(a.data.url.indexOf("interactive.ancestry.com")>-1&&(a.data.url=e.helpers.removeQueryString(a.data.url)),a.data.url.indexOf("billiongraves.com")>-1){var u=a.data.url.split("/");a.data.citation='"Billion Graves Record," BillionGraves ('+a.data.url+" accessed ".$rootScope.data.time+"), ".$rootScope.data.description+" Record #"+u[u.length-1]+". Citing BillionGraves, Headstones, BillionGraves.com."}else a.data.citation||(a.data.citation='"'+a.data.title+'." '+a.data.title+". N.p., n.d. Web. "+a.data.time+". <"+a.data.url+">.");var v=a.data.url.split("//"),w=v[1];v=w.split("/"),a.data.domain=v[0].charAt(0).toUpperCase()+v[0].slice(1),a.track({eventCategory:"Domain",eventAction:a.data.domain.toLowerCase().replace("www.","")})}a.data.notes&&""!==a.data.notes.trim()?a.data.notes+="\n\n":a.data.notes="",a.data.notes+=a.attachMsg,a.data.title||(a.data.title=""),a.data.citation||(a.data.citation="")}else"http://recordseek.com"===document.location.origin||"https://recordseek.com"===document.location.origin||a.data||(a.data=angular.fromJson(c.get("recordseek")));a.$on("$routeChangeSuccess",function(){if("http://recordseek.com"!==document.location.origin&&"https://recordseek.com"!==document.location.origin&&a.data&&"/about"!==b.$$path&&"/support"!==b.$$path&&"/expired"!==b.$$path&&a.data){var d=new Date,e=new Date(d);e.setMinutes(d.getMinutes()+a.expires),c.put("recordseek",angular.toJson(a.data),{expires:e})}}),a.data||(a.data={}),a.data.addPerson||(a.data.addPerson={}),a.auth={};var x="";a.resetSearch=function(){a.data.search&&a.data.search.advanced&&(x=a.data.search.advanced),a.data.search={givenName:"",givenNameExact:"",surname:"",surnameExact:"",gender:"",eventType:"",eventDate:"",eventDateFrom:"",eventDateTo:"",eventPlace:"",eventPlaceExact:"",spouseGivenName:"",spouseGivenNameExact:"",spouseSurname:"",spouseSurnameExact:"",motherGivenName:"",motherGivenNameExact:"",motherSurname:"",motherSurnameExact:"",fatherGivenName:"",fatherGivenNameExact:"",fatherSurname:"",fatherSurnameExact:"",pid:""},""!==x&&(a.data.search.advanced=x)},a.data.search||(a.resetSearch(),a.data.search.advanced=!1)}]).constant("_",_).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/loading",{templateUrl:"views/loading.html",controller:"LoadingCtrl"}).when("/support",{templateUrl:"views/support.html",controller:"SupportCtrl"}).when("/fs-source",{templateUrl:"views/fs-source.html",controller:"FsSourceCtrl"}).when("/fs-upload",{templateUrl:"views/fs-upload.html",controller:"FsUploadCtrl"}).when("/fs-search",{templateUrl:"views/fs-search.html",controller:"FsSearchCtrl"}).when("/fs-addperson",{templateUrl:"views/fs-addperson.html",controller:"FsAddpersonCtrl"}).when("/fs-attach",{templateUrl:"views/fs-attach.html",controller:"FsAttachCtrl"}).when("/fs-addattach",{templateUrl:"views/fs-addattach.html",controller:"FsAddAttachCtrl"}).when("/fs-complete",{templateUrl:"views/fs-complete.html",controller:"FsCompleteCtrl"}).when("/a-source",{templateUrl:"views/a-source.html",controller:"ASourceCtrl"}).when("/fs-results",{templateUrl:"views/fs-results.html",controller:"FsResultsCtrl"}).when("/fs-create",{templateUrl:"views/fs-create.html",controller:"FsCreateCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("recordseekApp").controller("MainCtrl",["$scope","$rootScope",function(a,b){b.service=""}]);var init=function(){var a=800,b=675;window.resizeTo(a,b),window.moveTo(screen.width-a,(screen.height-b)/2)};angular.module("recordseekApp").controller("LoadingCtrl",["$rootScope",function(a){a.service=""}]),angular.module("recordseekApp").controller("AboutCtrl",["$rootScope",function(a){a.service=""}]),angular.module("recordseekApp").controller("SupportCtrl",["$rootScope",function(a){a.service=""}]),angular.module("recordseekApp").controller("FsSourceCtrl",["$cookies","$rootScope","$location","$scope","fsAPI",function(a,b,c,d,e,f){b.service="FamilySearch",d.fsLogout=function(){e.helpers.eraseAccessToken(!0),c.path("/")},e.getCurrentUser().then(function(a){d.user=a.getUser(),b.log(d.user)}),b.data.search.newPerson&&delete b.data.search.newPerson,d.origSource=b.data.citation,d.goNext=function(){c.path("/fs-search"),d.origSource!==b.data.citation&&b.track({eventCategory:"FamilySearch",eventAction:"Citation",eventLabel:"Modified"}),b.data.mooseroots&&!b.data.search.surname&&(b.data.search={birthDate:"June 3 1982",eventType:"birth",eventPlace:"Wasilla, Matanuska-Susitna, Alaska, United States",eventDateFrom:"1982",birthPlace:"Wasilla, Matanuska-Susitna, Alaska, United States",deathDate:"June 10, 2090",fatherGivenName:"Father Given",fatherSurname:"Father Surname",gender:"Male",givenName1:"Ryan",givenName:"Ryan",langTemplate:"Standard",motherGivenName:"Mother Given",motherSurname:"Mother Surname",spouseGivenName:"Spouse Given",spouseSurname:"Spouse Surname",status:"Deceased",suffix1:"Suffix",surname1:"Smith",surname:"Smith",title1:"Title"})},d.goBack=function(){b.service="",c.path("/")},d.goUpload=function(){c.path("/fs-upload")},d.createNow=function(){b.track({eventCategory:"FamilySearch",eventAction:"Create",eventLabel:"Now"}),c.path("/fs-create")}}]),angular.module("recordseekApp").controller("FsUploadCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("recordseekApp").controller("FsSearchCtrl",["$rootScope","$location","$scope","fsAPI","fsUtils",function(a,b,c,d,e){a.service="FamilySearch",d.getCurrentUser().then(function(b){a.user=b.getUser()}),a.data.search.advanced?c.advancedButtonText="Basic":c.advancedButtonText="Advanced",c.getLocation=e.getLocation,c.removeEmpty=e.removeEmptyProperties,c.advancedSearch=function(){a.data.search.advanced?(a.data.search.advanced=!1,c.advancedButtonText="Advanced"):(c.advancedButtonText="Basic",a.data.search.advanced=!0)},c.goNext=function(){b.path("/fs-results")},c.goBack=function(){b.path("/fs-source")}}]),angular.module("recordseekApp").controller("FsAddpersonCtrl",["$rootScope","$location","$scope","fsAPI","fsUtils",function(a,b,c,d,e){a.service="FamilySearch",d.getCurrentUser().then(function(b){a.user=b.getUser()}),a.data.search.givenName&&!a.data.search.givenName1&&(a.data.search.givenName1=a.data.search.givenName),a.data.search.surname&&!a.data.search.surname1&&(a.data.search.surname1=a.data.search.surname),"birth"!=a.data.search.eventType||a.data.search.birthDate||a.data.search.birthPlace||(a.data.search.birthPlace||(a.data.search.birthPlace=a.data.search.eventPlace),a.data.search.birthDate||!a.data.search.eventDateFrom&&!a.data.search.eventDateTo||(a.data.search.eventDateFrom&&a.data.search.eventDateTo?a.data.search.eventDateFrom==a.data.search.eventDateTo?a.data.search.birthDate=a.data.search.eventDateFrom:a.data.search.birthDate=a.data.search.eventDateFrom+"-"+a.data.search.eventDateTo:a.data.search.eventDateFrom?a.data.search.birthDate=a.data.search.eventDateFrom:a.data.search.eventDateTo&&(a.data.search.birthDate=a.data.search.eventDateTo))),"death"!=a.data.search.eventType||a.data.search.deathDate||a.data.search.deathPlace||(a.data.search.deathPlace||(a.data.search.deathPlace=a.data.search.eventPlace),a.data.search.deathDate||!a.data.search.eventDateFrom&&!a.data.search.eventDateTo||(a.data.search.eventDateFrom&&a.data.search.eventDateTo?a.data.search.eventDateFrom==a.data.search.eventDateTo?a.data.search.deathDate=a.data.search.eventDateFrom:a.data.search.deathDate=a.data.search.eventDateFrom+"-"+a.data.search.eventDateTo:a.data.search.eventDateFrom?a.data.search.deathDate=a.data.search.eventDateFrom:a.data.search.eventDateTo&&(a.data.search.deathDate=a.data.search.eventDateTo)),(a.data.search.deathPlace||a.data.search.deathDate)&&(a.data.search.status="Deceased")),a.data.search.langTemplate||(a.data.search.langTemplate="Standard"),(a.data.search.motherGiven||a.data.search.motherSurname||a.data.search.fatherGiven||a.data.search.fatherSurname||a.data.search.spouseGiven||a.data.search.spouseSurname)&&(c.isCollapsed=!0),a.data.search.gender||(a.data.search.gender="Unknown"),c.langTemplates=["Standard","Spanish","Portuguese","Cyrillic","Chinese","Japanese","Khmer","Korean","Mongolian","Thai","Vietnamese"],c.status={isopen:!1},c.toggleDropdown=function(a){a.preventDefault(),a.stopPropagation(),c.status.isopen=!c.status.isopen},c.changeTemplate=function(b){a.data.search.langTemplate=b,"Cyrillic"==b?(c.title1="Cyrillic",c.title2="Roman"):"Chinese"==b?(c.title1="Hanzi",c.title2="Roman"):"Japanese"==b?(c.title1="Kanji",c.title2="Kana",c.title3="Roman"):"Khmer"==b?(c.title1="Khmer",c.title2="Roman"):"Korean"==b?(c.title1="Hangul",c.title2="Hanja",c.title3="Roman"):"Mongolian"==b?(c.title1="Mongolian",c.title2="Roman"):"Thai"==b?(c.title1="Thai",c.title2="Roman"):"Vietnamese"==b&&(c.title1="Vietnamese",c.title2="Roman")},c.getLocation=e.getLocation,c.removeEmpty=e.removeEmptyProperties,c.getDate=e.getDate,c.goNext=function(){a.data.search.newPerson=1,b.path("/fs-addattach")},c.goBack=function(){b.path("/fs-search")}}]),angular.module("recordseekApp").controller("TypeaheadCtrl",["$scope","$http","fsAPI","fsUtils",function(a,b,c,d){a.selected=void 0,a.states=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],a.getLocation=function(a){return c.getDate(a).then(function(a){var b=a.getDate();if(b.normalized){var c=[];return c.push({normalized:b.normalized,formal:b.$getFormalDate()}),c}})},a.statesWithFlags=[{normalized:"1910",formal:"+1910"}]}]),angular.module("recordseekApp").controller("FsAddAttachCtrl",["$rootScope","$location","$scope","fsAPI",function(a,b,c,d,e){a.service="FamilySearch",d.getCurrentUser().then(function(b){a.fsUser=b.getUser()}),a.log(a.data.search),a.toCreate=[];var f="";a.data.search.langTemplate&&("Cyrillic"==a.data.search.langTemplate?(f={title:"Name",sub:"Cyrillic",value:""},a.data.search.title1&&(f.value+=a.data.search.title1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),a.data.search.suffix1&&(f.value+=a.data.search.suffix1),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.title2&&(f.value+=a.data.search.title2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),a.data.search.suffix2&&(f.value+=a.data.search.suffix2),""!==f.value&&a.toCreate.push(f)):"Chinese"==a.data.search.langTemplate?(f={title:"Name",sub:"Hanzi",value:""},a.data.search.title1&&(f.value+=a.data.search.title1+" "),a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.suffix1&&(f.value+=a.data.search.suffix1),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.title2&&(f.value+=a.data.search.title2+" "),a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),a.data.search.suffix2&&(f.value+=a.data.search.suffix2),""!==f.value&&a.toCreate.push(f)):"Japanese"==a.data.search.langTemplate?(f={title:"Name",sub:"Kanji",value:""},a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.suffix1&&(f.value+=a.data.search.suffix1),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Kana",value:""},a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),a.data.search.suffix2&&(f.value+=a.data.search.suffix2),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.surname3&&(f.value+=a.data.search.surname3+" "),a.data.search.givenName3&&(f.value+=a.data.search.givenName3+" "),a.data.search.suffix3&&(f.value+=a.data.search.suffix3),""!==f.value&&a.toCreate.push(f)):"Khmer"==a.data.search.langTemplate?(f={title:"Name",sub:"Khmer",value:""},a.data.search.title1&&(f.value+=a.data.search.title1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),a.data.search.suffix1&&(f.value+=a.data.search.suffix1),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.title2&&(f.value+=a.data.search.title2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),a.data.search.suffix2&&(f.value+=a.data.search.suffix2),""!==f.value&&a.toCreate.push(f)):"Korean"==a.data.search.langTemplate?(f={title:"Name",sub:"Hangul",value:""},a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.suffix1&&(f.value+=a.data.search.suffix1),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Hanja",value:""},a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),a.data.search.suffix2&&(f.value+=a.data.search.suffix2),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.surname3&&(f.value+=a.data.search.surname3+" "),a.data.search.givenName3&&(f.value+=a.data.search.givenName3+" "),a.data.search.suffix3&&(f.value+=a.data.search.suffix3),""!==f.value&&a.toCreate.push(f)):"Mongolian"==a.data.search.langTemplate?(f={title:"Name",sub:"Mongolian",value:""},a.data.search.title1&&(f.value+=a.data.search.title1+" "),a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.title2&&(f.value+=a.data.search.title2+" "),a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),""!==f.value&&a.toCreate.push(f)):"Thai"==a.data.search.langTemplate?(f={title:"Name",sub:"Thai",value:""},a.data.search.title1&&(f.value+=a.data.search.title1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.title2&&(f.value+=a.data.search.title2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),""!==f.value&&a.toCreate.push(f)):"Vietnamese"==a.data.search.langTemplate?(f={title:"Name",sub:"Vietnamese",value:""},a.data.search.title1&&(f.value+=a.data.search.title1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),""!==f.value&&a.toCreate.push(f),f={title:"Name",sub:"Roman",value:""},a.data.search.title2&&(f.value+=a.data.search.title2+" "),a.data.search.givenName2&&(f.value+=a.data.search.givenName2+" "),a.data.search.surname2&&(f.value+=a.data.search.surname2+" "),""!==f.value&&a.toCreate.push(f)):(f={title:"Name",value:""},a.data.search.title1&&(f.value+=a.data.search.title1+" "),a.data.search.givenName1&&(f.value+=a.data.search.givenName1+" "),a.data.search.surname1&&(f.value+=a.data.search.surname1+" "),a.data.search.suffix1&&(f.value+=a.data.search.suffix1),a.toCreate.push(f))),a.data.search.gender&&a.toCreate.push({title:"Gender",value:a.data.search.gender}),(a.data.search.birthDate||a.data.search.birthPlace)&&(f={title:"Birth",value:""},a.data.search.birthDate&&(a.data.search.birthDate.normalized?f.value+=a.data.search.birthDate.normalized:f.value+=a.data.search.birthDate),a.data.search.birthPlace&&(a.data.search.birthDate&&(f.value+="<br />"),f.value+=a.data.search.birthPlace),a.toCreate.push(f)),(a.data.search.deathDate||a.data.search.deathPlace)&&"Living"!=a.data.search.status?(f={title:"Death",value:""},a.data.search.deathDate&&(a.data.search.deathDate.normalized?f.value+=a.data.search.deathDate.normalized:f.value+=a.data.search.deathDate),a.data.search.deathPlace&&(a.data.search.deathDate&&(f.value+="<br />"),f.value+=a.data.search.deathPlace),a.toCreate.push(f)):a.data.search.status&&a.toCreate.push({title:"Death",value:'<span class="text-muted">'+a.data.search.status+"</span>"}),c.goBack=function(){b.path("/fs-addperson")},c.goNext=function(){b.path("/fs-complete")}}]),angular.module("recordseekApp").controller("FsAttachCtrl",["$rootScope","$location","$scope","fsAPI",function(a,b,c,d){a.service="FamilySearch",d.getCurrentUser().then(function(b){a.fsUser=b.getUser()}),a.data.attach||(a.data.search?b.path("/fs-results"):b.path("/fs-search")),a.data.attach.justification||(a.data.attach.justification=""),c.goBack=function(){b.path("/fs-results")},c.goNext=function(){b.path("/fs-create")}}]),angular.module("recordseekApp").controller("FsCompleteCtrl",["fsAPI","$rootScope","$scope","$location",function(a,b,c,d){b.service="FamilySearch",console.log(b.data),c.goSearch=function(){d.path("/fs-search")}}]),angular.module("recordseekApp").provider("fsAPI",["_",function(a){this.environment="sandbox","http://recordseek.com"===document.location.origin?this.environment="production":"http://localhost:9000"!==document.location.origin?this.environment="sandbox":this.environment="beta","http://recordseeknew.dev"===document.location.origin||"https://recordseeknew.dev"===document.location.origin,"sandbox"===this.environment?this.client_id="a0T3000000ByxnUEAR":this.client_id="S1M9-QH77-ZGJK-2HB1-MYZZ-6YN9-SBNQ-6YPS",this.redirect_uri=document.location.origin,"http://localhost:9000"!==document.location.origin&&(this.redirect_uri+="/share/"),this.$get=["$window","$http","$q","$timeout","$rootScope","$injector","$location",function(a,b,c,d,e,f,g){if(this.client_id&&this.environment&&this.redirect_uri&&(this.getEnvironment=function(){return this.environment},b.defaults.useXDomain=!0,delete b.defaults.headers.common["X-Requested-With"],this.client=new FamilySearch({client_id:this.client_id,environment:this.environment,redirect_uri:this.redirect_uri,http_function:b,deferred_function:c.defer,save_access_token:!0,auto_expire:!0,timeout_function:d,expire_callback:function(a){var b=a.helpers.decodeQueryString(document.URL);(!b||b&&!b.code&&!b.state)&&a.getOAuth2AuthorizeURL(window.location.href).then(function(a){window.location=a})}}),this.urlParams=this.client.helpers.decodeQueryString(document.URL),this.urlParams.code&&this.urlParams.state)){e.status="Authenticating, please wait.",g.path("/loading");var h=this.urlParams.state.split("#");h=h[0]+="#/fs-source",this.client.getAccessToken(this.urlParams.code).then(function(){window.location=h})}return this.client}]}]),angular.module("recordseekApp").controller("ASourceCtrl",["$rootScope","$location","$scope","$window","$cookies",function(a,b,c,d,e){a.service="Ancestry",c.goNext=function(){a.debug&&e.remove("recordseek");var b="http://trees.ancestry.com/savetoancestry?o_sch=Web+Property";a.data.url&&(b+="&url="+encodeURIComponent(a.data.url)),a.data.domain&&(b+="&domain="+encodeURIComponent(a.data.domain)),a.data.title&&(b+="&collection="+encodeURIComponent(a.data.title)),a.data.citation&&(b+="&details="+encodeURIComponent(a.data.citation)),a.track({eventCategory:"Ancestry",eventAction:"Source",eventLabel:b}),d.location.href=b},c.goBack=function(){a.service="",b.path("/")}}]),angular.module("recordseekApp").controller("FsResultsCtrl",["$rootScope","$location","$scope","fsAPI","fsUtils",function(a,b,c,d,e){a.service="FamilySearch",d.getCurrentUser().then(function(b){a.user=b.getUser()}),c.bigTotalItems=0,c.index=1,c.currentPage=2,c.maxSize=0,c.numPages=1,c.goBack=function(){a.track({eventCategory:"FamilySearch",eventAction:"Search",eventLabel:"Refine"}),b.path("/fs-search")},c.addPerson=function(){angular.equals({},a.data.search)?b.path("/fs-addperson"):b.path("/fs-addattach")},c.goNext=function(c,d,e){a.track({eventCategory:"FamilySearch",eventAction:"Selected",eventLabel:c}),a.data.attach={pid:c,name:d,url:e,justification:""},b.path("/fs-attach")},c.pageChanged=function(){delete c.searchResults,c.getResults()},c.getResults=function(){var f=angular.copy(a.data.search);f.eventDate="",f.eventType&&(f.eventDateFrom&&""!==f.eventDateFrom?(f.eventDate+=f.eventDateFrom,f.eventDateTo&&""!==f.eventDateTo&&f.eventDateFrom!==f.eventDateTo&&(f.eventDate+="-"+f.eventDateTo)):f.eventDateTo&&""!==f.eventDateTo&&(f.eventDate=f.eventDateTo),f[f.eventType+"Place"]=f.eventPlace,f[f.eventType+"Date"]=String(f.eventDate)+"~"),f.advanced===!0?(f.givenName+="1"!==f.givenNameExact&&""!==f.givenName?"~":"",f.surname+="1"!==f.surnameExact&&""!==f.surname?"~":"",f.spouseGivenName+="1"!==f.spouseGivenNameExact&&""!==f.spouseGivenName?"~":"",f.spouseSurname+="1"!==f.spouseSurnameExact&&""!==f.spouseSurname?"~":"",f.fatherGivenName+="1"!==f.fatherGivenNameExact&&""!==f.fatherGivenName?"~":"",f.fatherSurname+="1"!==f.fatherSurnameExact&&""!==f.fatherSurname?"~":"",f.motherGivenName+="1"!==f.motherGivenNameExact&&""!==f.motherGivenName?"~":"",f.motherSurname+="1"!==f.motherSurnameExact&&""!==f.motherSurname?"~":"",f.eventPlace+="1"!==f.eventPlaceExact&&""!==f.eventPlace?"~":""):(f.givenName=""!==f.givenName?f.givenName+"~":"",f.surname=""!==f.surname?f.surname+"~":"",f.spouseGivenName=""!==f.spouseGivenName?f.spouseGivenName+"~":"",f.spouseSurname=""!==f.spouseSurname?f.spouseSurname+"~":"",f.fatherGivenName=""!==f.fatherGivenName?f.fatherGivenName+"~":"",f.fatherSurname=""!==f.fatherSurname?f.fatherSurname+"~":"",f.motherGivenName=""!==f.motherGivenName?f.motherGivenName+"~":"",f.motherSurname=""!==f.motherSurname?f.motherSurname+"~":"",f.eventPlace=""!==f.eventPlace?f.eventPlace+"~":""),delete f.eventType,delete f.eventDate,delete f.eventDateFrom,delete f.eventDateTo,delete f.eventPlace,delete f.advanced,delete f.givenNameExact,delete f.surnameExact,delete f.spouseGivenNameExact,delete f.spouseSurnameExact,delete f.fatherGivenNameExact,delete f.fatherSurnameExact,delete f.motherGivenNameExact,delete f.motherSurnameExact,delete f.eventPlaceExact,f=e.removeEmptyProperties(f),0!==Object.keys(f).length||a.debug||b.path("/fs-search"),c.context&&(f.context=c.context),c.min=15*c.currentPage-14,c.max=15*c.currentPage,c.min<1&&(c.min=1),c.bigTotalItems&&c.max>c.bigTotalItems&&(c.max=c.bigTotalItems),c.maxSize=5,c.bigTotalItems=0,c.index=0,c.max=0,f.pid&&""!==f.pid?d.getPersonWithRelationships(f.pid,{persons:!0}).then(function(a){c.searchResults=[];var b=a.getPrimaryPerson();if(b){c.bigTotalItems=c.max=1;var d=e.getPrimaryPerson(b);d.confidence=5,d.father=e.getRelativeData(a.getFathers()),d.mother=e.getRelativeData(a.getMothers()),d.spouse=e.getRelativeData(a.getSpouses()),d.children=e.getRelativeData(a.getChildren()),c.searchResults.push(d)}}):d.getPersonSearch(f).then(function(b){c.searchResults=[];var d=b.getSearchResults();c.bigTotalItems=b.getResultsCount(),c.index=b.getIndex(),c.max>c.bigTotalItems&&(c.max=c.bigTotalItems),a.log("Record length: "+d.length);for(var f=0,g=d.length;g>f;f++){var h=d[f],i=h.$getPrimaryPerson(),j=e.getPrimaryPerson(i);j.confidence=d[f].confidence,j.father=e.getRelativeData(h.$getFathers()),j.mother=e.getRelativeData(h.$getMothers()),j.spouse=e.getRelativeData(h.$getSpouses()),j.children=e.getRelativeData(h.$getChildren()),c.searchResults.push(j)}a.log(c.searchResults),a.track({eventCategory:"FamilySearch",eventAction:"Search",eventLabel:"Results",eventValue:d.length})})},c.currentPage=1,c.getResults()}]),angular.module("recordseekApp").directive("resize",["$window",function(a){return function(b){var c=angular.element(a);b.$watch(function(){return{h:c.height(),w:c.width()}},function(a){b.windowHeight=a.h,b.windowWidth=a.w,b.style=function(){return{height:a.h-100+"px",width:a.w-100+"px"}}},!0),c.bind("resize",function(){b.$apply()})}}]),angular.module("recordseekApp").controller("FsCreateCtrl",["fsAPI","$rootScope","$scope","$location","fsUtils",function(a,b,c,d,e){function f(){b.data.sourceDescription&&(b.data.attach||(b.data.complete="noAttachment",delete b.data.attach,d.path("/fs-complete"))),delete b.data.complete,c.status="Attaching Source to "+b.data.attach.name,a.createSourceRef({$personId:b.data.attach.pid,$sourceDescription:b.data.sourceDescription}).$save(b.data.attach.justification).then(function(a){b.track({eventCategory:"FamilySearch",eventAction:"Source Attached",eventLabel:a}),b.data.complete=b.data.attach,b.data.complete.sourceRef=a,delete b.data.attach,d.path("/fs-complete")})}b.service="FamilySearch",a.getCurrentUser().then(function(a){b.fsUser=a.getUser()}),!b.data.sourceDescription&&b.data.url?(c.status="Generating Source",b.log(e.removeEmptyProperties({about:b.data.url.trim()?b.data.url.trim():"",citation:b.data.citation.trim()?b.data.citation.trim():"",title:b.data.title.trim()?b.data.title.trim():"",text:b.data.notes.trim()?b.data.notes.trim():""})),a.createSourceDescription(e.removeEmptyProperties({about:b.data.url.trim()?b.data.url.trim():"",$citation:b.data.citation.trim()?b.data.citation.trim():"",$title:b.data.title.trim()?b.data.title.trim():"",$text:b.data.notes.trim()?b.data.notes.trim():""})).$save(b.attachMsg).then(function(a){b.data.sourceDescription=a,b.track({eventCategory:"FamilySearch",eventAction:"Source Created",eventLabel:a}),f()})):(b.track({eventCategory:"FamilySearch",eventAction:"Source Attached to Another"}),f())}]),angular.module("recordseekApp").factory("fsUtils",["_","$q","fsAPI","$rootScope",function(a,b,c,d){return{removeEmptyProperties:function(b){return a.omit(b,function(b){return a.isEmpty(b)&&0!==b})},getPrimaryPerson:function(a){return{pid:a.id,name:a.$getDisplayName(),birthDate:a.$getBirthDate(),gender:a.$getDisplayGender(),url:a.$getPersistentIdentifier(),birthPlace:a.$getBirthPlace(),deathDate:a.$getDeathDate(),deathPlace:a.$getDeathPlace()}},getLocation:function(a){return c.getPlaceSearch(a,{count:"10"}).then(function(a){var b=a.getPlaces(),c=[];return angular.forEach(b,function(a){c.length<9&&this.push(a.$getNormalizedPlace())},c),c})},getDate:function(a){return c.getDate(a).then(function(a){var b=a.getDate();if(b.normalized){var c=b.$getFormalDate();return[{normalized:b.normalized,formal:c}]}})},getRelativeData:function(a){for(var b=[],c=0,d=a.length;d>c;c++)a[c].living||b.push({pid:a[c].id,url:a[c].$getPersistentIdentifier(),name:a[c].$getDisplayName(),gender:a[c].$getDisplayGender(),data:a[c]});return b},getCurrentUser:function(){c.getCurrentUser().then(function(a){return a.getUser()})},setService:function(){return"FamilySearch"}}}]);