'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Latest Products',
        'link': 'articles'
    }, {
        'title': 'Create New Product',
        'link': 'articles/create'
    }];
    
    $scope.isCollapsed = false;
}]);