'use strict';

angular.module('wnTracker.notifications', [
    'wnTracker.constants',
    'ngResource'
])
    .controller('NotificationsCtrl', NotificationsCtrl);

/* @ngInject */
function NotificationsCtrl(DTOptionsBuilder, DTColumnBuilder, $compile, API_URL, $scope) {
    var vm = this;
    vm.hasNotifications = chrome.extension.getBackgroundPage().hasNotifications;
    vm.openNotification = openNotification;
    vm.dtOptions = _buildDTOptions();
    vm.dtColumns = _buildDTColumns();

    function openNotification(notification) {
        chrome.tabs.create({
            url: notification.link
        });
    }

    // -------------------------------

    function _buildDTOptions() {
        return DTOptionsBuilder.fromSource(API_URL + '/notifications')
            .withDOM('rtp')
            .withOption('headerCallback', function(thead) {
                angular.element(thead).remove();
            })
            .withOption('createdRow', _createdRow);
    }

    function _buildDTColumns() {
        return [
            DTColumnBuilder.newColumn(null, '').notSortable().renderWith(_buttonsRender),
            DTColumnBuilder.newColumn('title').renderWith(_titleRender).withOption('type', 'link')
        ];
    }

    function _createdRow(row) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    function _titleRender(title, type, data) {
        return '<span class="clickable" ng-click="notifications.openNotification(\'' + data.link + '\')">' +
            '   <md-tooltip>' + data.link + '</md-tooltip>' + title +
            '</span>';
    }

    function _buttonsRender(data) {
        return '<md-button class="md-raised" aria-label="Remove notification" ng-click="notifications.removeNotification(\'' + data.notificationId + '\')">' +
            '   <i class="fa fa-close"></i>' +
            '</md-button>';
    }
}
