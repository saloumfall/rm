/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function(){
    var commonService = angular.module('common-service.module');
    commonService.service('AppDataService',['$q', 'CatalogService', 
                                            'PreferencesService', 'UserPreferencesService',
                                            'UserDataService', 'TrackEventUserService', AppDataService];)
    
  function AppDataService($q, CatalogService, PreferencesService, UserPreferencesService, UserDataService, TrackEventUserService) {
    var hasBeenInitialized = false;
    var hasTrackedReferrer = false;
    var appData = {};

    var appDataService = {
      initAppData: initAppData,
      initDefaultData: initDefaultData,
      getAppData: getAppData,
      clearAppData: clearAppData
    };

    return appDataService;

    function initAppData(dataFromBDD) {
      if (hasBeenInitialized) return $q.reject('Already Initialized');
      hasBeenInitialized = true;

      var preferences = PreferencesService.parsePreferencesFromJSON(dataFromBDD.preferences);
      var catalogs = dataFromBDD.catalogs;
      var lastseenslugs = dataFromBDD.lastseenslugs;
      UserDataService.initUserData(dataFromBDD);
      UserPreferencesService.initUserPreferences(preferences, lastseenslugs);
      CatalogService.initCatalogs(catalogs, preferences, lastseenslugs);
      appData = dataFromBDD;

      if (!hasTrackedReferrer) {
        TrackEventUserService.trackReferer(document.referrer);
        hasTrackedReferrer = true;
      }
      return $q.resolve();
    }

    function initDefaultData() {
      if (hasBeenInitialized) return $q.reject('Already Initialized');
      hasBeenInitialized = true;

      UserDataService.initUserData();
      UserPreferencesService.initOpenUserPreferences();
      return CatalogService.initDefaultCatalog();
    }

    function clearAppData() {
      hasBeenInitialized = false;
      UserDataService.clearUserData();
      UserPreferencesService.clearUserPreferences();
      CatalogService.clearAllData();

      appData = {};
    }

    function getAppData() {
      return appData;
    }


  }

}());
