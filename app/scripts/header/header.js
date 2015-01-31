'use strict';

angular.module('wnTracker.header', [])
.controller('HeaderDetailCtrl', HeaderDetailCtrl)
.controller('HeaderFormCtrl', HeaderFormCtrl);

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
function HeaderFormCtrl(novel, formType) {
    var vm = this;
    vm.novel = novel;
    vm.isCreation = isCreation;
    vm.isModification = isModification;

    function isCreation() {
        return formType === 'creation';
    }

    function isModification() {
        return formType === 'modification';
    }
}
