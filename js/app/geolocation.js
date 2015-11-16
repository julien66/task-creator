/**
 * @file
 * Location checker module for the task creator.
 * Geolocate the navigator and returns its position.
 */
define([], function() {

  function setStartingPosition(position) {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('geolocation', false, false, {
      'geo' : position,
    });
    document.dispatchEvent(e);
  }
 
  var check = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setStartingPosition);
    }
  }

  return {
    check : check,
  };

});
