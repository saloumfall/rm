/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function(){
    
    	 var commonService = angular.module('common-service.module');
     commonService.factory(['$http', 'CatalogService', 'UserDataService', 'ContentLangService', 'relaxReaderSettings', TrackEventUserService]);
    
  function TrackEventUserService($http, CatalogService, UserDataService, ContentLangService, relaxReaderSettings){
    var USER_EVENTS = {
      LOGIN: 'login',
      LOGOUT: 'logout',
      ADD_FEED: 'add-feed',
      CLICK_DASHBOARD: 'click-feed-dashboard',
      CLICK_RADAR: 'click-radar', // Doesn't exist yet in API
      CLICK_RELAXNEWS: 'click-feed-relaxnews',
      CLICK_READER: 'click-feed-reader',
      CLICK_AGENDA: 'click-agenda',
      CLICK_PRESS_RELEASE: 'click-feed-pressreleases',
      CLICK_FOLDER: 'click-feed-folder',
      CLICK_ON_DEMAND: 'click-ondemand',
      CLICK_PUBLISH: 'click-main-publish',
      NEWS_AFPRELAX: 'click-news-afprelax',
      FILTER_AFPRELAX: 'click-filter-afprelax',
      FOLLOW_ARTICLE_LINK: 'click-news',
      OPEN_CLUSTER: 'click-cluster',
      DOWNLOAD_IMAGE: 'relax-image-download',
      DOWNLOAD_VIDEO: 'relax-video-download',
      FORWARD_EMAIL: 'relax-email-forwarding',
      CLICK_PUBLISH_BUTTON: 'publish',
      PUBLISH_ON_SOCIAL_NETWORK: 'push-to-social-network',
      SAVE_SEARCH: 'save-a-search',
      SEARCH: 'search',
      TRACK_REFERER: 'referer',
      CUSTOM_EVENT: 'custom'
    };


    return {
      trackLogin: trackLogin,
      trackLogout: trackLogout,
      trackAddFeed: trackAddFeed,
      trackFeedPage: trackFeedPage,
      trackFolder: trackFolder,
      trackOnDemandPage: trackOnDemandPage,
      trackPublishPage: trackPublishPage,
      trackNewsAfpRelax: trackNewsAfpRelax,
      trackFilterAfpRelax: trackFilterAfpRelax,
      trackFollowArticleUrl: trackFollowArticleUrl,
      trackOpeningCluster: trackOpeningCluster,
      trackImageDownload: trackImageDownload,
      trackVideoDownload: trackVideoDownload,
      trackEmailForwarding: trackEmailForwarding,
      trackPublishButton: trackPublishButton,
      trackPublishOnSocialNetwork: trackPublishOnSocialNetwork,
      trackSaveSearch: trackSaveSearch,
      trackSearch: trackSearch,
      trackReferer: trackReferer,
      trackCustomEvent: trackCustomEvent
    };


    function sendTrackingInfo(event, value, payload) {
      if (UserDataService.isOpenUser()) return;  // Tracking work only with an account, for now.

      var project = CatalogService.getCatalog().name === 'relax' ? 'relax' : 'poc';
      var url = relaxReaderSettings.urlSearchAPI + '/events/project/'+project+'/event/'+event;

      var postBody = {
        userid: UserDataService.getUserId(),
        lang: ContentLangService.getCurrent().join(','),
        value: value || ""
      };
      if (payload) {
        postBody.payload = payload;
      }

  /*    console.log('==========================================');
      console.log('   sendTrackingInfo');
      console.log('   ----------------');
      console.log(url);
      console.log(postBody);
      console.log('==========================================');  */
      $http.post(url, JSON.stringify(postBody));
    }


    function trackLogin() { sendTrackingInfo(USER_EVENTS.LOGIN); }
    function trackLogout() { sendTrackingInfo(USER_EVENTS.LOGOUT); }
    function trackAddFeed(feedSlug) { sendTrackingInfo(USER_EVENTS.ADD_FEED, feedSlug); }
    function trackPublishPage() { sendTrackingInfo(USER_EVENTS.CLICK_PUBLISH); }


    function trackFeedPage(feed, pageType) {
      var eventByPageType = {
          'dashboard':  USER_EVENTS.CLICK_DASHBOARD,
          'radar':  USER_EVENTS.CLICK_RADAR,
          'reader':  USER_EVENTS.CLICK_READER,
          'afpRelax':  USER_EVENTS.CLICK_RELAXNEWS,
          'press-release':  USER_EVENTS.CLICK_PRESS_RELEASE,
          'agenda':  USER_EVENTS.CLICK_AGENDA
        };
      var event = pageType ? eventByPageType[pageType] : eventByPageType.dashboard;
      var value = getFeedBackendSlug(feed);
      sendTrackingInfo(event, value);
    }


    function trackFolder(feed, folder) {
      var value = getFeedBackendSlug(feed);
      var payload = {
        "folder": folder.id,
        "folder_name": folder.name
      };
      sendTrackingInfo(USER_EVENTS.CLICK_FOLDER, value, payload);
    }


    /**
     * linkLocation can be one of ['fromMenu', 'fromHeader', 'fromCarousel', 'fromAgenda']
     */
    function trackOnDemandPage(linkLocation) {
      var valueByLinkLocation = {
        'fromMenu': 'left_menu',
        'fromHeader': 'top_menu',
        'fromCarousel': 'carousel',
        'fromAgenda': 'agenda'
      };
      var value = valueByLinkLocation[linkLocation];
      sendTrackingInfo(USER_EVENTS.CLICK_ON_DEMAND, value);
    }


    /**
     * LinkLocation can be one of ['fromUrl', 'fromCarousel', 'fromAfpRelaxPage', 'fromNewsletter'];
     */
    function trackNewsAfpRelax(news, linkLocation) {
      var originByLinkLocation = {
        'fromUrl': 'url',
        'fromCarousel': 'carousel',
        'fromAfpRelaxPage': 'page',
        'fromNewsletter': 'newsletter'  // Not used for now
      };

      var value = news.title;
      var payload = {
        "news_type": news.type,
        "news_id": news.id,
        "origin": originByLinkLocation[linkLocation]
      };
      sendTrackingInfo(USER_EVENTS.NEWS_AFPRELAX, value, payload);
    }

    function trackFilterAfpRelax(typeOfDoc) {
      sendTrackingInfo(USER_EVENTS.FILTER_AFPRELAX, typeOfDoc);
    }

    /**
     * LinkLocation can be one of ['reader_magazine', 'reader_compact', 'radar', 'search'];
     */
    function trackFollowArticleUrl(article, linkLocation) {
      var originByLinkLocation = {
        'reader_magazine': 'reader_magazine',
        'reader_compact': 'reader_compact',
        'radar': 'radar',
        'search': 'search'
      };
      var value = article.title;
      var payload = {
        "news_id": article.id,
        "news_url": article.sourceUrl,
        "news_publisher": article.publisherDomain,
        "origin": originByLinkLocation[linkLocation]
      };
      sendTrackingInfo(USER_EVENTS.FOLLOW_ARTICLE_LINK, value, payload);
    }

    /**
     * LinkLocation can be one of ['reader_magazine', 'reader_compact', 'radar'];
     */
    function trackOpeningCluster(clusterData, featuredArticle, linkLocation) {
      var originByLinkLocation = {
        'reader_magazine': 'reader_magazine',
        'reader_compact': 'reader_compact',   // Not used for now (no opening in compact mode)
        'radar': 'radar'
      };
      var value = featuredArticle.title;
      var payload = {
        "cluster_id": clusterData.id,
        "origin": originByLinkLocation[linkLocation]
      };
      sendTrackingInfo(USER_EVENTS.OPEN_CLUSTER, value, payload);
    }


    function trackImageDownload(news, url, dimension, size) {
      var value = news.title;
      var payload = {
        "id": news.id,
        "image_url": url,
        "resolution": "0x0" // TODO: We don't really have resolution when we send url. Change event params ?
      };
      sendTrackingInfo(USER_EVENTS.DOWNLOAD_IMAGE, value, payload);
    }

    function trackVideoDownload(news, url, videoFormat) {
      var value = news.title;
      var payload = {
        "id": news.id,
        "video_url": url,
        "resolution": "0x0",
        "format": videoFormat  // TODO: Not sure if it's the right thing to send. Should discuss with Fred
      };
      sendTrackingInfo(USER_EVENTS.DOWNLOAD_VIDEO, value, payload);
    }


    function trackEmailForwarding(news, isUserRecipient) {
      var value = news.title;
      var payload = {
        "id": news.id,
        "send_to_other": !isUserRecipient
      };
      sendTrackingInfo(USER_EVENTS.FORWARD_EMAIL, value, payload);
    }


    function trackPublishButton(news, isPublishNow) {
      var value = news.title;
      var payload = {
        "id": news.id,
        "news_type": news.type,
        "when": isPublishNow ? 'now' : 'later'
      };
      sendTrackingInfo(USER_EVENTS.CLICK_PUBLISH_BUTTON, value, payload);
    }


    function trackPublishOnSocialNetwork(content, socialNetworkName) {
       // Publish on social network not necessarily tied to a particular news
       // (and we don't have the info when it's the case).
    }


    function trackSaveSearch() {
      var value = getFeedBackendSlug(CatalogService.getCurrentFeed());
      sendTrackingInfo(USER_EVENTS.SAVE_SEARCH, value);
    }


    function trackSearch() {
      // TODO: Vu les paramètres demandé pour l'instant c'est compliqué.
      // On pourrait faire le tracking en amont de la recherche si
      // il n'y avait pas besoin de spécifié les résultats.
      // Et les résultat sont obtenu dans des directive différentes.
      // Une solution (?) (compliquée) serait de faire un envoi de la recherche
      // en plusieurs partie : Une fonction appelée en amont qui donne l'origine de la recherche,
      // et des appels lorsque l'on a les résultats du reader et de l'AFPRElax,
      // et à ce moment là on ferait l'appel et cloturerait tout ça ?
    }


    function trackReferer(referrer) {
      sendTrackingInfo(USER_EVENTS.TRACK_REFERER, referrer);
    }


    function trackCustomEvent(value, payload) {
      sendTrackingInfo(USER_EVENTS.CUSTOM_EVENT, value, payload);
    }


    //////////////////////////////////////////////////
    //  UTILS
    //////////////////////////////////////////////////
    function getFeedBackendSlug(feed) {
      if (feed.type === 'virtual') {
        if (feed.isInMySources) {
          return 'all:' + UserDataService.getUserEmail();
        } else {
          return 'all:' + CatalogService.getCatalog().name;
        }
      } else {
        return feed.slug;
      }
    }
  }

 
}());
