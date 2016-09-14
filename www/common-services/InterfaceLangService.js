/**
 * Created by saloum on 17/03/2016.
 */

/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function() {
    var commonService = angular.module('common-service.module');
    commonService.service(['$stateParams', InterfaceLangService]);
    
  function InterfaceLangService($stateParams) {

    return{
      getDefaultInterfaceLang: getDefaultInterfaceLang
    };

    function getDefaultInterfaceLang(){

      var defaultLang = 'en';

      if($stateParams.langs && $stateParams.langs.split('-').length > 1){
        defaultLang = $stateParams.langs.split('-')[0] !== 'fr' ? 'en' : 'fr';
      }else if ($stateParams.langs){
        defaultLang = $stateParams.langs !== 'fr' ? 'en' : 'fr';
      }

      return defaultLang;
    }

  }
 
}());
