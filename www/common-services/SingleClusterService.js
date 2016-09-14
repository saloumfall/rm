/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function(){
     var commonService = angular.module('common-service.module');
    
    commonService.factory(['$resource', 'relaxReaderSettings', SingleClusterService]);
    
	function SingleClusterService($resource, relaxReaderSettings) {

		return $resource(relaxReaderSettings.urlSearchAPI + '/content/cluster/:lang/:id',{}, {
			getClusterById: {
				method: 'GET',
				params: {
					lang: '@lang',
					id: '@clusterId'
				}
			}
		});
	}

	
}());
