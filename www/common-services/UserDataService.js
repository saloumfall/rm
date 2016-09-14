/* jshint ignore: start */
'use strict';
/* jshint ignore : end */

(function(){
    
    var commonService = angular.module('common-service.module');
    commonService.service([UserDataService]);
    
  function UserDataService(){

    var openUserData = {
      id: -1,
      name: undefined,
      email: undefined,
      roles: [{
        id: -1,
        name: 'RelaxOpenGuest'
      }]
    };

    var userData = {};
    var userDataService = {
      initUserData : initUserData,
      clearUserData: clearUserData,

      getUserRole: getUserRole,
      getUserEmail: getUserEmail,
      getUserName: getUserName,
      getUserId: getUserId,


      isOpenUser: isOpenUser,
      isFreeSubscriptionUser: isFreeSubscriptionUser,
      isPaidSubscriptionUser: isPaidSubscriptionUser,

      shouldShowWelcomeText: shouldShowWelcomeText,
      hasMySourcesLimitation: hasMySourcesLimitation,
      maximumPrivateFeedNumber: maximumPrivateFeedNumber,
      hasRightsToChangePeriod: hasRightsToChangePeriod,
      hasLimitedReaderAccess: hasLimitedReaderAccess,
      hasLimitedSearchAccess: hasLimitedSearchAccess,
      hasRightToAfpArticleOption: hasRightToAfpArticleOption,
      hasRightToPublishPage: hasRightToPublishPage,
      hasRightToOnDemandForm: hasRightToOnDemandForm
    };

    return userDataService;

    function initUserData(data) {
      userData = data || openUserData;
    }

    function clearUserData() {
      userData = {};
    }

    function getUserRole() {
      return userData.roles[0].name || openUserData.roles[0].name;
    }

    function getUserEmail() {
      return userData.email;
    }

    function getUserName() {
      return userData.firstname;
    }

    function getUserId() {
      return userData.id;
    }



    function isOpenUser() {
      var role = getUserRole();
      return role === 'RelaxOpenGuest';
    }

    function isFreeSubscriptionUser() {
      var role = getUserRole();
      return role === 'RelaxOpenUser';
    }

    function isPaidSubscriptionUser() {
      return !isOpenUser() && !isFreeSubscriptionUser();
    }



    function shouldShowWelcomeText() {
      return isOpenUser();
    }

    function hasMySourcesLimitation() {
      return !isPaidSubscriptionUser();
    }

    function maximumPrivateFeedNumber() {
      return isOpenUser() ? 1 : 3;
    }

    function hasRightsToChangePeriod() {
      return isPaidSubscriptionUser();
    }

    function hasLimitedReaderAccess() {
      return !isPaidSubscriptionUser();
    }

    function hasLimitedSearchAccess() {
      return !isPaidSubscriptionUser();
    }

    function hasRightToAfpArticleOption() {
      return isPaidSubscriptionUser();
    }

    function hasRightToPublishPage() {
      return !isOpenUser();
    }

    function hasRightToOnDemandForm() {
      return !isOpenUser();
    }
  }

  
}());
