'use strict';

angular.module('wnTracker', [
    'wnTracker.router',
    'wnTracker.novels',

    'ngMaterial'
])
.config(mdConfig);

function mdConfig($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryColor('indigo')
        .accentColor('light-green');
}
