'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles', function ($scope, $stateParams, $location, Global, Articles) {
    $scope.global = Global;
    $scope.paypal = true;

    $scope.uploadComplete = function (content) {
            $scope.response = content;
            var theId = '';
            var article = new Articles({
                title: $scope.title,
                content: $scope.description,
                price: $scope.price,
                paypal: $scope.paypal,
                bitcoin: $scope.bitcoin,
                ppEmail: $scope.ppEmail,
                fileURL: $scope.response.fileURL
            });
            article.$save(function(response) {
                theId = response._id;
                response.sellURL = 'http://soldfy.com/#!/downloads/' + theId;
                article = response;
                article.$update({articleId: theId},function() {
                    $location.path('articles/' + article._id);
                });
            });

            $scope.title = '';
            $scope.description = '';
            $scope.paypal = true;
            $scope.bitoin = false;
        };

    $scope.remove = function(article) {
        if (article) {
            article.$remove();

            for (var i in $scope.articles) {
                if ($scope.articles[i] === article) {
                    $scope.articles.splice(i, 1);
                }
            }
        }
        else {
            $scope.article.$remove();
            $location.path('articles');
        }
    };

    $scope.update = function() {
        var article = $scope.article;
        if (!article.updated) {
            article.updated = [];
        }
        article.updated.push(new Date().getTime());

        article.$update(function() {
            $location.path('articles/' + article._id);
        });
    };

    $scope.find = function() {
        Articles.query(function(articles) {
            $scope.articles = articles;
        });
    };

    $scope.findOne = function() {
        Articles.get({
            articleId: $stateParams.articleId
        }, function(article) {
            $scope.article = article;
        });
    };
    $scope.findDownload = function() {
        Articles.get({
            articleId: $stateParams.downloadId
        }, function(article) {
            $scope.article = article;
        });
    };
}]);