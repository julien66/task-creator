/**
 * @file
 * Map module for the task creator
 */
define(['app/param', 'app/geolocation', 'app/gMap', 'task/task', 'app/keyboard'],
function(param, geolocation, google, task, keyboard) {
  var startX = param.map.startX;
  var startY = param.map.startY;
  
  var markers = [];
  var polylines = [];
  var turnpointElements = [];

  var markerWindow;
  var zoomBeforeBounds;

  var mapOptions = {
    center: new google.maps.LatLng(startX, startY),
    zoom: 8,
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  var elevator = new google.maps.ElevationService();
  
  var onGeolocation = function(e) {
    var position = e.detail.geo;
    map.setCenter(new google.maps.LatLng(position.coords.latitude , position.coords.longitude));
  }

  var onNewWaypointFile = function(e) {
    var waypoints = e.detail.waypoints;
    for (var i = 0; i < waypoints.length; i++) {
      var marker = waypoints[i].drawMarker(map, google);
      markers.push(marker);   
    }
    fitToBounds('markers', markers);
  }

  var onNewTrackFile = function(e) {
    var tracks = e.detail.tracks;
    for (var i = 0; i < tracks.length; i++) {
      var polyline = tracks[i].drawPolyline(map, google);
      polylines.push(polyline);   
    }
  }

  var closeInfoWindow = function() {
    if (map.infoWindow) {
      map.infoWindow.close();
    }
  }

  var fitToBounds = function(mode, objects) {
    var bounds = new google.maps.LatLngBounds();
    var nb = 0;
    for (var i = 0; i < objects.length; i++) {
      var center = (mode == 'markers') ? objects[i].getPosition() : objects[i].center; 
      bounds.extend(center);
      nb++;
    }
    
    if (nb > 0) {
      map.fitBounds(bounds);
      var zoom = map.getZoom();
      if (mode == 'circles' && zoom > zoomBeforeBounds) {
        map.setZoom(zoomBeforeBounds);
      }
    }
  }

  var onClearWaypointFile = function(e) {
    var filename = e.detail.filename;
    for (var i= 0; i < markers.length; i++) {
      if (markers[i].waypoint.filename == filename) {
        markers[i].waypoint.drawnOnMap = false;
        markers[i].setMap(null);
        markers.splice(i, 1);
        i--;
      }
    }
    fitToBounds('markers', markers);
  }

  var rebuildTask = function(turnpoints) {
    closeInfoWindow();
    for (var i = 0; i < turnpointElements.length; i++) {
      turnpointElements[i].setMap(null);
    }
    
    task.drawCourse(google, map);
    
    turnpointElements = [];
    for (var i = 0; i < turnpoints.length; i++) {
      var mapElement = turnpoints[i].renderTurnpoint(google, map, turnpoints);
      turnpointElements.push(mapElement);
    }
    zoomBeforeBounds = map.getZoom();
    fitToBounds('circles', turnpointElements);
  }

  var onTaskChange = function(e) {
    var turnpoints = e.detail.turnpoints;
    rebuildTask(turnpoints);
  }

  var getMarkerByFileAndId = function(filename, id) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].info.filename == filename && markers[i].info.id == id) {
        return markers[i];
      }
    }
    return false;
  }

  var onOpenMapTurnpointConfig = function(e) {
    var index = e.detail.index;
    var turnpoints = task.getTurnpoints();
    var mapElement = turnpointElements[index];
    mapElement.marker.edit = true;
    mapElement.marker.turnpoint = mapElement.turnpoint;
    new google.maps.event.trigger(mapElement.marker, 'click');
  }

  google.maps.event.addListener(map, "rightclick", function(event) {
    var keys = keyboard.getKeys();
    var space = keys[32] ? true : false;
    if (space) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      elevator.getElevationForLocations({'locations' : Array(event.latLng)}, function(results, status) {
        var e = document.createEvent("CustomEvent");
        e.initCustomEvent('newCustomWaypoint', false, false, {
          param : {
            filename : 'custom',
            x : lat,
            y : lng,
            alt : results[0].elevation,
          },
        });
        document.dispatchEvent(e);
      });
    }
  });

  document.addEventListener('newWaypointFile', onNewWaypointFile);
  document.addEventListener('newTrackFile', onNewTrackFile);
  document.addEventListener('clearWaypointFile', onClearWaypointFile);
  document.addEventListener('geolocation', onGeolocation);
  document.addEventListener('taskChange', onTaskChange);
  document.addEventListener('openMapTurnpointConfig', onOpenMapTurnpointConfig);
  //geolocation.check();
  
  return map;
});
