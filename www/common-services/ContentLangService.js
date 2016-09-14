/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function() {
    
     var commonService = angular.module('common-service.module');
   commonService.service(['_', '$rootScope', ContentLangService]);
    
  function ContentLangService(_, $rootScope) {
    var allowedLangs;
    var currentLangs;

    $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

    var contentLangService = {
      init: init,
      clearAllData: clearAllData,
      setCurrent: setCurrent,
      getCurrent: getCurrent,
      getAllowed: getAllowed,
      formatLang: formatLang
    };
    return contentLangService;

    function init(catalogLangs, preferencesLangs) {
      var _preferencesLangs = _.isString(preferencesLangs) ? preferencesLangs.split('-') : preferencesLangs;
      var filteredLangs = _.intersection(_preferencesLangs, catalogLangs);
      var currentContentLangs = _.isEmpty(filteredLangs) ? catalogLangs : filteredLangs;

      allowedLangs = catalogLangs;
      currentLangs = currentContentLangs;
    }

    function clearAllData() {
      allowedLangs = undefined;
      currentLangs = undefined;
    }


    function setCurrent(langs) {
      var _langs = _.isArray(langs) ? langs : langs.split('-');
      var filteredLangs = _.intersection(_langs, allowedLangs);

      if (_.isEmpty(filteredLangs)) {
        console.log('Warning: Langs ['+langs+'] not allowed by current catalog.');
        return;
      }

      if (!_.isEqual(filteredLangs, currentLangs)) {
        currentLangs = filteredLangs;
        $rootScope.$broadcast('changeContentLang', {lang: getCurrent(true)});
      }
    }

    function getCurrent(asSlug) {
      return asSlug ? writeLangsAsSlug(currentLangs) : currentLangs;

      /* -- Helper functions -- */
      function writeLangsAsSlug(langs) {
        // slug is 'en-fr' and not 'fr-en'
        if (langs.length < 2) {
          return langs[0];
        } else {
          return 'en-fr';
        }
      }
    }

    function getAllowed(asSlug) {
      return asSlug ? getSlugList(allowedLangs) : allowedLangs;

      /* -- Helper functions -- */
      function getSlugList(contentLangs) {
        if (contentLangs.length === 1) {
          return contentLangs[0];
        } else {
          return ['en', 'fr', 'en-fr'];
        }
      }
    }

    function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      if (toParams.langs && (toParams.langs !== fromParams.langs)) {
        setCurrent(toParams.langs);
      }
    }

    function formatLang (lang) {
      var currentLang = lang ? lang : InterfaceLangService.getDefaultInterfaceLang();
      if(isMultiLang(currentLang)){
        return 'en,fr';
      }
      return currentLang;
    }


     function isMultiLang (lang) {
      if(lang){
        return lang && lang.indexOf('-') !== -1 && lang.split("-").length > 1;
      }
      return false;
    }

  }
  
}());
