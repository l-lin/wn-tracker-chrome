'use strict';

angular.module('wnTracker.novels')
    .factory('Novel', Novel);

/* @ngInject */
function Novel($resource, API_URL) {
    return $resource(API_URL + '/novels/:novelId', {
        novelId: '@novelId'
    }, {
        update: {
            method: 'PUT'
        },
        'delete': {
            method: 'DELETE'
        }
    });
}
