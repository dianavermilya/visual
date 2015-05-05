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
      .when('/journal', {
        templateUrl: 'views/journal.html',
        controller: 'JournalCtrl'
      })
      .when('/visualizations', {
        templateUrl: 'views/visualizations.html',
        controller: 'VisualizationsCtrl'
      })
      .when('/rebalance', {
        templateUrl: 'views/rebalance.html',
        controller: 'RebalanceCtrl'
      })
      .when('/redblack', {
        templateUrl: 'views/redblack.html',
        controller: 'RedblackCtrl'
      })
      .when('/neural', {
        templateUrl: 'views/neural.html',
        controller: 'NeuralCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
