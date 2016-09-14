    (function(){
        'use strict';

        var login = angular.module('relaxReaderMobileApp.login');

        login.controller('LoginCtrl',['$scope', '$filter', '$location', 
                                      'ApplicationStateService', '$state', 
                                      'AppDataService', '$rootScope', 'notify', 
                                      '$stateParams', 'AuthService', 'StorageService', 
                                      'SessionService', 'TrackEventUserService', LoginController]);

        function LoginController($scope, $ionicModal, $timeout,
                                $filter, $location, ApplicationStateService, $state, 
                                AppDataService, $rootScope, notify, 
                                $stateParams, AuthService, StorageService,
                                SessionService, TrackEventUserService) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      // Form data for the login modal
      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('components/login/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      };


             $scope.errorMessage = "Login HTTP Error";
        var defaultLang = navigator.language || navigator.userLanguage;
        $scope.interfaceLangs = $stateParams.langs ? $stateParams.langs : defaultLang;
        $scope.credentials = {
          email: $stateParams.email
        };

        $scope.authState = {
          isFail: false,
          isSuccess: false,
          isWaiting: false
        };


        $scope.$on('feedsError', function (event, data){
          $scope.errorCatalogMessage = data.message;
        });
        $rootScope.$on('catalogError', function (event, data){
          $scope.errorCatalogMessage = data.message;
        });
        $scope.showWaitFeedback = function() {
          $scope.authState.isWaiting = true;
          $scope.authState.isSuccess = false;
          $scope.authState.isFail = false;
        };

        $scope.showSuccessFeedback = function() {
          $scope.authState.isWaiting = false;
          $scope.authState.isSuccess = true;
          $scope.authState.isFail = false;
        };

        $scope.showErrorFeedback = function(data, HTTPStatus) {
          if (HTTPStatus === 412) {
            $scope.errorMessage = data.message;
          } else {
            $scope.errorMessage = 'Login HTTP Error';
          }

          $scope.authState.isWaiting = false;
          $scope.authState.isSuccess = false;
          $scope.authState.isFail = true;
        };


        $scope.translate = $filter('translate');

        $scope.login = function () {
          $scope.showWaitFeedback();
          AuthService.login($scope.credentials).
            success(function (data) {
              $scope.showSuccessFeedback();
              SessionService.create(data);
              var  userRole;
              if (data.roles) {
                userRole = data.roles[0].name;
              }

              StorageService.set('role', userRole);
              $rootScope.userId = data.id;
              SessionService.check().then(function () {
                TrackEventUserService.trackLogin();
              });
              if(ApplicationStateService.hasValidPreLoginLocationWithRelaxArticle()) {

                var preLoginUrl = ApplicationStateService.getPreLoginLocation();
                $location.url(preLoginUrl);
              }
            }).
            error(function (data, status) {
              $scope.showErrorFeedback(data, status);
            });
        };

        $scope.loginAsOpenUser = function() {
          AppDataService.initDefaultData()
            .then(function() {
              $state.go('index.add-feed', {langs: 'en'});
            }, function(error) {
              console.log('error in initDefaultData');
            });
        };

        $scope.logout = function () {
          TrackEventUserService.trackLogout();
          SessionService.destroy();
        };
        $scope.forgotPass = function () {
          AuthService.forgotPass($scope.credentials)
            .success(function (data, status, headers, config) {
              if (status === 200) {
                console.log(data.message);
                notify({
                  'message': $scope.translate(data.message, $scope.interfaceLangs),
                  'classes': 'notify'
                });
              }
            }).error(function (data, status, headers, config) {
              notify({
                'message': $scope.translate(data.message, $scope.interfaceLangs),
                'classes': 'notify'
              });
            });
        };


        $scope.getResetPassToken = function () {
          var searchObject = $location.search();
          return searchObject.token;
        };


        $scope.resetPass = function () {
          $scope.credentials.token = $scope.getResetPassToken();
          AuthService.resetPass($scope.credentials)
            .success(function (data, status, headers, config) {
              console.log('success reset password...');
              notify({
                'message': $scope.translate(data.message, $scope.interfaceLangs),
                'classes': 'notify'
              });

            }).error(function (data, status, headers, config) {
              console.log(data.message);
              console.log('error when reset password...');
              notify({
                'message':$scope.translate(data.message, $scope.interfaceLangs),
                'classes': 'notify'
              });
             // $state.reload('reset-password');
            });
          console.log('reset password - redirecting to login page');
          $state.go('auth', {langs: $scope.interfaceLangs});
        };

    }

    }());