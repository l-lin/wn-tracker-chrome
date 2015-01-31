'use strict';

angular.module('wnTracker', [
    'wnTracker.novels',

    'ngMaterial'
])
.config(mdConfig);

/* @ngInject */
function mdConfig($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryColor('blue-grey')
        .accentColor('light-green');
}
