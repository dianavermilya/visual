'use strict';

/**
 * @ngdoc overview
 * @name visualApp
 * @description
 * # visualApp
 *
 * Main module of the application.
 */
angular
  .module('visualApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/journal', {
        templateUrl: 'views/journal.html',
        controller: 'JournalCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
