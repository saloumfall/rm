/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function() {
    var commonService = angular.module('common-service.module');
    commonService.Service('CatalogConfigService',['_',CatalogConfigService]);
    
  function CatalogConfigService(_) {
    var catalogConfigService = {
      getCatalogContentLangs: getCatalogContentLangs,
      getCatalogDefaultFeed: getCatalogDefaultFeed,
      getSourceName: getSourceName,
      getCatalogClass: getCatalogClass,
      isPoc: isPoc,
      hasVirtualFeeds: hasVirtualFeeds,
      hasMySources: hasMySources,
      hasPusher: hasPusher,
      hasFolders: hasFolders,
      hasArbitraryFeedOrder: hasArbitraryFeedOrder,
      getArbitraryFeedOrder: getArbitraryFeedOrder,
      getPlaceholderFeeds: getPlaceholderFeeds,
      getSelectTitles: getSelectTitles,
      getDefaultSearchNameByCatalog: getDefaultSearchNameByCatalog
    };
    return catalogConfigService;

    function getCatalogContentLangs(catalogName) {
      var contentLangsByCatalogName = {
        'l-oreal': ['en'],
        'poc-toyota': ['en'],
        'poc-laposte': ['fr'],
        'poc-jpmorgan-interne': ['en'],
        'poc-jpmorgan-externe': ['en'],
        'anses': ['fr'],
        'poc-boursorama': ['fr'],
        'renault': ['fr'],
        'poc-verizon-int': ['en'],
        'poc-verizon-ext': ['en'],
        'poc-verizon-go90': ['en'],
        'poc-bankofamerica':['en'],
        'poc-intersport':['fr'],
        'poc-mvc': ['fr']
      };

      var contentLangs = contentLangsByCatalogName[catalogName] || ['en', 'fr'];
      return contentLangs;
    }



    function getCatalogDefaultFeed(catalogName) {
      var defaultFeedByCatalogName = {
        'relax': 'high-tech-jeux-video',
        'bnp': 'custom-bnp',
        'renault': 'poc-renault',
        'canneslions': 'custom-cannes-lions',
        'afp-sports': 'afp-cyclisme',
        'anses': 'anses-securite-alimentaire',
        'l-oreal': 'l-oreal-skinactive',
        'poc-societe-generale': 'societe-generale',
        'poc-societe-generale-externe': 'custom-semiconductors',
        'poc-boursorama': 'boursorama',
        'poc-societe-generale-pme': 'societe-generale-pme',
        'poc-bankofamerica': 'bankofamerica-davos',
        'poc-toyota': 'toyota-rav4-hybrid',
        'poc-laposte': 'laposte-numerique-quotidien',
        'poc-jpmorgan-interne': 'jpmorgan-real-estate',
        'poc-jpmorgan-externe': 'jpmorgan-real-estate',
        'poc-verizon-ext': 'verizon-healthcare-ext',
        'poc-verizon-int': 'verizon-healthcare-int',
        'poc-verizon-go90': 'go90-snooki-and-jwoww',
        'poc-intersport': 'intersport-football'
      };

      return defaultFeedByCatalogName[catalogName];
    }

    function getSourceName(catalogName) {
      var sourceNameByCatalogName = {
        'relax': 'Relax Sources',
        'afp-sports': 'AFP Sources',
        'bnp': 'BNPP Sources',
        'l-oreal': 'Garnier Sources',
        'poc-societe-generale': 'We Are The Bank',
        'poc-societe-generale-externe': 'We Are The Bank',
        'poc-societe-generale-pme': 'We Are The Bank',
        'anses': 'ANSES Sources',
        'renault': "Renault topics",
        'poc-toyota': 'TOYOTA Sources',
        'poc-laposte': 'TOPICS',
        'poc-jpmorgan-interne': 'JP MORGAN Sources',
        'poc-jpmorgan-externe': 'JP MORGAN Sources',
        'poc-boursorama': 'En ligne avec vous',
        'poc-verizon-ext': 'Rethink your network',
        'poc-verizon-int': 'Rethink your network',
        'poc-verizon-go90': 'go90 sources',
        'poc-bankofamerica':'Bank of America Sources',
        'poc-intersport':'Intersport Sources',
        'poc-mvc': 'Ma Vie en Couleurs Sources'
    };

      return sourceNameByCatalogName[catalogName] || 'Relax Sources';
    }

    function getCatalogClass(catalogName) {
      // At first, there was a distinction between 'relax' catalog from logged API call and 'open-catalog',
      // the openAPI call to get the relax catalog.
      // This distinction is no more, but it led to a (handy) decoupling between the catalog used and the theme used.
      // Even thought this function is just the identity function right now,
      // It can be useful for multiple related catalog.
      return catalogName;
    }

    function isPoc(catalogName) {
      return (catalogName !== 'relax');
    }

    function hasVirtualFeeds(catalogName) {
      var catalogsWithVirtualFeeds = ['relax'];
      return _.includes(catalogsWithVirtualFeeds, catalogName);
    }

    function hasMySources(catalogName) {
      var catalogsWithMySources = ['relax'];
      return _.includes(catalogsWithMySources, catalogName);
    }

    function hasPusher(catalogName) {
      var catalogsWithPusher = ['relax'];
      return _.includes(catalogsWithPusher, catalogName);
    }

    function hasFolders(catalogName) {
      var catalogsWithFolders = ['relax'];
      return _.includes(catalogsWithFolders, catalogName);
    }


    function hasArbitraryFeedOrder(catalogName) {
      var catalogsWithArbitraryFeedOrder = ['poc-societe-generale-externe', 'poc-laposte'];
      return _.includes(catalogsWithArbitraryFeedOrder, catalogName);
    }

    function getArbitraryFeedOrder(catalogName) {

      var arbitraryFeedOrderByCatalog = {
        'poc-societe-generale-externe': [
          {
            name: "Companies",
            order: 0
          }, {
            name: "Competitors",
            order: 1
          }, {
            name: "Events",
            order: 3
          }, {
            name: "Institutions",
            order: 4
          }, {
            name: "Opinion leaders",
            order: 5
          }, {
            name: "Indexes",
            order: 6
          }
        ],
        'poc-laposte': [
          {
            name: "Proximité citoyenne",
            order: 0
          }, {
            name: "Proximité vie quotidienne",
            order: 1
          }, {
            name: "Proximité  géographique"
          }
        ]
      };

      return arbitraryFeedOrderByCatalog[catalogName] || [];
    }

    function getPlaceholderFeeds(catalogName) {
      var hardcodedFeedsByCatalog = {
        'bnp': [
          {
            "name": "Mature markets",
            "slug": "mature-markets",
            "extended_name": "Mature - Markets"
          },
          {
            "name": "Emerging geography",
            "slug": "emerging-geography",
            "extended_name": "Emerging - Geography"
          },
          {
            "name": "Future world",
            "slug": "future-world",
            "extended_name": "Future - World"
          },
          {
            "name": "Innovative industries",
            "slug": "innovative-industries",
            "extended_name": "Innovative - Industries"
          },
          {
            "name": "Tomorrows finance",
            "slug": "tomorrows-finance",
            "extended_name": "Tomorrows - finance"
          },
          {
            "name": "Political environment",
            "slug": "political-environment",
            "extended_name": "Political - Environment"
          },
          {
            "name": "Social moves",
            "slug": "social-moves",
            "extended_name": "Social - Moves"
          },
          {
            "name": "Changing mind",
            "slug": "changing-mind",
            "extended_name": "Changing - Mind"
          }],
        'l-oreal': [{
          "name": "Psych & Sex",
          "slug": "psych-sex",
          "extended_name": "Psych - Sex"
        }],
        'poc-societe-generale': [
          {
            "name": "Events",
            "slug": "events",
            "extended_name": "Events"
          },
          {
            "name": "Institutions",
            "slug": "institutions",
            "extended_name": "Institutions"
          },
          {
            "name": "Opinion leaders",
            "slug": "opinion-leaders",
            "extended_name": "Opinion leaders"
          },
          {
            "name": "Indexes",
            "slug": "indexes",
            "extended_name": "Indexes"
          }
        ],
        'poc-societe-generale-externe': [
          {
            "name": "Companies",
            "slug": "companies",
            "extended_name": "Companies"
          },{
            "name": "Competitors",
            "slug": "competitors",
            "extended_name": "Competitors"
          },{
            "name": "Events",
            "slug": "events",
            "extended_name": "Events"
          },{
            "name": "Institutions",
            "slug": "institutions",
            "extended_name": "Institutions"
          },{
            "name": "Opinion leaders",
            "slug": "opinion-leaders",
            "extended_name": "Opinion leaders"
          },{
            "name": "Indexes",
            "slug": "index",
            "extended_name": "Indexes"
          }],
        'poc-societe-generale-pme': [
          {
            "name": "Développement international",
            "slug": "developpement-international",
            "extended_name": "Développement international"
          },
          {
            "name": "Dirigeants",
            "slug": "dirigeants",
            "extended_name": "Dirigeants"
          },
          {
            "name": "Financement",
            "slug": "financement",
            "extended_name": "Financement"
          },
          {
            "name": "Gestion des flux",
            "slug": "gestion-des-flux",
            "extended_name": "Gestion des flux"
          },
          {
            "name": "Placements",
            "slug": "placements",
            "extended_name": "Placements"
          },
          {
            "name": "Protection des salariés",
            "slug": "protection-des-salaries",
            "extended_name": "Protection des salariés"
          }
        ],
        'poc-boursorama': [
          {
            "name": "Technologie",
            "slug": "technologie",
            "extended_name": "Technologie"
          },
          {
            "name": "Transport",
            "slug": "transport",
            "extended_name": "Transport"
          },
          {
            "name": "Voyage",
            "slug": "voyage",
            "extended_name": "Voyage"
          },
          {
            "name": "Santé",
            "slug": "sante",
            "extended_name": "Santé"
          },
          {
            "name": "Mode & beauté",
            "slug": "mode-beaute",
            "extended_name": "Mode & beauté"
          },
          {
            "name": "Culture",
            "slug": "culture",
            "extended_name": "Culture"
          }
        ],
        'anses': [
          {
            "name": "Santé environnement",
            "slug": "sante-environnement",
            "extended_name": "Santé environnement"
          },
          {
            "name": "Santé au travail",
            "slug": "sante-au-travail",
            "extended_name": "Santé au travail"
          },
          {
            "name": "Santé végétale",
            "slug": "sante-vegetale",
            "extended_name": "Santé végétale"
          },
          {
            "name": "Sécurité alimentaire",
            "slug": "securite-alimentaire",
            "extended_name": "Sécurité alimentaire"
          }
        ],
        'poc-toyota': [{
          "name":"Automotive",
          "slug": "automotive",
          "extended_name": "Automotive"
        }],
        'poc-laposte' : [{
          "name":"Proximité citoyenne",
          "slug": "proximite-citoyenne",
          "extended_name": "Proximité citoyenne"
        }, {
          "name":"Proximité vie quotidienne",
          "slug": "proximite-vie-quotidienne",
          "extended_name": "Proximité vie quotidienne"
        }, {
          "name":"Proximité géographique",
          "slug": "proximite-geographique",
          "extended_name": "Proximité géographique"
        }],
        'poc-jpmorgan-interne': [{
          "name": "Semi conductors",
          "slug": "semi-conductors",
          "extended_name": "Semi conductors"
        }],
        'poc-jpmorgan-externe': [{
          "name": "Semi conductors",
          "slug": "semi-conductors",
          "extended_name": "Semi conductors"
        }],
        'poc-intersport' : [{
          "name":"Sports extrêmes",
          "slug": "sports-extremes",
          "extended_name": "Sports extrêmes"
        }, {
          "name":"Running",
          "slug": "running",
          "extended_name": "Running"
        }, {
          "name":"Cyclisme",
          "slug": "cyclisme",
          "extended_name": "Cyclisme"
        }, {
          "name":"Ski",
          "slug": "ski",
          "extended_name": "Ski"
        }]/*,
        'poc-mvc': [{
          'name': "soin & beauté",
          slug: 'soin & beauté',
          'extended_name': 'soin & beauté'
        },{
          'name': "maison",
          slug: 'maison',
          'extended_name': 'maison'
        },{
          'name': "loisirs",
          slug: 'loisirs',
          'extended_name': 'loisirs'
        }]*/
      };

      return hardcodedFeedsByCatalog[catalogName] || [];
    }

    function getSelectTitles(catalogName) {
      var defaultSelectTitles = {
        radarTitle : 'Relax Radar',
        contentTitle : 'AFP Relaxnews',
        readerTitle : 'Relax Reader'
      };

      var selectTitlesByCatalog = {
        'bnp': {
          radarTitle : 'Radar for a changing world',
          contentTitle : 'Content for a changing world',
          readerTitle : 'Reader for a changing world'
        },
        'poc-boursorama': {
          radarTitle  : ' RADAR' ,
          contentTitle  : ' NEWS' ,
          readerTitle  : ' READER'
        },
        'poc-toyota':{
          radarTitle  : ' RADAR ' ,
          contentTitle  : ' CONTENT' ,
          readerTitle  : ' READER'
        },
        'relax': {
          radarTitle : 'Paris Modes radar',
          contentTitle : 'Paris Modes Stories',
          readerTitle : 'Paris Modes reader'
        },
        'renault': {
          radarTitle : 'RADAR',
          contentTitle : 'CONTENTS',
          readerTitle : 'READER'
        },
        'afp-sports': {
          radarTitle  : 'AFP SPORTS RADAR' ,
          contentTitle  : 'AFP SPORTS' ,
          readerTitle  : 'AFP SPORTS READER'
        },
        'l-oreal': {
          radarTitle  : 'SKINACTIVE RADAR' ,
          contentTitle  : 'SKINACTIVE CONTENT' ,
          redearTitle  : 'SKINACTIVE READER'
        },
        'poc-societe-generale': {
          radarTitle  : ' BANK\'S RADAR' ,
          contentTitle  : ' BANK\'S CONTENT' ,
          readerTitle  : ' BANK\'S READER'
        },
        'poc-societe-generale-externe':{
          radarTitle  : ' BANK\'S RADAR' ,
          contentTitle  : ' BANK\'S CONTENT' ,
          readerTitle  : ' BANK\'S READER'
        },
        'poc-societe-generale-pme':{
          radarTitle  : ' BANK\'S RADAR' ,
          contentTitle  : ' BANK\'S CONTENT' ,
          readerTitle  : ' BANK\'S READER'
        },
        'anses': {
          radarTitle: 'ANSES RADAR',
          contentTitle: 'ANSES CONTENT',
          readerTitle: 'ANSES READER'
        },
        'poc-laposte':{
          radarTitle: ' RADAR',
          contentTitle: ' CONTENT',
          readerTitle: ' READER'
        },
        'poc-jpmorgan-interne':{
          radarTitle: ' RADAR ',
          contentTitle: ' CONTENT ',
          readerTitle: ' READER '
        },
        'poc-jpmorgan-externe':{
          radarTitle: ' RADAR ',
          contentTitle: ' CONTENT ',
          readerTitle: ' READER '
        },
        'poc-verizon-ext':{
          radarTitle: ' RADAR ',
          contentTitle: ' CONTENT ',
          readerTitle: ' READER '
        },
        'poc-verizon-int':{
          radarTitle: ' RADAR ',
          contentTitle: ' CONTENT ',
          readerTitle: ' READER '
        },
        'poc-bankofamerica':{
          radarTitle: ' RADAR',
          contentTitle: ' CONTENT',
          readerTitle: ' READER'
        },
        'poc-intersport':{
          radarTitle: ' RADAR',
          contentTitle: ' RELAXNEWS CONTENT',
          contentTitle2: ' AFP CONTENT',
          readerTitle: ' READER'
        }
      };

      return selectTitlesByCatalog[catalogName] || defaultSelectTitles;
    }

    function getDefaultSearchNameByCatalog(catalogName){
      var defaultSearchName = {
        'relax': {
          searchName: 'high-tech-jeux-video'
        },
        'bnp': {
         searchName: 'custom-bnp'
        },
        'poc-boursorama': {
          searchName: 'boursorama'
        },
        'poc-toyota':{
          searchName: 'toyota-rav4-hybrid'
        },
        'renault': {
          searchName: 'poc-renault'
        },
        'afp-sports': {
          searchName: 'afp-cyclisme'
        },
        'l-oreal': {
          searchName: 'l-oreal-skinactive'
        },
        'poc-societe-generale': {
          searchName: 'societe-generale'
        },
        'poc-societe-generale-externe':{
          searchName: 'custom-semiconductors'
        },
        'poc-societe-generale-pme':{
          searchName: 'societe-generale-pme'
        },
        'anses': {
          searchName: 'anses-securite-alimentaire'
        },
        'poc-laposte':{
          searchName: 'laposte-numerique-quotidien'
        },
        'poc-jpmorgan-interne':{
          searchName: 'jpmorgan-real-estate'
        },
        'poc-jpmorgan-externe':{
          searchName: 'pmorgan-real-estate'
        },
        'poc-verizon-ext':{
          searchName: 'verizon-healthcare-ext'
        },
        'poc-verizon-int':{
          searchName: 'verizon-healthcare-int'
        },
        'poc-bankofamerica':{
          searchName: 'verizon-healthcare-int'
        },
        'poc-verizon-go90':{
          searchName : 'go90-snooki-and-jwoww'
        },
        'poc-intersport':{
          searchName: 'intersport-football'
        }
      };
      return defaultSearchName[catalogName];
    }

  }
 
}());
