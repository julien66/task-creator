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
      filename : filename,
      id : id,
    }); 
    document.dispatchEvent(e);
  });

  $(document).on('click', '#edit-waypoint', function(e) {
    var wpindex = $(e.target).attr('wp-index');
    var name = $('#wp-name').val();
    var id = $('#wp-id').val();
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('editWaypoint', false, false, {
      id : id,
      name : name,
      wpindex : wpindex,
    }); 
    document.dispatchEvent(e);
    $("#configure-turnpoint").attr('tid', id);
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
