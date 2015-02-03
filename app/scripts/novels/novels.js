'use strict';

angular.module('wnTracker.novels', [
        'wnTracker.constants',
        'wnTracker.header',
        'wnTracker.notifications',
        'ngResource',
        'ngMaterial',
        'ui.router',
        'datatables'
    ])
    .factory('DTLoadingTemplate', dtLoadingTemplate);

function dtLoadingTemplate() {
    return {
        html: '<md-progress-circular md-mode="indeterminate"></md-progress-circular>'
    };
}
