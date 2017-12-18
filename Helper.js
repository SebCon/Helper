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
 *    @fileoverview light library for frequently used functionalities
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

  var intervals = {};
  var hashes = {};

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

  var isNdNn = function(value) {
    return (value !== undefined && value !== null);
  };


  var isBoolean = function(bool) {
    return (typeof(bool) === "boolean");
  };


  var requestInterval = function (fn, delay) {
    var requestAnimFrame = (function () {
      return window.requestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
    })();
    //start = Storage.serverTime.getTime(),
    var start = new Date().getTime();
    var handle = {};

    function loop() {
      handle.value = requestAnimFrame(loop);
      var current = new Date().getTime();
      var delta = current - start;
      if (delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }
    }
    handle.value = requestAnimFrame(loop);
    return handle;
  };


  /**
   * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
   * @param {function} fn The callback function
   * @param {int} delay The delay in milliseconds
   */
  window.requestInterval = function(fn, delay) {
    if( !window.requestAnimationFrame       &&
      !window.webkitRequestAnimationFrame &&
      !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
      !window.oRequestAnimationFrame      &&
      !window.msRequestAnimationFrame)
      return window.setInterval(fn, delay);

    var start = new Date().getTime();
    var handle = new Object();

    function loop() {
      var current = new Date().getTime();
      var delta = current - start;

      if(delta >= delay) {
        fn.call();
        start = new Date().getTime();
      }

      handle.value = requestAnimFrame(loop);
    }

    handle.value = requestAnimFrame(loop);
    return handle;
  };

  /**
   * Behaves the same as clearInterval except uses cancelRequestAnimationFrame() where possible for better performance
   * @param {int|object} fn The callback function
   */
  window.clearRequestInterval = function(handle) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
    window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
    window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
    window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
    window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(handle.value) :
    window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
    clearInterval(handle);
  };


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


  var createRandomId = function(config) {
    var result = '';

    if (config) {
      var length = config.length || 5;
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


  var stopInterval = function(id) {
    if (id && intervals[id]) {
      clearInterval(intervals[id]);
    } else {
      console.warn('cannot stop interval: '+id);
    }
  };


  var startInterval = function(id, callback, time) {
    if (id && time && callback && typeof callback === 'function') {
      console.log('start interval');
      if (intervals[id]) {
        stopInterval(id);
      }
      intervals[id] = setInterval(callback, time);
    } else {
      console.warn('cannot set interval!');
    }
  };


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


  var getLocalLanguage = function() {
    return (navigator && navigator.language ? navigator.language : 'en-GB');
  };


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
      formattedTime = date.toLocaleDateString(getLocalLanguage(), options);
    }

    return formattedTime;
  };


  var setHash = function(id, value) {
    if (id !== undefined && id !== null && value !== undefined && value !== null) {
      if (!hashes[id]) {
        hashes[id];
      }
      hashes[id] = value;
    }
  };


  var getHash = function(id) {
    return (id !== undefined && id !== null && hashes[id] ? hashes[id] : '');
  };



  return {
    isInteger : isInteger,
    isNdNn : isNdNn,
    isBoolean : isBoolean,
    requestInterval : requestInterval,
    changeFirstLetterToCapital : changeFirstLetterToCapital,
    createRandomId : createRandomId,
    removeAllInputContent : removeAllInputContent,
    startInterval : startInterval,
    stopInterval : stopInterval,
    getLimitString : getLimitString,
    getLocalLanguage : getLocalLanguage,
    convertUnixTimestampToDate : convertUnixTimestampToDate,
    setHash : setHash,
    getHash : getHash
  };

}(document, window, navigator));
