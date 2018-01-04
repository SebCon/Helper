'use strict';


/**
*		@namespace Helper
*/

/**
 *    @copyright 2017
 *    @author Sebastian Conrad <http://www.sebcon.de/>
 *    @version 1.0 - 15. december 2017
 *    @see http://www.github.com/sebcon
 *    @license Available under MIT license <https://mths.be/mit>
 *    @fileoverview light library for basic functionalities
 */


/**
*		@class Helper
*
*		@constructor
*		@param {document}	document document object
*		@param {window} window window object
*   @param {navigator} navigator navigator object
**/

var Helper = (function(document, window, navigator) {

  /** @global */
  var intervals = {};
  /** @global */
  var hashes = {};


  /** check if value is integer
  *		@function isInteger
  *		@param {(string|number)} value as number or as string
  *
  *   @return {boolean} is value a number
  **/
  var isInteger = function(value) {
    var back = false;
    if (value !== undefined && value !== null) {
      var patt = /^\+?[0-9]+$/;
      back = patt.test(value);
      //var val = parseInt(value);
      //back = (!isNaN(val));
    }
    return back;
  };


  /** check if value is not undefined and not null
  *		@function isNdNn
  *		@param {*} value any value
  *
  *   @return {boolean} is not undefined and not null
  **/
  var isNdNn = function(value) {
    return (value !== undefined && value !== null);
  };


  /** check if value is a boolean
  *		@function isBoolean
  *		@param {*} bool any value
  *
  *   @return {boolean} value is a boolean
  **/
  var isBoolean = function(bool) {
    return (typeof(bool) === "boolean");
  };


  /** first letter will transform to capital letter
  *		@function changeFirstLetterToCapital
  *		@param {string} text any text
  *
  *   @return {string} transform text
  **/
  var changeFirstLetterToCapital = function(text) {
    var result = "";
    if (text) {
      var arr = text.split(" ");
      var l = arr.length;
      for (var i = 0; i < l; i++) {
        var t = arr[i];
        t = t.charAt(0).toUpperCase() + t.slice(1);
        result = result + t ;
        // Dont add space to last part
        if (i < (arr.length - 1)) {
          result = result + " ";
        }
      }
    }
    return result;
  };


  /** create random id via user/standard config
  *
  *   @generator
  *		@function createRandomId
  *		@param {Object} config config object
  *   @param {number} [config.len = 5] length of random id
  *   @param {string} [config.chars = aA#] random id mask
  *
  *   @return {string} random id as string
  **/
  var createRandomId = function(config) {
    var result = '';

    if (config) {
      var length = config.len || 5;
      var chars = config.chars || 'aA#';
      var mask = '';

      if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
      if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (chars.indexOf('#') > -1) mask += '0123456789';
      if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
      for (var i = length; i > 0; --i) {
        result += mask[Math.floor(Math.random() * mask.length)];
      }
    }

    return result;
  };


  /** remove all input/textarea values of parent element
  *		@function removeAllInputContent
  *		@param {string} id parent element id
  **/
  var removeAllInputContent = function(id) {
    if (id) {
      var parent = document.getElementById(id);
      if (parent) {
        var childsInput = parent.getElementsByTagName('input');
        var childsTextArea = parent.getElementsByTagName('textarea');

        if (childsInput) {
          for (var i=0; i < childsInput.length; i++) {
            var elem = childsInput[i];
            if (elem) {
              elem.value = '';
            }
          }
        }

        if (childsTextArea) {
          for (var k=0; k < childsTextArea.length; k++) {
            var elem2 = childsTextArea[k];
            if (elem2) {
              elem2.innerHTML = '';
            }
          }
        }

      }
    }
  };


  /** stop interval of interval id
  *		@function stopInterval
  *		@param {string} id interval id
  **/
  var stopInterval = function(id) {
    if (id && intervals[id]) {
      window.clearInterval(intervals[id]);
    } else {
      console.warn('cannot stop interval: '+id);
    }
  };


  /** start interval with interval id
  *		@function startInterval
  *		@param {string} id id of interval
  *   @param {function} callback callback function
  *   @param {number} [time = 250] delay time
  **/
  var startInterval = function(id, callback, time) {
    if (id && time && callback && typeof callback === 'function') {
      console.log('start interval');
      if (intervals[id]) {
        stopInterval(id);
      }
      time = isInteger(time) ? time : 250;
      intervals[id] = setInterval(callback, time);
    } else {
      console.warn('cannot set interval!');
    }
  };


  /** transform text within char limit
  *		@function getLimitString
  *		@param {string} value text
  *   @param {number} count max char count
  *   @param (boolean) [showDots] show dots if text length is greater than char count
  *
  *   @return {string} transformed text
  **/
  var getLimitString = function(value, count, showDots) {
    var lStr = value;
    if (value && count) {
      lStr = value.substring(0, count);
      if (showDots) {
        if ((count + 4) >= value.length) {
          lStr = value;
        } else if (value.length > count) {
          lStr += ' ...';
        }
      }
    }

    return lStr;
  };


  /** convert unix time stamp into readable date
  *		@function convertUnixTimestampToDate
  *		@param {number} tstamp unix timestamp
  *   @param {object} [options] config object
  *   @param {string} [options.year = numeric] year format
  *   @param {string} [options.month = numeric] month format
  *   @param {string} [options.day = numeric] day format
  *   @param {string} [options.hour = numeric] hour format
  *   @param {string} [options.minute = numeric] minute format
  *   @param {string} [options.second = numeric] second format
  *
  *   @return {string} convert timestamp
  **/
  var convertUnixTimestampToDate = function(tstamp, options) {
    var formattedTime = null;
    if (tstamp !== undefined && tstamp !== null) {
      // author: https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(tstamp * 1000);
      if (!options) {
        options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      }
      // @todo change german lanuage
      formattedTime = date.toLocaleDateString('de-DE', options);
    }

    return formattedTime;
  };


  /** save value in hash object
  *		@function setHash
  *		@param {(string|number)} id hash id
  *   @param {*} value value to save
  **/
  var setHash = function(id, value) {
    if (id !== undefined && id !== null && value !== undefined && value !== null) {
      if (!hashes[id]) {
        hashes[id] = '';
      }
      hashes[id] = value;
    }
  };


  /** get value of hash object via id
  *		@function getHash
  *		@param {(string|number)} id hash id
  *
  *   @return {*} hash value
  **/
  var getHash = function(id) {
    return (id !== undefined && id !== null && hashes[id] ? hashes[id] : '');
  };



  return {
    isInteger : isInteger,
    isNdNn : isNdNn,
    isBoolean : isBoolean,
    changeFirstLetterToCapital : changeFirstLetterToCapital,
    createRandomId : createRandomId,
    removeAllInputContent : removeAllInputContent,
    startInterval : startInterval,
    stopInterval : stopInterval,
    getLimitString : getLimitString,
    convertUnixTimestampToDate : convertUnixTimestampToDate,
    setHash : setHash,
    getHash : getHash
  };

}(document, window, navigator));
