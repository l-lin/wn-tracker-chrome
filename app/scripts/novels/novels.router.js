'use strict';

angular.module('wnTracker.novels')
.config(routerConfig);

/* @ngInject */
function routerConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/novels');
    $stateProvider
        .state('novels', {
            abstract: true,
            url: '/novels',
            templateUrl: 'scripts/novels/novels.html'
        })
        .state('novels.list', {
            url: '',
            views: {
                '': {
                    templateUrl: 'scripts/novels/novels.list.html',
                    controller: NovelsCtrl,
                    controllerAs: 'novels'
                },
                header: {
                    templateUrl: 'scripts/header/header.html',
                    controller: HeaderCtrl,
                    controllerAs: 'header'
                }
            }
        })
        .state('novels.detail', {
            url: '/:id',
            views: {
                '': {
                    templateUrl: 'scripts/novels/novel.detail.html',
                    controller: NovelCtrl,
                    controllerAs: 'novel',
                    resolve: {
                        novel: resolveNovel
                    }
                },
                header: {
                    templateUrl: 'scripts/header/header.detail.html',
                    controller: HeaderDetailCtrl,
                    controllerAs: 'header',
                    resolve: {
                        novel: resolveNovel
                    }
                }
            }
        })
        .state('novels.create', {
            url: '/create',
            views: {
                '': {
                    templateUrl: 'scripts/novels/novels.form.html',
                    controller: NovelFormCtrl,
                    controllerAs: 'novel'
                },
                header: {
                    templateUrl: 'scripts/header/header.form.html',
                    controller: HeaderFormCtrl,
                    controllerAs: 'header',
                    resolve: {
                        formType: 'create'
                    }
                }
            }
        })
        .state('novels.modify', {
            url: '/:id/modify',
            views: {
                '': {
                    templateUrl: 'scripts/novels/novels.form.html',
                    controller: NovelFormCtrl,
                    controllerAs: 'novel',
                    resolve: {
                        novel: resolveNovel
                    }
                },
                header: {
                    templateUrl: 'scripts/header/header.form.html',
                    controller: HeaderFormCtrl,
                    controllerAs: 'header',
                    resolve: {
                        novel: resolveNovel,
                        formType: 'modify'
                    }
                }
            }
        });

    /* @ngInject */
    function resolveNovel($q, Novel, $stateParams) {
        if ($stateParams.id) {
            return Novel.get({id: $stateParams.id})
        }
        return $q.when({
            Title: '',
            Url: '',
            ImageUrl: '',
            Summary: '',
            Favorite: false
        });
    }
}
