'use strict';

angular.module('wnTracker', [
        'wnTracker.novels',
        'wnTracker.constants',

        'ngMaterial'
    ])
    .config(mdConfig)
    .controller('TrackerCtrl', TrackerCtrl);

/* @ngInject */
function mdConfig($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryColor('blue-grey')
        .accentColor('light-green');
}

/* @ngInject */
function TrackerCtrl($http, API_URL) {
    var vm = this;
    vm.isAuthenticated = false;
    vm.signIn = signIn;
    vm.isSleeping = false;

    if (isOnline()) {
        $http.get(API_URL + '/authTest')
            .success(function() {
                vm.isAuthenticated = true;
                // Notify the background
                chrome.runtime.sendMessage({
                    rerender: true
                });
            })
            .error(function(data, status) {
                console.log(status);
                vm.isAuthenticated = false;
            });
    } else {
        vm.isSleeping = true;
    }

    function signIn() {
        chrome.tabs.create({
            url: API_URL + '/signin'
        });
    }
}

function isOnline() {
    return new Date().getUTCHours() > 6;
}
