/**
 * @file
 * Turnpoints infoMarker module for the task creator.
 */
define(['jquery', 'rejs!waypoints/templates/infoMarker'], function($, infoMarker) {
  
  $(document).on('click', '#configure-turnpoint', function(e) {
    var filename = $(this).attr('filename');
    var id = $(this).attr('tid');
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('configureWaypoint', false, false, {
      filename: filename,
      id: id,
    }); 
    document.dispatchEvent(e);
  });

  var buildMarker = function(info) {
    var altitude = info.z !== undefined ? info.z : 0;
    return infoMarker({
      info : info,
      altitude : altitude,
    });  
  }

  return {
    buildMarker: buildMarker,
  }
})
