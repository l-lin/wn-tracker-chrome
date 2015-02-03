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
                    controller: 'NovelsCtrl',
                    controllerAs: 'novels'
                },
                header: {
                    templateUrl: 'scripts/header/header.html'
                },
                notifications: {
                    templateUrl: 'scripts/notifications/notifications.list.html',
                    controller: 'NotificationsCtrl',
                    controllerAs: 'notifications'
                }
            }
        })
        .state('novels.detail', {
            url: '/:novelId',
            views: {
                '': {
                    templateUrl: 'scripts/novels/novel.detail.html',
                    controller: 'NovelCtrl',
                    controllerAs: 'novel',
                    resolve: {
                        novel: resolveNovel
                    }
                },
                header: {
                    templateUrl: 'scripts/header/header.detail.html',
                    controller: 'HeaderDetailCtrl',
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
                    templateUrl: 'scripts/novels/novel.form.html',
                    controller: 'NovelFormCtrl',
                    controllerAs: 'novel',
                    resolve: {
                        novel: resolveNovel,
                        formType: function() {
                            return 'creation';
                        }
                    }
                },
                header: {
                    templateUrl: 'scripts/header/header.form.html',
                    controller: 'HeaderFormCtrl',
                    controllerAs: 'header',
                    resolve: {
                        novel: resolveNovel,
                        formType: function() {
                            return 'creation';
                        }
                    }
                }
            }
        })
        .state('novels.modify', {
            url: '/:novelId/modify',
            views: {
                '': {
                    templateUrl: 'scripts/novels/novel.form.html',
                    controller: 'NovelFormCtrl',
                    controllerAs: 'novel',
                    resolve: {
                        novel: resolveNovel,
                        formType: function() {
                            return 'modification';
                        }
                    }
                },
                header: {
                    templateUrl: 'scripts/header/header.form.html',
                    controller: 'HeaderFormCtrl',
                    controllerAs: 'header',
                    resolve: {
                        novel: resolveNovel,
                        formType: function() {
                            return 'modification';
                        }
                    }
                }
            }
        });

    /* @ngInject */
    function resolveNovel($q, Novel, $stateParams) {
        if ($stateParams.novelId) {
            return Novel.get({
                novelId: $stateParams.novelId
            });
        }
        return $q.when(new Novel({
            title: '',
            url: '',
            imageUrl: '',
            summary: '',
            favorite: false
        }));
    }
}
