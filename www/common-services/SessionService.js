/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function(){
    var commonService = angular.module('common-service.module');
    commonService.service(['$http', '$q', '$location', '$rootScope', 'StorageService', 'AuthService', 'PreferencesService', 'AppDataService', 'relaxReaderSettings', SessionService]);
    
  function SessionService($http, $q, $location, $rootScope, StorageService, AuthService, PreferencesService, AppDataService, relaxReaderSettings) {
    var sessionService = {
      create: create,
      check: check,
      destroy: destroy
    };
    $rootScope.$on('unauthorized', function () {
      destroy();
    });

    return sessionService;


    function create(data) {
      var tokenName = "token" + data.env;
      StorageService.set('tokenName', tokenName);

      if (data.email && data.token) {
        var token = window.btoa(unescape(encodeURIComponent(data.email + ":" + data.token)));
        $http.defaults.headers.common.Authorization = 'Basic ' + token;
        StorageService.set(tokenName+'_original', data.token);
        StorageService.set(tokenName, token);
      } else if (data.token) {
        StorageService.set(tokenName, data.token);
      }
    }

    function check() {
      var SessionService = this;
      return $q(function (resolve, reject) {
        AuthService.check().error(function (res) {
          SessionService.destroy();
          reject();
          return false;
        }).then(function (res) {
          if (res.status === 200) {
            AppDataService.initAppData(res.data);
            SessionService.create(res.data);
            if (typeof res.data.preferences === 'string') {
              res.data.preferences = JSON.parse(res.data.preferences);
              $rootScope.preferences = res.data.preferences;
            }
            if (res.data.preferences && res.data.preferences.version !== relaxReaderSettings.preferenceVersion) {
              PreferencesService.initializePreference();
            }
            resolve();
            return true;
          }
          SessionService.destroy();
          reject();
          return false;
        });
      });
    }




    function destroy(redirect, redirectUrl) {
      console.log('session service destroy been called - possibly redirecting to login page');
      var interfaceLangs = navigator.language || navigator.userLanguage || 'en';
      redirectUrl = redirectUrl || "/" + interfaceLangs + "/auth";
      if (redirect === undefined) {
        redirect = true;
      }

      AuthService.logout();
      StorageService.clearAll();
      AppDataService.clearAppData();
      delete $http.defaults.headers.common.Authorization;

      if (redirect) {
        $location.path(redirectUrl);
      }
    }

  }
  
}());
