'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'Articles', '$modal', '$log', '$http', function ($scope, Global, Articles, $modal, $log, $http) {
    $scope.global = Global;
    $scope.procDownload = false;
    $scope.hasBtc = function(){
        if (Global.user.btc > 0){
            return true;
        }else{
            return false;
        }
    };

    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html'
        });

        modalInstance.result.then(function (btcAdress) {
            var userId = Global.user._id;
            
            $http({
                method: 'POST',
                url: '/withdrawl/' + userId + '/' + btcAdress
            }).success(function(/*data, status, headers, config*/) {
                console.log('withdrawl request created');
            }).error(function(/*data, status, headers, config*/) {
                console.log('withdrawl request failed!');
            });

            $scope.global.user.btc = 0.000;

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
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