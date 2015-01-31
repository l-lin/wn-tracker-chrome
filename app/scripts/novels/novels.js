'use strict';

angular.module('wnTracker.novels', [
    'wnTracker.header',
    'ngResource',
    'ngMaterial',
    'ui.router',
    'datatables'
])
.constant('API_URL', 'https://api-wntracker.herokuapp.com')
.factory('DTLoadingTemplate', dtLoadingTemplate);

function dtLoadingTemplate() {
    return {
        html: '<md-progress-circular md-mode="indeterminate"></md-progress-circular>'
    };
}
