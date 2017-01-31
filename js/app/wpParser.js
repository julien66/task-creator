/**
 * @file
 * Waypoint file parser module for the task creator.
 */
define(['jquery', 'waypoints/waypoints', 'task/task', 'tracks/tracks', 'formats/oziOld', 'formats/ozi', 'formats/cup', 'formats/igc', 'formats/tsk', 'formats/gpx', 'jgrowl'],
function($, waypoints, task, tracks, oziOld, ozi, cup, igc, tsk, gpx) {
 
  var formats = [oziOld, ozi, cup, igc, tsk, gpx]; 
  var parse = function(text, filename) {
    var result = formatCheck(text, filename);
    var format = result.format;

    if (!format) {
      $.jGrowl(result.message, {
        header : result.state,
        theme : result.state,
        sticky : true,
        position : 'top-left',
      });
      return;
    }

    var fileInfo = format.parse(text, filename);
    var parseInfo = {};

    if (fileInfo.waypoints) {
      var waypointsInfos = fileInfo.waypoints;
      var l = waypointsInfos.length;
      var waypointsArray = Array();
      for (var i = 0; i < l; i++) {
        if (!waypoints.alreadyHave(waypointsInfos[i])) {
          var waypoint = waypoints.addWaypoint(waypointsInfos[i]);
          waypointsArray.push(waypoint);
        }
      }

      if (l > 0) { 
        waypoints.clearPastFile();
        waypoints.addFilename(filename); 
        $.jGrowl(l + ' waypoints succesfully imported from file : ' + filename + ' !!', {
          header : 'success',
          theme : 'success',
          sticky : true,
          position : 'top-left',
        });
      } else {
        $.jGrowl('No waypoint were found from file  : ' + filename + ' !!', {
          header : 'warning',
          theme : 'warning',
          sticky : true,
          position : 'top-left',
        }); 
      }
      parseInfo.waypoints = waypointsArray;
    }
    
    if (fileInfo.tracks) {
      var tracksInfos = fileInfo.tracks;
      var l = tracksInfos.length;
      var tracksArray = Array();
      for (var i = 0; i < l; i++) {
        var track = tracks.addTrack(tracksInfos[i]);
        tracksArray.push(track);
      }
      parseInfo.tracks = tracksArray;
    }
    
    if (fileInfo.task) {
      parseInfo.task = fileInfo.task;
      if (parseInfo.task.turnpoints.length > 0) {
        for (var i = 0; i < parseInfo.task.turnpoints.length; i++ ) {
          var tp = parseInfo.task.turnpoints[i];
          var waypoint = waypoints.getWaypointByFileAndId(tp.wp.filename , tp.wp.id);
          tp.waypoint = waypoint;
        }
      }
    }
    return parseInfo;
  }

  var formatCheck = function(text, filename) {
    var formatsName = [];
    for (var i = 0; i < formats.length; i++) {
      formatsName.push(formats[i].name);
    }
    
    var result = {
      format : false,
      state : 'error',
      message : 'Waypoints file format unknown. We only support : ' + formatsName.join(" , ") + ' files',
    }

    if (waypoints.checkFilename(filename) == false) {
      result.message = 'This file : ' + filename + " is alredy used.";
      result.state = 'warning';
      return result;
    }
    
    for (var i = 0; i < formats.length; i++) {
      if (formats[i].check(text, filename) == true) {
        result.format = formats[i];
        return result;
      }
    }
    return result;
  }

  return {
    'parse' : parse,
  }
});
