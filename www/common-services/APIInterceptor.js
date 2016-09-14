    /**
     * Created by saloum on 28/07/2016.
     */
    /* jshint ignore: start */
    'use strict';
    /* jshint ignore: end */

    (function () {
        var commonService = angular.module('common-service.module');
        
        commonService.service('APIInterceptor',['$rootScope','$location', '$q', APIInterceptor]);

        function APIInterceptor ($rootScope, $location, $q) {
        return {
          'responseError': function (rejection) {
            if (rejection.status === 401) {
              console.log('rejection status 401 in http interceptor - redirecting to login page');
              $rootScope.$broadcast('unauthorized');
              $location.path('/en/auth').search({});
            }
            return $q.reject(rejection);
          }
        };
      }
    }());
