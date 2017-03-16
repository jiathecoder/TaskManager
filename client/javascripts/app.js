var myAppModule = angular.module('myAppModule', ['ngRoute', 'angularMoment', 'ngCookies', 'dndLists']);
myAppModule.run(function(amMoment) {
    amMoment.changeLocale('de');
});
myAppModule.config(function ($routeProvider) {
  $routeProvider
    .when('/login', {
        templateUrl: 'partials/login.html'
    })
    .when('/register', {
        templateUrl: 'partials/register.html'
    })
    .when('/world', {
        templateUrl: 'partials/world.html'
    })
    .when('/home/:id', {
        templateUrl: 'partials/home.html'
    })
    .when('/demo', {
        templateUrl: 'partials/demo.html'
    })
    .otherwise({
      redirectTo: '/login'
    });
});