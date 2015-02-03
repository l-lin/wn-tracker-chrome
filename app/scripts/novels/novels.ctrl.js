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

    DTInstances.getLast().then(function(dtInstance) {
        vm.dtInstance = dtInstance;
    });

    function search(query) {
        vm.dtInstance.DataTable.search(query).draw();
    }

    function addRemoveFavorite(novelId) {
        Novel.get({
            novelId: novelId
        }).$promise.then(function(novel) {
            novel.favorite = !novel.favorite;
            return Novel.update({
                novelId: novelId
            }, novel).$promise;
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
            .withOption('order', [
                [0, 'desc'],
                [1, 'asc']
            ]);
    }

    function _buildDTColumns() {
        return [
            DTColumnBuilder.newColumn('favorite').renderWith(_favoriteRender).withOption('type', 'boolean'),
            DTColumnBuilder.newColumn('title').renderWith(_titleRender).withOption('type', 'link'),
            DTColumnBuilder.newColumn(null, '').notSortable().renderWith(_buttonsRender)
        ];
    }

    function _createdRow(row) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    function _favoriteRender(favorite, type, full) {
        if (favorite) {
            return '<i class="favorite clickable fa fa-star" ng-click="novels.addRemoveFavorite(\'' + full.novelId + '\')"></i>';
        }
        return '<i class="clickable fa fa-star-o" ng-click="novels.addRemoveFavorite(\'' + full.novelId + '\')"></i>';
    }

    function _titleRender(title, type, data) {
        return '<span class="clickable" ng-click="novels.openNovel(\'' + data.url + '\')">' + title + '</span>';
    }

    function _buttonsRender(data) {
        return '<md-button ui-sref="novels.detail({novelId:\'' + data.novelId + '\'})" class="md-raised" aria-label="View novel">' +
            '   <i class="fa fa-search"></i>' +
            '</md-button>&nbsp;' +
            '<md-button ui-sref="novels.modify({novelId:\'' + data.novelId + '\'})" class="md-primary md-raised" aria-label="Modify novel">' +
            '   <i class="fa fa-edit"></i>' +
            '</md-button>';
    }
}

/* @ngInject */
function NovelCtrl(novel, Novel, $state, $mdToast, $mdDialog) {
    var vm = this;
    vm.novel = novel;
    vm.hasImage = hasImage;
    vm.openNovel = openNovel;
    vm.deleteNovel = deleteNovel;

    function hasImage(imageUrl) {
        return imageUrl && imageUrl !== '';
    }

    function openNovel(url) {
        chrome.tabs.create({
            url: url
        });
    }

    function deleteNovel(novelId) {
        var confirm = $mdDialog.confirm()
            .title('Are your sure you want to delete this novel?')
            .ariaLabel('Delete novel')
            .ok('Yes')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            _doDeleteNovel(novelId);
        });
    }

    function _doDeleteNovel(novelId) {
        Novel.delete({
            novelId: novelId
        }).$promise.then(function() {
            var toast = $mdToast.simple()
                .content('Novel successfully deleted!')
                .position('top left right')
                .action('OK')
                .hideDelay(3000);
            $mdToast.show(toast);
            $state.go('novels.list');
        });
    }
}

/* @ngInject */
function NovelFormCtrl(novel, Novel, formType, $state, $mdToast) {
    var vm = this;
    vm.novel = novel;
    vm.formType = formType;
    vm.submit = submit;

    function submit(novel) {
        var result;
        switch (formType) {
            case 'modification':
                result = Novel.update({
                    novelId: novel.novelId
                }, novel).$promise;
                break;
            default:
                result = novel.$save();
                break;
        }
        result.then(function() {
            $mdToast.show(
                $mdToast.simple()
                .content(_getToastMessage(formType))
                .position('top left right')
                .action('OK')
                .hideDelay(3000)
            );
            $state.go('novels.list');
        });
    }

    function _getToastMessage(formType) {
        if (formType === 'modification') {
            return 'Novel successfully modified!';
        }
        return 'Novel successfully created!';
    }
}
