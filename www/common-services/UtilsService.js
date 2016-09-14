/* jshint ignore:start */
'use strict';
/* jshint ignore:end */
(function(){
var commonService = angular.module('common-service.module');
    commonService.factory(['relaxReaderSettings', UtilsService]);
    
  function UtilsService(relaxReaderSettings){
    var utilsService = {};

    /* Private methods */
    function toggle(array, value) {
      var index = array.indexOf(value);

      if (index === -1) {
        array.push(value);
      } else {
        array.splice(index, 1);
      }
    }

    utilsService.getCurrentPage = function(){
      return document.location.href.indexOf('/publish') !== -1 ? 'publish'
        : document.location.href.indexOf('/reader') !== -1 ? 'reader'
        : document.location.href.indexOf("/radar") !== -1 ? 'radar'
        : document.location.href.indexOf("/ondemand") !== -1 ? 'ondemand' : '';
    };

    utilsService.initLocale = function (langs) {
      // Si il n’y a qu’une langue dans l’URL, on l’utilise comme langue dans la webUI (À changer plus tard: la langue devrait être liée à l’utilisateur, pas à un filtre)
      if (langs.length === 1) {
        return relaxReaderSettings.sourceLangs.indexOf(langs[0]) !== -1 ? langs[0] : "fr";
      }
    };

    utilsService.toogleFilter = function(searchParams, tagsInput, filter, value){
      if (typeof(searchParams[filter]) !== "undefined") {
        toggle(searchParams[filter], value);
      }

      return searchParams.domain
        .concat(searchParams.cat)
        .concat(searchParams.terms);
    };

    utilsService.getSourceType = function(source){
      var sourceType = "label label-info";
      switch (source.type) {
        case "terms":
          sourceType = "label label-danger";
          break;
        case "cat":
          sourceType = "label label-warning";
          break;
        case "domain":
          sourceType = "label label-success";
          break;
        default:
          sourceType = "label label-default";
          break;
      }

      return sourceType;
    };

    utilsService.generateUUID = function (){
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = randLetter + Date.now();
      return uniqid;

    };

    utilsService.findIndexInData = function (data, property, value) {
      var result = -1;
      data.some(function (item, i) {
        if (item[property] === value) {
          result = i;
          return true;
        }
      });
      return result;
    };

    return utilsService;
  }

  
}());
