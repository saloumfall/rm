var core = angular.modul('relaxReaderMobileApp.core');

core.config(['$translateProvider', translateProviderFn])
    .config(['$compileProvider', debugInfoFn])
    .config(['$httpProvider', '$tooltipProvider', '$sceDelegateProvider', configFn]);



  function configFn ($httpProvider, $tooltipProvider, $sceDelegateProvider) {
    $httpProvider.defaults.withCredentials = true;
    $tooltipProvider.options({animation: false});
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      "https://www.youtube.com/embed/**",
      "https://www.youtube.com/**",
      "https://vimeo.com/**",
      "https://player.vimeo.com/video/**",
      "https://www.kickstarter.com/**",
      "http://repository.relaxnews.net/swf/",
      "https://s3-eu-west-1.amazonaws.com/relaxnews/videos/**",
      "http://www.google.fr/trends/**",
      "http://www.google.fr/trends/fetchComponent",
      "http://platform.instagram.com/en_US/**"
    ]);
    $httpProvider.interceptors.push('APIInterceptor');
  }
function translateProviderFn ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix : "translate/relaxplatform_translate_i18n_export_",
        suffix : ".json"
      });
      $translateProvider.useSanitizeValueStrategy('escape');
      $translateProvider.preferredLanguage('en');
      $translateProvider.useCookieStorage();
}
function debugInfoFn($compileProvider){
     $compileProvider.debugInfoEnabled(false);
}