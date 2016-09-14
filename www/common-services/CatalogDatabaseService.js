    /* jshint ignore:start */
    'use strict';
    /* jshint ignore:end */

    (function() {
         var commonService = angular.module('common-service.module');

       commonService.Service(['$resource', 'relaxReaderSettings', CatalogDatabaseService]);

      function CatalogDatabaseService($resource, relaxReaderSettings) {
        var catalogDatabaseService = {
          saveFeed: saveFeed,
          deleteFeed: deleteFeed
        };
        return catalogDatabaseService;

        function saveFeed(feedSlug, privateCatalogName) {
          var feedResource = $resource(relaxReaderSettings.urlAPI + '/catalogs/:mySources/feeds',{},{
            save:{
              method: 'POST',
              params:{
                mySources: '@mySources',
                feedSlug:'@feedSlug'
              }
            }
          });

          return feedResource.save({
            mySources: privateCatalogName,
            feedSlug: feedSlug
          }).$promise;
        }

        function deleteFeed(feedSlug, privateCatalogName) {
          var feedResource = $resource(relaxReaderSettings.urlAPI + '/catalogs/:mySources/feeds/:slug',{},{
            query:{
              method: 'DELETE',
              params:{
                mySources: '@mySources',
                slug: '@slug'
              }
            }
          });

          return feedResource.query({
            mySources: privateCatalogName,
            slug: feedSlug
          }).$promise;
        }

      }

    }());
