/**
 * @file
 * Tunrpoints handler module for the task creator.
 */
define(['waypoints/waypoint', 'app/param', 'app/filenameList', 'waypoints/exporter'],
function(Waypoint, param, filenameList, waypointExporter) {
  var waypoints = [];
  var filenames = [];

  var getWaypoints = function() {
    return waypoints;
  }
  
  var clearPastFile = function() {
    if (!param.allowCumulativeFiles) {
      removeFilename(filenames[0]);
    }
  }

  var addWaypoint = function(param) {
    var waypoint = new Waypoint(param);
    waypoints.push(waypoint);
    return waypoint; 
  }
 
  var checkFilename = function(filename) {
    for (var i = 0; i < filenames.length ; i++) {
      if (filenames[i] == filename) {
        return false;
      }
    }
    return true;
  }

  var addFilename = function(filename) {
    if (checkFilename(filename)) {
      filenames.push(filename);
      filenameList.rebuild(filenames);
    }
  }

  var removeFilename = function(filename) {
    var index = filenames.indexOf(filename);
    filenames.splice(index, 1);
    for (var i = 0; i < waypoints.length; i++) {
      if (waypoints[i].filename == filename) {
        waypoints.splice(i, 1);
        i--;
      }
    }
    filenameList.rebuild(filenames);
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('clearWaypointFile', false, false, {
      filename: filename,
    });
    document.dispatchEvent(e);
  }
  
  var onFilenameRemoved = function(e) {
    removeFilename(e.detail.filename);
  }

  var getWaypointByFileAndId = function(filename, id) {
    for (var i = 0; i < waypoints.length; i++) {
      if (filename == waypoints[i].filename && id == waypoints[i].id) {
        return waypoints[i];
      }
    }
    return false;
  }

  var onWaypointConfigure = function(e) {
    var filename = e.detail.filename;
    var id = e.detail.id;
    var waypoint = getWaypointByFileAndId(filename, id);
    waypoint.openConfigureWindow();
  }

  var onNewCustomWaypoint = function(e) {
    var waypointParam = e.detail.param;
    waypointParam.id = 'TP' + (waypoints.length + 1);
    if (filenames.indexOf(waypointParam.filename) == -1) {
      addFilename(waypointParam.filename);
    }
    var waypoint = addWaypoint(waypointParam);
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('newWaypointFile', false, false, {
      waypoints : Array(waypoint),
      customFile : true,
    });
    document.dispatchEvent(e);
  }

  var onExportWaypoints = function(e) {
    waypointExporter.build(waypoints);
  } 
  
  var onFinalExportWaypoints = function(e) {
    var wps = $.grep(waypoints, function(n, i) {
      return $.inArray(i, e.detail.selected) == -1;
    });
    waypointExporter.exporter(wps, e.detail.format);
  } 

  document.addEventListener('filenameRemoved', onFilenameRemoved);
  document.addEventListener('configureWaypoint', onWaypointConfigure);
  document.addEventListener('newCustomWaypoint', onNewCustomWaypoint);
  document.addEventListener('exportWaypoints', onExportWaypoints);
  document.addEventListener('finalExportWaypoints', onFinalExportWaypoints);
  
  return {
    getWaypoints : getWaypoints,
    addWaypoint : addWaypoint,
    clearPastFile: clearPastFile,
    checkFilename : checkFilename,
    addFilename : addFilename,
    getWaypointpByFileAndId : getWaypointByFileAndId,
  }
})
