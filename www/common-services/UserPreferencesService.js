/* jshint ignore: start*/
'use strict';
/* jshint ignore: end */

(function(){
    	 var commonService = angular.module('common-service.module');
    commonService.service(['$rootScope', '$translate', 'StorageService', 'PreferencesService', '$http', 'ContentLangService', '$q', 'relaxReaderSettings', UserPreferencesService]);
    
  function UserPreferencesService($rootScope, $translate, StorageService, PreferencesService, $http, ContentLangService, $q, relaxReaderSettings){

    var defaultPreferences = {
      interfaceLang: 'en',
      contentLang: 'en'
    };

    var currentUserPreferences = {};
    var lastSeenSlugs = {};

    var userPreferences = {
      initUserPreferences: initUserPreferences,
      initOpenUserPreferences: initOpenUserPreferences,
      clearUserPreferences: clearUserPreferences,

      /* Getters */
      getLastSeensSlugs: getLastSeensSlugs,
      getContentLang: getContentLang,
      getInterfaceLang: getInterfaceLang,
      getDisplayMode: getDisplayMode,
      getCurrentSlug: getCurrentSlug,
      getIsInEditorialFeedMode: getIsInEditorialFeedMode,
      getPressRelease: getPressRelease,
      getDebugMode: getDebugMode,
      getUSerRole: getUSerRole,
      getRadarPeriod: getRadarPeriod,
      getToken: getToken,
      getOriginalToken: getOriginalToken,
      getUserPreferences: getUserPreferences,
      getSavedSearch: getSavedSearch,


      /* Setters */
      setContentLang: setContentLang,
      setInterfaceLang: setInterfaceLang,
      setDisplayMode: setDisplayMode,
      setCurrentSlug: setCurrentSlug,
      setIsInEditorialFeedMode: setIsInEditorialFeedMode,
      setPressRelease: setPressRelease,
      setDebugMode: setDebugMode,
      setRadarPeriod: setRadarPeriod,
      setSavedSearch: setSavedSearch,
      deleteSavedSearch: deleteSavedSearch
    };

    return userPreferences;


    function initUserPreferences(userPref, lastSeen){
      currentUserPreferences = userPref;
      lastSeenSlugs = lastSeen;
    }

    function initOpenUserPreferences() {
      currentUserPreferences = defaultPreferences;
    }

    function clearUserPreferences() {
      currentUserPreferences = {};
      lastSeenSlugs = {};
    }


    /* Getters */

    function getLastSeensSlugs(feedSlug) {
      var currentLang = ContentLangService.getCurrent(true),
        req = {
          method: 'GET',
          url: relaxReaderSettings.urlSearchAPI + '/events/project/relax/myevents',
          params: {
            size: 0,
            values: feedSlug,
            lang: currentLang
          },
          cache:true
        },
        defer = $q.defer();

      $http(req)
        .then(function (response) {
            var lastSeen = response.data.new_since || [];
            var mappedLastSeen = lastSeen.map(
              function lastSeenMapping(data) {
                return {
                  feed: data.feed,
                  count: data.count
                };
              });
            defer.resolve(mappedLastSeen);
          },
          function (response) {
            defer.reject(response);
          });

      return defer.promise;
    }


    function getUserPreferences (){
      return currentUserPreferences;
    }

    function getContentLang (){
      return currentUserPreferences.contentLang || defaultPreferences.contentLang;
    }

    function getInterfaceLang (){
      return currentUserPreferences.lang || defaultPreferences.interfaceLang;
    }

    function getDisplayMode (){
      var defaultDisplayMode = {
        "reader": "magazine",
        "relaxnews": "relaxnews"
      };
      if (!angular.isObject(currentUserPreferences.displayMode) || !currentUserPreferences.displayMode ){
        return defaultDisplayMode;
      }else{
        return currentUserPreferences.displayMode;
      }

    }

    function getCurrentSlug (){
      return currentUserPreferences.currentSlug;
    }

    function getIsInEditorialFeedMode () {
      return currentUserPreferences.isInEditorialFeedMode;
    }

    function  getPressRelease () {
      return currentUserPreferences.pressRelease;
    }

    function  getDebugMode () {
      return currentUserPreferences.debugMode;
    }

    function getUSerRole () {
      return currentUserPreferences.role[0];
    }

    function  getRadarPeriod () {
      return currentUserPreferences.radarPeriod;
    }

    function getOriginalToken() {
      var tokenName = StorageService.get('tokenName');
      return StorageService.get(tokenName+'_original');
    }

    function getToken() {
      var tokenName = StorageService.get('tokenName');
      return StorageService.get(tokenName);
    }
    function getSavedSearch() {
      if(angular.equals(currentUserPreferences.searchSaved,{})){return;}
      return currentUserPreferences.searchSaved;
    }


    /* Setters */

    function setContentLang (contentLang){
      currentUserPreferences.contentLang = contentLang;
      updatePreferences();
    }

    function setInterfaceLang (lang){
      $rootScope.$broadcast('updateInterfaceLang', {lang: lang});
      $translate.use(lang);
      currentUserPreferences.lang = lang;
      updatePreferences();
    }

    function  setDisplayMode (displayMode){
      currentUserPreferences.displayMode = displayMode;
      updatePreferences();
    }

    function setCurrentSlug (currentSlug){
      $rootScope.$broadcast('updateCurrentSlug', {currentSlug:currentSlug});
      currentUserPreferences.currentSlug = currentSlug;
      updatePreferences();
    }

    function setIsInEditorialFeedMode (isInEditorialFeedMode){
      currentUserPreferences.isInEditorialFeedMode = isInEditorialFeedMode;
      return updatePreferences();
    }

    function setPressRelease (pressRelease){
      currentUserPreferences.pressRelease = pressRelease;
      updatePreferences();
    }

    function  setDebugMode (debugMode){
      currentUserPreferences.debugMode = debugMode;
      updatePreferences();
    }

    function setRadarPeriod (radarPeriod){
      currentUserPreferences.radarPeriod = radarPeriod;
      updatePreferences();
    }

    function setSavedSearch(savedSearch) {
      if(!currentUserPreferences.searchSaved){
        currentUserPreferences.searchSaved = {};
      }

      currentUserPreferences.searchSaved[savedSearch.slug] = savedSearch;
      updatePreferences();
    }

    function deleteSavedSearch(saveSearchId) {
      delete  currentUserPreferences.searchSaved[saveSearchId];
      updatePreferences();
    }



    function updatePreferences (){
      return PreferencesService.updatePreferences(currentUserPreferences);
    }
  }

  
}());
