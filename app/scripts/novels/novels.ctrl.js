'use strict';

angular.module('wnTracker.novels')
.controller('NovelsCtrl', NovelsCtrl)
.controller('NovelCtrl', NovelCtrl)
.controller('NovelFormCtrl', NovelFormCtrl);

/* @ngInject */
function NovelsCtrl($compile, $scope, DTOptionsBuilder, DTColumnBuilder, DTInstances, API_URL, Novel) {
    var vm = this;
    vm.query = '';
    vm.novels = [];
    vm.dtOptions = _buildDTOptions();
    vm.dtColumns = _buildDTColumns();
    vm.search = search;
    vm.addRemoveFavorite = addRemoveFavorite;
    vm.openNovel = openNovel;

    DTInstances.getLast().then(function (dtInstance) {
        vm.dtInstance = dtInstance;
    });

    function search(query) {
        vm.dtInstance.DataTable.search(query).draw();
    }

    function addRemoveFavorite(id) {
        Novel.get({id: id}).$promise.then(function(novel) {
            novel.Favorite = !novel.Favorite;
            return Novel.update({id: id}, novel).$promise;
        }).then(function() {
            vm.dtInstance.reloadData();
        });
    }

    function openNovel(url) {
        chrome.tabs.create({
            url: url
        });
    }

    // -------------------------------

    function _buildDTOptions() {
        return DTOptionsBuilder.fromSource(API_URL + '/novels')
            .withDOM('rtp')
            .withOption('headerCallback', function(thead) {
                angular.element(thead).remove();
            })
            .withOption('createdRow', _createdRow)
            // FIXME: Multiple sorting is not working...
            .withOption('order', [[0, 'desc'], [1, 'asc']]);
    }

    function _buildDTColumns() {
        return [
            DTColumnBuilder.newColumn('Favorite').renderWith(_favoriteRender).withOption('type', 'boolean'),
            DTColumnBuilder.newColumn('Title').renderWith(_titleRender).withOption('type', 'link'),
            DTColumnBuilder.newColumn(null, '').notSortable().renderWith(_buttonsRender)
        ];
    }

    function _createdRow(row) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    function _favoriteRender(favorite, type, full) {
        if (favorite) {
            return '<i class="favorite clickable fa fa-star" ng-click="novels.addRemoveFavorite(\'' + full.Id + '\')"></i>';
        }
        return '<i class="clickable fa fa-star-o" ng-click="novels.addRemoveFavorite(\'' + full.Id + '\')"></i>';
    }

    function _titleRender(title, type, data) {
        return '<span class="clickable" ng-click="novels.openNovel(\'' + data.Url + '\')">' + title + '</span>';
    }

    function _buttonsRender(data) {
        return '<md-button ui-sref="novels.detail({id:\'' + data.Id + '\'})" class="md-raised" aria-label="View novel">' +
            '   <i class="fa fa-search"></i>' +
            '</md-button>';
    }
}

/* @ngInject */
function NovelCtrl(novel) {
    var vm = this;
    vm.novel = novel;
    vm.hasImage = hasImage;
    vm.openNovel = openNovel;

    function hasImage(imageUrl) {
        return imageUrl && imageUrl !== '';
    }

    function openNovel(url) {
        chrome.tabs.create({
            url: url
        });
    }
}

/* @ngInject */
function NovelFormCtrl(novel) {
    var vm = this;
    vm.novel = novel;
}