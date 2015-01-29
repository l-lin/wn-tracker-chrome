'use strict';

angular.module('wnTracker.novels', ['ngResource', 'ngMaterial', 'datatables'])
.factory('DTLoadingTemplate', dtLoadingTemplate)
.controller('NovelsCtrl', NovelsCtrl);

function dtLoadingTemplate() {
    return {
        html: '<md-progress-circular md-mode="indeterminate"></md-progress-circular>'
    };
}

function NovelsCtrl($compile, $scope, DTOptionsBuilder, DTColumnBuilder, DTInstances) {
    var DT;
    var vm = this;
    vm.query = '';
    vm.novels = [];
    vm.dtOptions = _buildDTOptions();
    vm.dtColumns = _buildDTColumns();
    vm.search = search;

    DTInstances.getLast().then(function (dtInstance) {
        DT = dtInstance.DataTable;
    });

    function search(query) {
        DT.search(query).draw();
    }

    // -------------------------------

    function _buildDTOptions() {
        return DTOptionsBuilder.fromSource('examples/examples.json')
            .withDOM('rti')
            .withOption('createdRow', _createdRow);
    }

    function _buildDTColumns() {
        return [
            DTColumnBuilder.newColumn('favorite', ''),
            DTColumnBuilder.newColumn('name', 'Novel'),
            DTColumnBuilder.newColumn('lastChapter', 'Last chapter read'),
            DTColumnBuilder.newColumn(null, '').notSortable()
                .renderWith(_buttonsRender)
        ];
    }

    function _createdRow(row) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    function _buttonsRender(data) {
        return '<md-button ng-click="showCase.edit(' + data.id + ')" class="md-raised">' +
            '   Edit' +
            '</md-button>';
    }
}
