'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.articles']);

angular.module('mean.system', ['ngUpload']);
angular.module('mean.articles', ['ngUpload']);