'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Articles', function ($scope, Global, Articles) {
    $scope.global = Global;
    $scope.procDownload = false;
    $scope.hasBtc = function(){
        if (Global.user.btc > 0){
            return true;
        }else{
            return false;
        }
    };

    $scope.findMe = function() {
        Articles.query(function(articles) {

            var myArticles = [];

            for (var i =0; i < articles.length; i++){
                if (articles[i].user._id === Global.user._id){
                    myArticles.push(articles[i]);
                }
            }
            $scope.articles = myArticles;
            
            if(myArticles.length<1){
                $scope.hasArticles = false;
            } else{
                $scope.hasArticles = true;
            }
        });
    };
}]);