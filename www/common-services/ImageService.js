/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function () {
    
    var commonService = angular.module('common-service.module');
    commonService.service(['$http', 'relaxReaderSettings', ImageService]);
    
  function ImageService($http, relaxReaderSettings) {
    var imageService = {};

    var getStaticImgHash = function (id) {
      /* Return a pseudo-random number between 1 and 5 (included) as a function of article id.
       * We compute a random number to evenly distribute load between static images server (5 of them).
       * We want it as a function of article id for caching purpose -so no Math.random()-.
       * */
      return 1 + (id % 5);
    };

    imageService.getApiUrl = function(articleId, ImageType) {
      var apiAliasNumber = getStaticImgHash(articleId);
      var baseUrl = relaxReaderSettings.urlStaticImage.replace('{#}', apiAliasNumber);
      var suffix = (ImageType === 'relaxImage') ?
        relaxReaderSettings.urlApiStaticSuffixRelaxImage :
        relaxReaderSettings.urlApiStaticSuffixTrendsBoardImage;

      return baseUrl + suffix + '/';
    };

    imageService.hasImage = function(article) {
      return (!!article && !!article.image);
    };

    imageService.getClusterPlaceholderUrl = function() {
      // TODO : Faire pointer ça vers les serveurs staticdev
        return "images/empty-cluster-placeholder.png";
    };

    imageService.getThumbnailPlaceholderUrl = function() {
      // TODO : Faire pointer ça vers les serveurs staticdev
      return "images/empty-thumbnail-placeholder.png";
    };



    imageService.getClusterUrlImg = function(article, width, height, isRelax){
      var imageType = isRelax ? 'relaxImage' : '';
      width = width || '';
      height = height || '';
      if (imageService.hasImage(article)) {
        return  imageService.getApiUrl(article.id, imageType) + article.id + "?w=" + width + "&h=" + height;
      }

    };



    imageService.getAfpRnStaticImage = function (cluster, width, height ){
      var imgUrl = null;
      width = width || 260;
      height = height || 160;
      var type = cluster.type;
      var imgParams =  "?w=" + width + "&h=" + height + '&type=' + type;
      if(cluster.images[0] && cluster.images[0].url){
        imgUrl = imageService.getApiUrl(cluster.id, 'relaxImage')  + cluster.id + imgParams;
      }
      return imgUrl;
    };

    imageService.getAfpUrlImg = function (idImg) {
      if(!idImg){return;}
      return relaxReaderSettings.urlSearchApiRelaxImage + '/' + idImg;
    };
    imageService.getBase64Img = function (data) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
    };
    imageService.loadImage = function (image) {
      return $http.get(image.url, {responseType: "arraybuffer"});
    };
    imageService.imageDownload = function (news, index, dimension, size) {
      if(!news){
        console.log('error: no News for imageDownload function');
        return;
      }

      if (index > 0 && news.video_embed) {
        index = index - 1 ;
      }

      var urlImageDownload = relaxReaderSettings.urlAPI + '/' + 'rn_' + news.lang + '/IMAGE-DOWNLOAD/' + news.type + '/' + news.id + '/' + index;
      switch (dimension){
        case 'width':
          urlImageDownload += '/'+ size + '/0';
          break;
        case 'height':
          urlImageDownload += '/0/' + size;
          break;
        case 'square':
          urlImageDownload += '/' + size + '/' + size;
          break;
        default :
          urlImageDownload += '/0/0';
      }
      return urlImageDownload;
    };

    imageService.videoDownload = function(news, videoFormat) {
      return relaxReaderSettings.urlAPI +
        '/' + 'rn_' + news.lang +
        '/VIDEO-DOWNLOAD/' + news.id +
        '/' + videoFormat;
    };


    /**
     *  In url like 'https://api.relaxnews.com/v1/rn9_en/IMAGE/news/1112633/0/260/160',
     *  remove the number in the '/rn9_en/' part, returning the string
     *  'https://api.relaxnews.com/v1/rn_en/IMAGE/news/1112633/0/260/160'
     */
    imageService.formatImageUrl = function(imageUrl){
      // For string like '/rn9_en/', '/tbm2_fr/' or '/foo5674_bar/', capture everything except the number
      var regexpCapturingIndexAndLang = /(\/\w+)\d+(_\w+\/)/;
      return imageUrl.replace(regexpCapturingIndexAndLang, '$1$2');
    };


    imageService.fetchImageBlobFromUrl = function(imageUrl) {
      var httpPromise = $http.get(imageUrl, {responseType: "arraybuffer"});
      var blobPromise = httpPromise.then(function(response) {
        var imageData = response.data;
        return new Blob([imageData], {type: "image/jpg"});
      });

      return blobPromise;
    };

    return imageService;
  }
  
}());
