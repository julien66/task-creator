/**
 * @file.
 * Task optimiser module for the task creator.
 */
define(["app/param"], function(param) {
  // Fast Polyline
  var fastTrack; 
  var fastWaypoints = Array();
  var fastDistance = 0;
  var distances = [];

  var optimize = function(google, map, turnpoints) {
    var headings = Array();
    fastWaypoints = Array();
    fastDistance = 0;
    distances = [];

    for (var i = 0; i < turnpoints.length; i++) {
      // For all turnpoint excpet the last one.
      if (i < turnpoints.length - 1) {
        // Getting the heading.
        var heading = google.maps.geometry.spherical.computeHeading(turnpoints[i].latLng, turnpoints[i + 1].latLng);
        // Unsure heading is always positive.
        if (heading < 0) heading += 360;
        if (headings.length >= 1) {
          // Switch first heading from 180°.
          var pastHeading = headings[i- 1];
          
          // We need to catch the right angle !!!
          if (pastHeading > heading) {
            pastHeading -= 180;
          }else {
            pastHeading += 180;
          }
           
          // Now we can get the average heading. (Bisectrix).
          var middleHeading = (pastHeading + heading) / 2;  
          
          // If both turnpoints are the same. Keep past heading instead of 0.
          if (turnpoints[i].latLng.equals(turnpoints[i + 1].latLng)) {
            middleHeading = pastHeading;
          }
          
          // Offset from the center to the radius to get the intermediary point.
          var fastPoint = google.maps.geometry.spherical.computeOffset(turnpoints[i].latLng, turnpoints[i].radius, middleHeading); 
        }
        else {
          // For the first point just offset form the center to its radius following the heading of next turnpoint.
          var fastPoint = google.maps.geometry.spherical.computeOffset(turnpoints[i].latLng, turnpoints[i].radius, heading); 
        }
        headings.push(heading);
        fastWaypoints.push(fastPoint);
        incrementDistance(google, fastWaypoints);
      } 
    }
    
    // For the last turnpoint if it's a line the point doesn't change.
    // if it's a cylinder just reverse the last heading from the center and offset to the radius.
    if (headings.length >= 1) {
      if (turnpoints[i - 1].goalType == "line" && turnpoints[i - 1].type == "goal") {
        var newPoint = turnpoints[i - 1].latLng;
      }
      else {
        if (turnpoints[i-2].latLng.equals(turnpoints[i-1].latLng)) {
          var newPoint = google.maps.geometry.spherical.computeOffset(turnpoints[i - 1].latLng, turnpoints[i - 1].radius, headings[headings.length - 2] - 180);
        }
        else {
          var newPoint = google.maps.geometry.spherical.computeOffset(turnpoints[i - 1].latLng, turnpoints[i - 1].radius, headings[headings.length - 1] - 180);
        }
      }

      fastWaypoints.push(newPoint);
      incrementDistance(google, fastWaypoints);
    }
  
    var lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };

    if (fastTrack) fastTrack.setMap(null);
    fastTrack = new google.maps.Polyline({
      path: fastWaypoints,
      geodesic: true,
      strokeColor: param.task.courseColor.fast,
      strokeOpacity: 1.0,
      strokeWeight: 2,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '100px'
      }],
      map: map,
    });
    
    return { 
      distance : fastDistance,
      distances : distances,
      fastWaypoints : fastWaypoints,
     }
  }

  function incrementDistance(google, waypoints) {
    if (waypoints.length > 1) {
      var distance = google.maps.geometry.spherical.computeDistanceBetween(
        waypoints[fastWaypoints.length - 1],
        waypoints[fastWaypoints.length - 2]
      );
      fastDistance += distance;
      distances.push(Math.round(distance / 10)/100);
    }
  }

  return {
    optimize : optimize,
  }
});

