'use strict';

angular.module('wnTracker.header', [])
.controller('HeaderCtrl', HeaderCtrl)
.controller('HeaderDetailCtrl', HeaderDetailCtrl)
.controller('HeaderFormCtrl', HeaderFormCtrl);

/* @ngInject */
function HeaderCtrl() {

}

/* @ngInject */
function HeaderDetailCtrl(Novel, novel) {
    var vm = this;
    vm.novel = novel;
    vm.openNovel = openNovel;
    vm.addRemoveFavorite = addRemoveFavorite;

    function openNovel(url) {
        chrome.tabs.create({
            url: url
        });
    }

    function addRemoveFavorite(novel) {
        novel.Favorite = !novel.Favorite;
        Novel.update({id: novel.Id}, novel);
    }
}

/* @ngInject */
function HeaderFormCtrl(novel) {
    var vm = this;
    vm.novel = novel;
}
