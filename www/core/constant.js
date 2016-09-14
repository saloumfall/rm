
(function(){
    'use strict';
    
var core = angular.modul('relaxReaderMobileApp.core');

core.constant('relaxReaderSettings', {
      urlAPI: "https://api-v2-dev.relaxnews.net/v2",
      urlSearchAPI: "https://apisearch-v2-dev.relaxnews.net/v2",
      urlStaticImage :'https://static{#}-apisearch-v2-dev.relaxnews.net/v2/resource',
      urlApiStaticSuffixRelaxImage: '/relax/image',
      urlApiStaticSuffixTrendsBoardImage: '/image',
      urlSearchApiRelaxImage: "https://apisearch-v2-dev.relaxnews.net/v2/resource/relax/image",
      urlSearchApiTrendsBoardImage: "https://apisearch-v2-dev.relaxnews.net/v2/resource/image",
      urlShareApi: "https://apishare-v2-dev.relaxnews.net",
      apiKey: "pVQ8ZvCjPkbAHTHiNT7tCTKx2dgvqW",
      pusherAuthEndPoint: 'pusher_auth',
      pusherApiKey: '26a9304328f76e5ad6c6', 
      index: ['tbc_fr', 'tbmsearch_fr', 'tbmsearch_en'],
      sourceLangs: ['fr', 'en'],
      sourceType: ['tbc', 'tbmsearch', 'tbmsearch'],
      preferenceVersion: '0.0.1',
      contactEmail: 'youreditorializer@relaxnews.com'
    })
    .constant('LANGS', ['fr', 'en'])
    .constant('USER_ROLES', {
      all: '*',
      admin: 'Admin',
      editor: 'Editor',
      manager: 'Manager',
      guest: 'guest'
    });
}());