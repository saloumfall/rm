    /* jshint ignore:start */
    'use strict';
    /* jshint ignore:end */

    (function () {

             var commonService = angular.module('common-service.module');
        commonService.service(StorageService);

      function StorageService() {
        if (!window.localStorage) {
          console.log("StorageService : Local Storage n’est pas supporté.");
          return;
        }
        this.clearAll = function () {
          return localStorage.clear();
        };
        this.get = function (key) {
          return localStorage.getItem(key);
        };
        this.set = function (key, value) {
          return localStorage.setItem(key, value);
        };
        this.unset = function (key) {
          return localStorage.removeItem(key);
        };
      }


    }());
