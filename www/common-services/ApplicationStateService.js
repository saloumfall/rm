
(function(){
    
    'use strict';
    
 var commonService = angular.module('common-service.module');
    
    commonService.service('ApplicationStateService', ApplicationStateService);
    
  function ApplicationStateService(){
    var applicationStateService = this;

    var preLoginLocationData = {
      hasData: false,
      hasRelaxArticle: false
    };

    /**
     * Parse and store informations about the url which with the user accessed the application.
     * The point of doing this is to redirect to the right stuff even after user has to log in.
     *
     * @param locationPath : value of $location.path() before re-routing to authentification page
     * @param locationSearch : value of $location.search() before re-routing to authentification page
     */
    applicationStateService.setupPreLoginLocationData = function(locationPath, locationSearch, locationUrl) {
      preLoginLocationData.hasData = false;
      preLoginLocationData.hasRelaxArticle = false;

      /**
       * Parse url location for 'select' page.
       * Put result of parsing in 'preLoginLocationData' object.
       * Return a boolean indicating whether parsing went ok or not
       */
      var parseSelectPageLocation = function (locationPathArray, locationSearch) {
        if (locationPathArray[1] !== 'select') {
          console.log('Error: we should not reach this. (select url parsing)');
          return false;
        } else {

          if ((locationSearch) && (locationSearch.articleId)) {
            preLoginLocationData.articleId = locationSearch.articleId;
            preLoginLocationData.hasRelaxArticle = true;
          }

          var subPage;
          switch (locationPathArray.length) {
            case 3:
              // 'home' subpage
              // Url formatted as {domain}/#/en/select/{categorySlug}
              preLoginLocationData.contentLanguage = locationPathArray[0];
              preLoginLocationData.page = 'select';
              preLoginLocationData.subPage = 'home';
              preLoginLocationData.category = locationPathArray[2];
              break;
            case 4:
              // 'afpRelax', 'reader' or 'press-release' subpage
              // Url formatted as {domain}/#/en/select/{categorySlug}/{subpage}
              subPage = locationPathArray[3];
              if (['afprelax', 'reader', 'press-release'].indexOf(subPage) === -1) {
                return false;
              } else {
                preLoginLocationData.contentLanguage = locationPathArray[0];
                preLoginLocationData.page = 'select';
                preLoginLocationData.subPage = subPage;
                preLoginLocationData.category = locationPathArray[2];
              }
              break;
            case 5:
              // 'search' or 'folders' subpage
              // Url like
              // - {domain}/#/en/select/{categorySlug}/search/{searchInput}
              // - {domain}/#/en/select/{categorySlug}/folders/{folderId}
              subPage = locationPathArray[3];
              if (['search', 'folders'].indexOf(subPage) === -1) {
                return false;
              } else {
                preLoginLocationData.contentLanguage = locationPathArray[0];
                preLoginLocationData.page = 'select';
                preLoginLocationData.category = locationPathArray[2];
                if (subPage === 'search') {
                  preLoginLocationData.subPage = 'search';
                  preLoginLocationData.searchInput = locationPathArray[4];
                } else {
                  preLoginLocationData.subPage = 'folders';
                  preLoginLocationData.folderId = locationPathArray[4];
                }
              }
              break;
            default:
              console.log('Error: could not recognize any \'select\' url format when parsing entry url.');
              return false;
          }
          return true;
        }
      };

      /**
       * Parse url location for 'publish' page.
       * Put result of parsing in 'preLoginLocationData' object.
       * Return a boolean indicating whether parsing went ok or not
       */
      var parsePublishPageLocation = function (locationPathArray) {
        if (locationPathArray[1] !== 'publish') {
          console.log('Error: we should not reach this (publish url parsing)');
          return false;
        } else {
          // Url formatting can be either
          // - {domain}/#/en/publish
          // - {domain}/#/en/publish/{articleId}
          preLoginLocationData.contentLanguage = locationPathArray[0];
          preLoginLocationData.page = 'publish';

          if (locationPathArray.length === 3) {
            preLoginLocationData.articleId = locationPathArray[2];
          }
        }

        return true;
      };

      var locationPathArray = locationPath.split('/');
      locationPathArray.splice(0, 1);
      if (locationPathArray.length >= 2) {
        switch (locationPathArray[1]) {
          case 'select':
            preLoginLocationData.hasData = parseSelectPageLocation(locationPathArray, locationSearch);
            break;
          case 'publish':
            preLoginLocationData.hasData = parsePublishPageLocation(locationPathArray);
            break;
          case 'preferences':
            preLoginLocationData.page = 'preferences';
            preLoginLocationData.hasData = true;
            break;
          case 'ondemand':
            preLoginLocationData.page = 'ondemand';
            preLoginLocationData.hasData = true;
            break;
          default:
            console.log('Error: Could not parse entry url page.');
        }
      } else {
        console.log('Error: Could not parse entry url');
      }

      if (preLoginLocationData.hasData) {
        preLoginLocationData.hasAlreadyBeenInitialized = true;
        preLoginLocationData.locationUrl = locationUrl;
      }
    };

    /**
     * Check if user had a valid url before having to log in.
     * Valid meaning that the url bear info, could be correctly parsed AND point to stuff ok with user rights.
     */
    applicationStateService.hasValidPreLoginLocationWithRelaxArticle = function() {
      // TODO : also check if data in preLoginLocationData are ok with user rights
      return preLoginLocationData.hasData && preLoginLocationData.hasRelaxArticle;
    };

    /**
     * @return The url user accessed to before being re-routed to login page.
     */
    applicationStateService.getPreLoginLocation = function() {
      return preLoginLocationData.locationUrl;
    };

/*    var DatabaseLocationData = {
      hasData: false
    };*/



    return applicationStateService;
  }

}());
