/*! dashevolution - v0.0.1 - 2016-01-04
 * Copyright (c) 2016 Perry Woodin <perry@node40.com>;
 * Licensed 
 */
angular.module('layout', [])

	.controller('HeaderCtrl', ['$rootScope', '$state', '$timeout', '$log', function ($rootScope, $state, $timeout, $log) {
		var headerCtrl = this;

	}])

	.controller('FooterCtrl', [function () {
		
	}])
;
angular.module('services.bitcoin', [])

	.service('BitcoinService', [function () {
		var model = this,
			network = bitcoin.networks.dash;

		model.verifyMessage = function(address,signature,message) {
			if(signature.length === 65){
				return bitcoin.message.verify(address, signature, message, network);
			}

			return false;
		};

	}])

;
angular.module('services.httpRequestTracker', [])

	.factory('httpRequestTracker', ['$q', function($q){
		return function (promise) {
			return promise.then(function (response) {
				// do something on success
				return response;

			}, function (response) {
				// do something on error
				return $q.reject(response);
			});
		};
	}])
;
angular.module('services.httpResponseInterceptor', [])

	.factory('httpResponseInterceptor', ['$q', '$rootScope', function($q, $rootScope) {
		var failure = {
				failed:true,
				errors:null,
				messages:[]
			},
			responseStatus = {
			response: function(response){
				if(response.headers()['content-type'] === "application/json;charset=UTF-8"){

					var data = response.data;

					// If data doesn't exist reject.				
					if(!data){
						return $q.reject(response);
					}

				}
				return response;
			},
			responseError: function (response) {
				// Loop through the errors array and returns an 
				// array of error messages.
				function getErrorMessages(errors) {
					return errors.map(function(error) {
						return error.message;
					});
				}

				if(response.data){
					if(response.data.errors){
						failure.messages = getErrorMessages(response.data.errors);
						failure.errors = response.data.errors;
					}

					if(response.data.error){
						failure.messages = [response.data.error];
						failure.errors = response.data.error;
					}
				}

				if (response.status === 401) {
					$rootScope.$broadcast('NotAuthorized',failure);
				}
				
				return $q.reject(failure);
			}
		};

		return responseStatus;
	}])
;

angular.module('services', [
	'services.httpResponseInterceptor',
	'services.httpRequestTracker',	
	'services.bitcoin'
]);
angular.module('dashevolution', [
	'ui.router',
	'ui.bootstrap',
	'ngSanitize',
	// Set CONSTANT
	'config',
	// App modules
	'layout',
	'home',
	// Template cache
	'templates.app',
	'templates.common' 
])


	.config(["$httpProvider", "$stateProvider", "$locationProvider", "$urlRouterProvider", function ($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) { 
		

		$locationProvider.html5Mode(false);
		$stateProvider
			.state('root', {
				abstract: true,
				views: {
					'': {
						templateUrl: 'common/layout/main.tpl.html',
						controller: 'RootCtrl as rootCtrl'
					},
					'header@root': {
						templateUrl: 'common/layout/header.tpl.html',
						controller: 'HeaderCtrl as headerCtrl'
					},
					'footer@root': {
						templateUrl: 'common/layout/footer.tpl.html',
						controller: 'FooterCtrl'
					}
				}
			})
		; 

		$urlRouterProvider.otherwise('/home'); 
	}])

	.run(['$rootScope', '$state', function () {

	}])

	.controller('RootCtrl', ['$rootScope', '$log', function ($rootScope, $log) {
		var rootCtrl = this;


	}])

;
angular.module('home', [])

	.config(['$stateProvider', function($stateProvider){
		$stateProvider
			.state('root.home', {
				url: '/home',
				views: {
					'main@root': {
						templateUrl: 'home/home.tpl.html',
						controller: 'HomeCtrl as homeCtrl'
					}
				}
			});
	}])

	.controller('HomeCtrl', ['$scope', '$log', function ($scope, $log) {
		var homeCtrl = this;

		$log.info('this is the home controller');
	}])

;
angular.module('templates.app', ['common/layout/footer.tpl.html', 'common/layout/header.tpl.html', 'common/layout/main.tpl.html', 'home/home.tpl.html']);

angular.module("common/layout/footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/layout/footer.tpl.html",
    "<hr />\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "	\n" +
    "</div>\n" +
    "\n" +
    "<footer class=\"footer push-down\">\n" +
    "\n" +
    "	<div class=\"container\">\n" +
    "		<p class=\"text-muted text-center\"><small>Dash Evolution</small></p>\n" +
    "	</div>\n" +
    "\n" +
    "</footer>");
}]);

angular.module("common/layout/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/layout/header.tpl.html",
    "<nav class=\"navbar navbar-inverse navbar-fixed-top\">\n" +
    "	<div class=\"container\">\n" +
    "		<div class=\"navbar-header\">\n" +
    "			<button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n" +
    "			<span class=\"sr-only\">Toggle navigation</span>\n" +
    "			<span class=\"icon-bar\"></span>\n" +
    "			<span class=\"icon-bar\"></span>\n" +
    "			<span class=\"icon-bar\"></span>\n" +
    "			</button>\n" +
    "		</div>\n" +
    "		<div id=\"navbar\" class=\"collapse navbar-collapse\">\n" +
    "\n" +
    "			<ul class=\"nav navbar-nav navbar-right\">\n" +
    "				<li><a ui-sref=\"root.home\">Home</a></li>\n" +
    "			</ul>\n" +
    "			\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</nav>");
}]);

angular.module("common/layout/main.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("common/layout/main.tpl.html",
    "<!-- <nav class=\"navbar navbar-default navbar-static-top\">\n" +
    "  <div class=\"container\">\n" +
    "ticker\n" +
    "  </div>\n" +
    "</nav> -->\n" +
    "<div ui-view=\"header\"></div>\n" +
    "\n" +
    "<div ui-view=\"subheader\"></div>\n" +
    "\n" +
    "	\n" +
    "<div class=\"container\">\n" +
    "	<div class=\"main-view\" ui-view=\"main\"></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\" ui-view=\"footer\"></div>");
}]);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "home/home.tpl.html");
}]);

angular.module('templates.common', []);
