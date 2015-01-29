'use strict';

angular.module('wnTracker.router', ['ui.router'])
.config(routerConfig);

function routerConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/novels');
    $stateProvider
        .state('novels', {
            url: '/novels',
            templateUrl: 'scripts/novels/novels.html'
        });
}
