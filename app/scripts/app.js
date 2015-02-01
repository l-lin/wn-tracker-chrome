'use strict';

angular.module('wnTracker', [
        'wnTracker.novels',

        'ngMaterial'
    ])
    .constant('API_URL', 'https://api-wntracker.herokuapp.com')
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

    $http.get(API_URL + '/authTest')
        .success(function() {
            vm.isAuthenticated = true;
        })
        .error(function(data, status) {
            console.log(status);
            vm.isAuthenticated = false;
        });

    function signIn() {
        chrome.tabs.create({
            url: API_URL + '/login'
        });
    }

    // FIXME: DELETE ME AFTERWARDS
    var port = chrome.extension.connect({name: 'Sample Communication'});
    port.postMessage('Hi BackGround');
    port.onMessage.addListener(function(msg) {
        console.log('message recieved'+ msg);
    });
}
