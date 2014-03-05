'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.system').factory('Dls', ['$resource', function($resource) {
    return $resource('dl/:dlKey', {
        dlKey: '@dlKey'
    }, {
        search: {
            method: 'GET'
        }
    });
}]);