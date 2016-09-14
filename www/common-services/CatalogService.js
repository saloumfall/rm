/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function(){
     var commonService = angular.module('common-service.module');
    
     commonService.service('CatalogService',['_', '$filter', '$rootScope', '$state', '$location', 'FeedDataService', 'CatalogConfigService', 'ContentLangService', 'FeedService', 'FoldersService', 'ApplicationStateService', 'SavedSearchService', 'UserPreferencesService', 'PreferencesService', CatalogService]);
    
  function CatalogService(_, $filter, $rootScope, $state, $location, FeedDataService, CatalogConfigService, ContentLangService, FeedService, FoldersService, ApplicationStateService, SavedSearchService, UserPreferencesService, PreferencesService) {

    var hasBeenInitialized = false;
    var currentCatalog = {};
    var publicCatalogs = {};
    var privateCatalogs = {};
    var preferences = {};
    var lastSeenSlug = {};
    var currentContentLangs = [];

    var catalogService = {
      initCatalogs: init,
      initDefaultCatalog: initDefaultCatalog,
      clearAllData: clearAllData,
      switchToCatalog: switchToCatalog,
      getCatalog: getCurrentCatalog,
      getCatalogClass: getCatalogClass,
      getPrivateCatalog: getPrivateCatalog,
      getCurrentFeed: getCurrentFeed,
      getFeedBackendSlug: getFeedBackendSlug,
      getCatalogByName: getCatalogByName,
      getArrayAllCatalogs: getArrayAllCatalogs,
      getLastSlugSaved: getLastSlugSaved,
      getLastSeenSlugs: getLastSeenSlugs,
      getFeeds: getFeeds,
      getCurrentContentLangs: getCurrentContentLangs,
      setCurrentContentLangs: setCurrentContentLangs,
      getAllowedLangs: getAllowedContentLangs
    };

    $rootScope.$on('changeContentLang', onContentLangChange);
    return catalogService;


    function init(_catalogs, _preferences, _lastSeen) {
      if (hasBeenInitialized) {
        return;
      } else {
        hasBeenInitialized = true;
      }

      var isPrivateCatalog = function(catalog) { return catalog.private_catalog; };
      var isPublicCatalog = function(catalog) { return !isPrivateCatalog(catalog); };

      preferences = _preferences;
      lastSeenSlug = _lastSeen;
      privateCatalogs = _catalogs.filter(isPrivateCatalog);
      publicCatalogs = _catalogs.filter(isPublicCatalog);

      var _currentCatalog = findCurrentCatalog(publicCatalogs, preferences);
      currentCatalog = _currentCatalog;
      setupCurrentCatalog(_currentCatalog, privateCatalogs);

      if ($filter('isState')('auth') && ! ApplicationStateService.hasValidPreLoginLocationWithRelaxArticle()) {
        var currentFeed = currentCatalog.feeds.getCurrentFeed();
        currentFeed.goToFeed();
      }
    }

    function initDefaultCatalog() {
      var privateCatalogs = [{
        name: 'open-private-catalog',
        description: 'My catalog',
        feeds: [],
        private_catalog: true
      }];

      return FeedDataService.getDefaultFeeds()
        .then(function(feeds) {
          var partialCatalog = {
            name: 'relax',
            description: 'Relax - Open catalog',
            feeds: feeds,
            private_catalog: false
          };

          currentCatalog = partialCatalog;
          setupCurrentCatalog(partialCatalog, privateCatalogs);
        });
    }

    function clearAllData() {
      ContentLangService.clearAllData();
      FeedService.clearAllData();

      hasBeenInitialized = false;
      currentCatalog = {};
      publicCatalogs = {};
      privateCatalogs = {};
      preferences = {};
      lastSeenSlug = {};
      currentContentLangs = [];
    }

    function setupCurrentCatalog(partialCatalog, privateCatalogs) {
      var catalogName = partialCatalog.name;
      var feedOptions = {
        sourceName: CatalogConfigService.getSourceName(catalogName),
        className: CatalogConfigService.getCatalogClass(catalogName),
        contentLangs: CatalogConfigService.getCatalogContentLangs(catalogName),
        defaultFeedSlug: CatalogConfigService.getCatalogDefaultFeed(catalogName),
        hasVirtualFeeds: CatalogConfigService.hasVirtualFeeds(catalogName),
        hasMySources: CatalogConfigService.hasMySources(catalogName),
        hasPusher: CatalogConfigService.hasPusher(catalogName),
        hasFolders: CatalogConfigService.hasFolders(catalogName),
        hasArbitraryFeedOrder: CatalogConfigService.hasArbitraryFeedOrder(catalogName),
        arbitraryFeedOrder: CatalogConfigService.getArbitraryFeedOrder(catalogName)
      };

      ContentLangService.init(feedOptions.contentLangs, UserPreferencesService.getContentLang());

      var feeds = FeedService.getCatalogFeeds(catalogName,
        partialCatalog.feeds,
        feedOptions,
        privateCatalogs);

      var isPoc = partialCatalog.private_catalog ? false : CatalogConfigService.isPoc(catalogName);

      currentCatalog = {
        name: catalogName,
        description: partialCatalog.description,
        feedOptions: feedOptions,
        feeds: feeds,
        isPoc: isPoc
      };

      $rootScope.$emit('catalogChanged', currentCatalog);
      var currentFeed = feeds.getInitialFeed();
      currentFeed.setAsCurrent();
    }

    function switchToCatalog(catalogName) {
      if(!catalogName){
        return;
      }

      if(catalogName !== currentCatalog.name){
        var newCatalog = _.find(publicCatalogs, {name: catalogName});
        if (newCatalog) {
          setupCurrentCatalog(newCatalog, privateCatalogs);
        } else {
          console.log("Error: Catalog '"+catalogName+"' not found in user catalogs.");
        }
      }

      var currentFeed = currentCatalog.feeds.getCurrentFeed();
      currentFeed.goToFeed();
    }

    function getCurrentFeed() {
      return FeedService.getCurrentFeed();
    }

    function getFeedBackendSlug(feedFrontendSlug) {
      var feeds = currentCatalog.feeds;
      var feed = feeds.getFeedBySlug(feedFrontendSlug);

      if (feed.type === 'real') {
        return feed.slug;
      } else if (feed.isInMySources){
        var feedSlugs = _.chain(feeds.feeds)
          .filter({isInMySources: true, type: 'real'})
          .map('slug')
          .join(',').value();
        return feedSlugs;
      } else {
        return 'all:' + currentCatalog.name;
      }
    }

    function onContentLangChange() {
      UserPreferencesService.setContentLang(ContentLangService.getCurrent());
      currentCatalog.feeds.updateFolders();

      var locationSearch = $location.search();
      $state.go($state.current.name, {
        langs: ContentLangService.getCurrent(true),
        modal: locationSearch.modal,
        articleId: locationSearch.articleId,
        sourceType: locationSearch.sourceType,
        sourceLang: locationSearch.sourceLang
      });
    }


    /**
     *
     * @param boolean indicating whether we want result as an array or as a string
     * @returns Either a subset included in ['en', 'fr'] or a string like 'en', 'fr' or 'en-fr'.
     */
    function getCurrentContentLangs(asSlug) {
      return currentCatalog.contentLangs.getCurrent(asSlug);
    }

    function setCurrentContentLangs(langs) {
      var onLangChangeCallback = function(contentLang) {
        currentContentLangs = contentLang.getCurrent();
        UserPreferencesService.setContentLang(contentLang.getCurrent());
        FoldersService.initializeFoldersForCatalog(currentCatalog, contentLang.getCurrent());

        var locationSearch = $location.search();
        $state.go($state.current.name, {
          langs: contentLang.getCurrent(true),
          modal: locationSearch.modal,
          articleId: locationSearch.articleId,
          sourceType: locationSearch.sourceType,
          sourceLang: locationSearch.sourceLang
        });
      };

      currentCatalog.contentLangs.setCurrent(langs, onLangChangeCallback);
    }

    function getAllowedContentLangs(asSlug) {
      return currentCatalog.contentLangs.getAllowed(asSlug);
    }



    function getArrayAllCatalogs (){
      return publicCatalogs;
    }

    function getCurrentCatalog() { return currentCatalog; }

    function getCatalogClass() { return currentCatalog.feedOptions.className; }

    function findCurrentCatalog(catalogs, preferences) {
      var catalogError = {
        name: 'Error',
        message: 'There is no catalog for catalogService user'
      };
      if (!catalogs) {
        $rootScope.$broadcast('catalogError', catalogError);
        throw catalogError;
      }

      var urlPart = $location.url();
      var currentSlug = extractSearchName(urlPart, 'select/');
      var lastSlugSaved = currentSlug || getLastSlugSaved();

      var currentCatalog;
      // TODO : we can still simplify this code by having a {catalog/slug} pair saved each time
      if(lastSlugSaved){
        if(lastSlugSaved === 'all' || lastSlugSaved === 'myall'){
          currentCatalog = getCatalogByName(catalogs, 'relax');
        }else{
          currentCatalog = getCatalogBySlug(catalogs, lastSlugSaved);
          if(!currentCatalog){
            currentCatalog = getDefaultCatalog(catalogs);
          }
        }
      }else{
        currentCatalog = getDefaultCatalog(catalogs);
      }
      if(!currentCatalog){
        $rootScope.$emit('catalogError', catalogError);
        throw catalogError;
      }

      return currentCatalog;
    }



    function extractSearchName(chaine, begin) {
      var startExtract = chaine.indexOf(begin);
      if(startExtract === -1){
        return;
      }
      var extractUrl = chaine.split("/");
      var searchName = extractUrl[3];
      return searchName;
    }

    function  getFeeds () {
      return currentCatalog.feeds;
    }

    function getPrivateCatalog (){
      return _.first(privateCatalogs);
    }


    function  getCatalogName(){
      return currentCatalog.name;
    }


    function getCatalogByName(catalogs,name) {
      if(catalogs){
        for(var i = 0; i < catalogs.length; i= i + 1 ){
          if(catalogs[i].name === name){
            return catalogs[i];
          }
        }
      }
    }


    function  getLastSlugSaved(){
      return preferences.currentSlug;
    }


    function getCatalogBySlug(catalogs, slug) {
      for(var i = 0; i < catalogs.length; i = i + 1) {
        if (!isMySourcesCatalog(catalogs[i]) && isSlugInCatalogFeeds(slug, catalogs[i])) {
          return catalogs[i];
        }
      }
    }


    function isMySourcesCatalog(catalog) {
      return catalog.name.indexOf('@') !== -1;
    }


    function isSlugInCatalogFeeds (slug, catalog) {
      return catalog.feeds.some(function(feed) {
        return feed.slug === slug;
      });
    }


    function getDefaultCatalog(catalogs){
      var defaultCatalog = isInCatalogs(catalogs, 'relax') ? getCatalogByName(catalogs, 'relax') : catalogs[catalogs.length -1];
      return defaultCatalog;
    }


    function isInCatalogs(catalogs, catalogName) {
      return catalogs.some(function(catalog) {
        return catalog.name === catalogName;
      });
    }

    function setCurrentSlug(slug){
      preferences.currentSlug = slug;
      PreferencesService.updatePreferences(preferences).then(function(){
        console.log('Preferences updated...');
      });
    }

    function getLastSeenSlugs(){
      return lastSeenSlug;
    }


  }
 
}());
