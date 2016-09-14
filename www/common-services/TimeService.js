/* jshint ignore:start */
'use strict';
/* jshint ignore:end */

(function () {
    var commonService = angular.module('common-service.module');
     commonService.service(['$filter', TimeService]);
    
  function TimeService($filter) {
    var timeService = {};
    var now = moment();
    timeService.updateCurrentTime = function() {
      now = moment();
    };

    timeService.getRelativeTime = function (time) {
      var timeDiff = moment(time).from(now);
      return (timeDiff.indexOf('m') === -1 || timeDiff.indexOf('month') !== -1) ? timeDiff : timeDiff + 'in';
    };
    timeService.getDiffFromNowInHours = function (time) {
      var diff = moment(time).from(now);
      return diff.indexOf("minutes") > -1 ? "minutes" : diff;
    };

    timeService.findMyTextAnReplace = function(needle, replacement, mainString) {
      var match = new RegExp(needle, "ig");
      var replaced = "";
      if (replacement.length > 0) {
        replaced = mainString.replace(match, replacement);

        return replaced;
      }

    };
    timeService.humanise = function (diff, lang) {
      var str = '';
      var values = {
        ' year': 365,
        ' month': 30,
        ' day': 1
      };
      if(diff <= 0){
        str = lang === 'fr' ? 'En cours' : 'On-going';
      }else{
        for (var x in values) {
          var amount = Math.floor(diff / values[x]);

          if (amount >= 1) {
            str += amount + x + (amount > 1 ? 's' : '') + ' ';
            diff -= amount * values[x];
          }
        }
      }


      return str;
    };
    timeService.getDiffFromNowInDays = function (time ,lang){
      var translate = $filter('translate');
      var diff = moment(time).diff(now,'days');
      var firstStringPart = diff >= 0 ? translate('Dans' ,lang) : '';
      var eventDate = timeService.humanise(diff, lang);
      if(lang === 'fr'){
        eventDate = timeService.findMyTextAnReplace('year' , 'an' , eventDate);
        eventDate = timeService.findMyTextAnReplace('years' , 'ans' , eventDate);
        eventDate = timeService.findMyTextAnReplace('months' , 'mois' , eventDate);
        eventDate = timeService.findMyTextAnReplace('month' , 'mois' , eventDate);
        eventDate = timeService.findMyTextAnReplace('days' , 'jours' , eventDate);
        eventDate = timeService.findMyTextAnReplace('day' , 'jour' , eventDate);
      }

      return firstStringPart + ' ' + eventDate;
    };
    timeService.getBoxedRelativeTime = function(time) {
      // relativeTime segmented as ["now", '1h', '3h', '6h', '12h', '24h'];
      var differenceInMinutes = now.diff(moment(time), 'minutes');
      var boxedRelativeTime = {
        minutes: differenceInMinutes,
        timeBox: ''
      };
      if (differenceInMinutes < 60) {
        boxedRelativeTime.timeBox = 'now';
      } else if (differenceInMinutes < 3*60) {
        boxedRelativeTime.timeBox = '1h';
      } else if (differenceInMinutes < 6*60) {
        boxedRelativeTime.timeBox = '3h';
      } else if (differenceInMinutes < 12*60) {
        boxedRelativeTime.timeBox = '6h';
      } else if (differenceInMinutes < 24*60) {
        boxedRelativeTime.timeBox = '12h';
      } else if (differenceInMinutes < 24*60*2) {
        boxedRelativeTime.timeBox = '24h';
      } else {
        boxedRelativeTime.timeBox = 'moreThan48h';
      }
      return boxedRelativeTime;
    };

    /** ShowUpdateDate
     *  Display a relative time using these rules:
     *
     *  . If relative time is just now or in the future,
     *      output a formatted 'now'
     *
     *  . If relative time is between now and 6 days ago,
     *      output formatted stuff like 'in the last 2 hours' or 'an hour ago'
     *
     *  . If relative time is equal or greater than 6 days ago,
     *      output the calendar date in full text
     *
     *  . Three different formats : 'compact', 'ago' and 'in the last'
     *
     *  . French and in English.
     */
    timeService.showUpdateDate = function(lastUpdateDate, lang, dateFormat) {
      var timeInMinutes = lastUpdateDate.boxedRelativeTime.minutes;
      var sixDaysInMinutes = 60 * 24 * 6;

      if (timeInMinutes < sixDaysInMinutes) {
        var relativeTime = convertMinutesToRelativeTime(timeInMinutes);
        return formatRelativeTime(relativeTime, lang, dateFormat);
      } else {
        return formatCalendarTime(lastUpdateDate.absoluteTime, lang, dateFormat);
      }
    };

    /** formatCalendarTime
     * 'dateFormat' should be either 'compact', 'in the last' or 'ago'
     *
     *
     * 'compact'-formatted dates output stuff like :
     *  1er févr.                  //  1st Feb
     *
     * 'in the last'-formatted dates output things like :
     *  since September 1st, 2015  //  depuis le 1er septembre 2015
     *
     *  'ago'-formatted dates are texts like :
     *  September 1st, 2015        //  le 1er septembre 2015
     */
    var formatCalendarTime = function(absoluteTime, lang, dateFormat) {
      var result = '';

      switch (dateFormat) {
        case 'compact':
          result = moment(absoluteTime).format('DD MMM');
          break;
        case 'ago':
          result = moment(absoluteTime).format('LL');
          break;
        case 'in the last':
          result = (lang === 'fr') ? 'depuis le ' : 'since ';
          result += moment(absoluteTime).format('LL');
          break;
      }

      return result;
    };

    /** formatRelativeTime
     * 'dateFormat' should be either 'compact', 'in the last' or 'ago'
     *
     * 'compact'-formatted dates output stuff like :
     *  now                        //  maintenant
     *  1 min                      //  1 min
     *  2 min                      //  2 min
     *  1 hour                     //  1 heure
     *  2 hours                    //  2 heures
     *  1 day                      //  1 jour
     *  2 days                     //  2 jours
     *
     * 'in the last'-formatted dates output things like :
     *  just now                   //  à l'instant
     *  in the last minute         //  depuis une minute
     *  in the last 2 minutes      //  depuis 2 minutes
     *  in the last hour           //  depuis 1 heure
     *  in the last 2 hours        //  depuis 2 heures
     *  in the last day            //  depuis un jour
     *  in the last 2 days         //  depuis 2 jours
     *
     *  'ago'-formatted dates are texts like :
     *  now                        //  maintenant
     *  a minute ago               //  il y a une minute
     *  2 minutes ago              //  il y a deux minutes
     *  an hour ago                //  il y a une heure
     *  2 hours ago                //  il y a 2 heures
     *  one day ago                //  il y a un jour
     *  2 days ago                 //  il y a 2 jours
     *
     *
     *  NB : Why not Moment.js ?
     *  Even thought this function use the same kind of structure as moment.js,
     *  in this particular case changing 'relativeTime' fields in moment.js i18n file is not the answer because :
     *
     *   - We have not one, but three different ways of displaying relative time ('compact', 'ago' and 'in the last').
     *
     *   - In our platform we want 'one hour ago' to mean '60 minutes or more',
     *     but moment.js round instead of flooring.
     *     This mean that, for a relative time of 1H and 40 minutes ago, moment.js will output '2H ago' instead of '1H ago'.
     */
    var formatRelativeTime = function (relativeTime, lang, dateFormat) {
      var result = '';

      switch (dateFormat) {
        case 'compact':
          if (lang === 'en') {
            switch (relativeTime.unit) {
              case 'now':
                result = "now";
                break;
              case 'm':
                result = '1 min';
                break;
              case 'mm':
                result = relativeTime.value + ' min';
                break;
              case 'h':
                result = '1 hour';
                break;
              case 'hh':
                result = relativeTime.value + ' hours';
                break;
              case 'd':
                result = '1 day';
                break;
              case 'dd':
                result = relativeTime.value + ' days';
                break;
            }
          } else {
            switch (relativeTime.unit) {
              case 'now':
                result = "maintenant";
                break;
              case 'm':
                result = '1 min';
                break;
              case 'mm':
                result = relativeTime.value + ' min';
                break;
              case 'h':
                result = '1 heure';
                break;
              case 'hh':
                result = relativeTime.value + ' heures';
                break;
              case 'd':
                result = '1 jour';
                break;
              case 'dd':
                result = relativeTime.value + ' jours';
                break;
            }
          }
          break;
        case 'ago':
          if (lang === 'en') {
            switch (relativeTime.unit) {
              case 'now':
                result = "now";
                break;
              case 'm':
                result = 'a minute ago';
                break;
              case 'mm':
                result = relativeTime.value + ' minutes ago';
                break;
              case 'h':
                result = 'an hour ago';
                break;
              case 'hh':
                result = relativeTime.value + ' hours ago';
                break;
              case 'd':
                result = 'one day ago';
                break;
              case 'dd':
                result = relativeTime.value + ' days ago';
                break;
            }
          } else {
            switch (relativeTime.unit) {
              case 'now':
                result = "maintenant";
                break;
              case 'm':
                result = 'il y a une minute';
                break;
              case 'mm':
                result = 'il y a ' + relativeTime.value + ' minutes';
                break;
              case 'h':
                result = 'il y a une heure';
                break;
              case 'hh':
                result = 'il y a ' + relativeTime.value + ' heures';
                break;
              case 'd':
                result = 'il y a un jour';
                break;
              case 'dd':
                result = 'il y a ' + relativeTime.value + ' jours';
                break;
            }
          }
          break;
        case 'in the last':
          if (lang === 'en') {
            switch (relativeTime.unit) {
              case 'now':
                result = "just now";
                break;
              case 'm':
                result = 'in the last minute';
                break;
              case 'mm':
                result = 'in the last ' + relativeTime.value + ' minutes';
                break;
              case 'h':
                result = 'in the last hour';
                break;
              case 'hh':
                result = 'in the last ' + relativeTime.value + ' hours';
                break;
              case 'd':
                result = 'in the last day';
                break;
              case 'dd':
                result = 'in the last ' + relativeTime.value + ' days';
                break;
            }
          } else {
            switch (relativeTime.unit) {
              case 'now':
                result = "à l'instant";
                break;
              case 'm':
                result = 'depuis une minute';
                break;
              case 'mm':
                result = 'depuis ' + relativeTime.value + ' minutes';
                break;
              case 'h':
                result = 'depuis une heure';
                break;
              case 'hh':
                result = 'depuis ' + relativeTime.value + ' heures';
                break;
              case 'd':
                result = 'depuis un jour';
                break;
              case 'dd':
                result = 'depuis ' + relativeTime.value + ' jours';
                break;
            }
          }
          break;
        default:
          result = "Error: missing 'dateFormat' parameter";
      }

      return result;
    };

    var convertMinutesToRelativeTime = function(timeInMinutes) {
      if (timeInMinutes <= 0) {
        return {
          unit: 'now',
          value: 0
        };
      }

      var nbDays = Math.floor(timeInMinutes / (60 * 24));
      if (nbDays === 1) {
        return {
          unit: 'd',
          value: 1
        };
      } else if (nbDays > 1) {
        return {
          unit: 'dd',
          value: nbDays
        };
      }

      var nbHours   = Math.floor((timeInMinutes % (60 * 24)) / 60);
      if (nbHours === 1) {
        return {
          unit: 'h',
          value: 1
        };
      } else if (nbHours > 1) {
        return {
          unit: 'hh',
          value: nbHours
        };
      }

      var nbMinutes = timeInMinutes % 60;
      if (nbMinutes === 1) {
        return {
          unit: 'm',
          value: 1
        };
      } else if (nbMinutes > 1) {
        return {
          unit: 'mm',
          value: nbMinutes
        };
      }
    };

    return timeService;
  }
 
}());
