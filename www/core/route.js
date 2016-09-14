    (function(){
        'use strict';

        var core = angular.modul('relaxReaderMobileApp.core');

        core.config(['$stateProvider','PusherServiceProvider', '$urlRouterProvider', configFn]);

        function configFn ($stateProvider,PusherServiceProvider ,$urlRouterProvider) {
        $urlRouterProvider.otherwise('/en/select/add-feed');
            
        var checkLogin = ['_', 'SessionService', 'AppDataService', 'ApplicationStateService', 'StorageService', '$state', '$http', '$location', '$q', '$rootScope', 'CatalogService', 'UserPreferencesService', 'relaxReaderSettings', checkLoginFn];

        function checkLoginFn (_, SessionService, AppDataService, ApplicationStateService, StorageService, $state, $http, $location, $q, $rootScope, CatalogService, UserPreferencesService, relaxReaderSettings) {
          var tokenName = StorageService.get('tokenName');
          var token = StorageService.get(tokenName);
          var deferred = $q.defer();

          ApplicationStateService.setupPreLoginLocationData($location.path(), $location.search(), $location.url());

          if (token) {
            $http.defaults.headers.common.Authorization = 'Basic ' + token;
            SessionService.check().then(function () {
              deferred.resolve();
             if($state.current.name === 'auth'){
               if(ApplicationStateService.hasValidPreLoginLocationWithRelaxArticle()) {
                 var preLoginUrl = ApplicationStateService.getPreLoginLocation();
                 $location.url(preLoginUrl);
               } else {
                 initAppPath();
               }
              }
            });
          } else {
            AppDataService.initDefaultData()
              .finally(function() {
              deferred.resolve();
            });
          }

          function initAppPath (){
            var contentLang = UserPreferencesService.getContentLang() || 'en';

            var catalog = CatalogService.getCatalog();
            var selectedFeeds = _.filter(catalog.feeds.feeds, {isInMySources: true});
            var nbRealSelectedFeeds = _.filter(selectedFeeds, {type: 'real'}).length;

            if (catalog.isPoc) {
              var defaultFeedSlug = catalog.feedOptions.defaultFeedSlug;
              $location.path("/"+contentLang+"/select/"+defaultFeedSlug);
            } else if (nbRealSelectedFeeds === 0) {
              $location.path("/"+contentLang+"/select/add-feed");
            } else {
              var feed = _.find(selectedFeeds, {type: "virtual"}) || _.first(selectedFeeds);
              $location.path("/"+contentLang+"/select/"+feed.slug);
            }
          }

          PusherServiceProvider
            .setToken(relaxReaderSettings.pusherApiKey)
            .setOptions({
              cluster: 'eu',
              encrypted: true,
              authEndpoint: relaxReaderSettings.urlAPI +'/'+ relaxReaderSettings.pusherAuthEndPoint,
              auth: {
                headers: {
                  'Authorization' : 'Basic ' + token
                }
              }
            });

          return deferred.promise;
        }

        var afpArticleModalParams = {
          modal: null,
          articleId: null,
          sourceType: null,
          sourceLang: null
        };

        $stateProvider
          .state('index', {
            templateUrl: 'assets/scripts/components/select/index.html',
            abstract: true,
            resolve: {
              auth: checkLogin
            },
            controller: 'CommonSelectController'
          })
          .state('index-header', {
            templateUrl: 'assets/scripts/components/navigation/templates/index-header.html',
            abstract: true,
            resolve: {
              auth: checkLogin
            }
          })
          .state('index.add-feed', {
            url: "/:langs/select/add-feed",
            templateUrl: 'assets/scripts/components/add-feed/add-feed.html',
            controller: 'AddFeedPageController'
          })
          .state('index.add-feed.feed-description', {
            url: "/feed-description/:searchName",
            templateUrl: 'assets/scripts/components/add-feed/feed-description/feed-description-panel.html',
            controller: 'FeedDescriptionPanelController'
          })
          .state('index.select', {
            url: "/:langs/select/:searchName?modal&articleId&sourceType&sourceLang",
            templateUrl: 'assets/scripts/components/select/select.html',
            controller: 'SelectController',
            params: afpArticleModalParams
          })
          .state('index.folders', {
            url: "/:langs/select/:searchName/folders/:folderID?modal&articleId&sourceType&sourceLang",
            templateUrl: 'assets/scripts/components/folders/folders.html',
            controller: 'SelectController',
            params: afpArticleModalParams
          })
          .state('index.select-afp-article', {
            url: "/:langs/select/:searchName?articleId",
            templateUrl: 'assets/scripts/components/select/select.html',
            controller: 'SelectController'
          })
          .state('index.search', {
            url: "/:langs/select/:searchName/search/:searchParam?modal&articleId&sourceType&sourceLang",
            templateUrl: 'assets/scripts/components/search/reader/result.html',
            controller: 'SearchController'
          })
          .state('index.afprelax', {
            url: "/:langs/select/:searchName/afprelax?modal&articleId&sourceType&sourceLang",
            templateUrl: 'assets/scripts/components/afp-relax/index.html',
            controller: 'SelectController',
            params: afpArticleModalParams
          })
          .state('index.afprelax-by-types-of-docs', {
            url: "/:langs/select/:searchName/afprelax/:typesOfDoc?modal&articleId&sourceType&sourceLang",
            templateUrl: 'assets/scripts/components/afp-relax/index.html',
            controller: 'SelectController',
            params: afpArticleModalParams
          })
          .state('index.web', {
            url: "/:langs/select/:searchName/reader",
            templateUrl: 'assets/scripts/components/select/reader/web.html',
            controller: 'SelectController'
          })
          .state('index.radar', {
            url: "/:langs/select/:searchName/radar",
            templateUrl: 'assets/scripts/components/radar/radar.html',
            controller: 'SelectController'
          })
          .state('index.press-release', {
            url: "/:langs/select/:searchName/press-release",
            templateUrl: 'assets/scripts/components/select/reader/press-release.html',
            controller: 'SelectController'
          })
          .state('index.agenda', {
            url: "/:langs/select/:searchName/agenda",
            templateUrl: 'assets/scripts/components/agenda/agenda.html',
            controller: 'AgendaController'
          })
          .state('index.afparticle', {
            url: "/:langs/select/:searchName/afprelax/:articleId",
            templateUrl: 'assets/scripts/components/afp-relax/index.html',
            controller: 'SelectController'
          })
          .state('index-header.ondemand', {
            url: "/:langs/ondemand",
            templateUrl: 'assets/scripts/components/on-demand/templates/ondemand.html',
            controller: 'OnDemandController'
          })
          .state('index-header.publish', {
            url: "/:langs/publish",
            templateUrl: 'assets/scripts/components/publish/templates/publish-new.html',
            controller: 'PublishController'
          })
          .state('index-header.publishnow', {
            url: "/:langs/publish/:subjectKey",
            templateUrl: 'assets/scripts/components/publish/templates/publish-new.html',
            controller: 'PublishController'
          })
          .state('index-header.preferences', {
            url: "/:langs/preferences",
            templateUrl: 'assets/scripts/components/preferences/templates/preferences.html',
            controller: 'PreferencesController'
          })
          .state('auth', {
            url: "/:langs/auth",
            params:{
              email: undefined
            },
            templateUrl: 'assets/scripts/components/auth/login/authentication.html',
            controller: 'AuthController'
          })
          .state('authentification', {
            url: "/authentification",
            templateUrl: 'assets/scripts/components/preferences/templates/authentification-one-all.html'
          })
          .state('forgot-pass', {
            url: '/:langs/auth/forgot-pass',
            templateUrl: 'assets/scripts/components/auth/login/forgot-pass.html',
            controller: 'AuthController'
          })
          .state('reset-password', {
            url: '/:langs/auth/reset-password',
            templateUrl: 'assets/scripts/components/auth/login/reset-password.html',
            controller: 'AuthController'
          })
          .state('registration', {
            url: '/:langs/registration',
            templateUrl: 'assets/scripts/components/auth/registration/registration.html',
            controller: 'RegistrationController',
            controllerAs: 'vm'
          })
          .state('confirmation', {
            url: '/:langs/confirm/:confirmationId',
            templateUrl: 'assets/scripts/components/auth/confirmation/confirmation.html',
            controller: 'ConfirmationController',
            controllerAs: 'vm'
          });
      }

    }());