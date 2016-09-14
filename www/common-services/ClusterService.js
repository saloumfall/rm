/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function () {
     var commonService = angular.module('common-service.module');
  commonService.factory(['$resource', '$http', 'relaxReaderSettings', ClusterService]);
    
  function ClusterService($resource, $http,  relaxReaderSettings) {

    var clusterService = {
      getClustersByNewAPI: getClustersByNewAPI,
      getClusterDetails: getClusterDetails
    };
    return clusterService;


    function getClustersByNewAPI(isRelaxnewsAfpFeed) {
      var urlParams = isRelaxnewsAfpFeed ? '/content/relax/feed/:lang/:categories' : '/content/:type/:lang/:categories';


      return $resource(relaxReaderSettings.urlSearchAPI + urlParams, {indexes: '@indexes', categories: '@categories'}, {
        query: {
          method: 'GET',
          params: {
            lang: '@lang',
            cluster: '@cluster',
            listFrom: '@listFrom',
            listTo: '@listTo',
            sortField: '@order'
          }
        }
      });
    }

    function getClusterDetails(queryParams){
      var clusterId = queryParams.id;
      var params = queryParams.lang + '/'+clusterId ;
      var req = relaxReaderSettings.urlSearchAPI + '/content/cluster/' + params;
      var promise  = $http.get(req,{cache: true})
        .then(function(response){
            return response.data;
          },function (error) {
            console.log(error);
          }
        );
      return promise;
    }
  }

  
}());
