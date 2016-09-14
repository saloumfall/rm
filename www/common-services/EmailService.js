/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function () {
    var commonService = angular.module('common-service.module');
    commonService.service(['$resource', 'relaxReaderSettings', EmailService]);
    
  function EmailService($resource, relaxReaderSettings) {
    return $resource(relaxReaderSettings.urlAPI + '/users/send_news_via_email', {}, {
      query: {
        method: 'POST',
        params: {
          recipient_name: '@recipient_name',
          recipient_email: '@recipient_email',
          article_id: '@article_id',
          index: '@index',
          type: '@type'
        }
      }
    });
  }

  
}());
