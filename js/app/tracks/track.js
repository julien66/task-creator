/**
 * @file
 * Track module for the task creator.
 */
define(['app/helper'], function(helper) {

  var Track = function (info) {
    this.points = info.points;
    this.filename = info.filename;
    this.polyline;

    this.drawPolyline = function(map, google) {
      var coords = [];
      for (var i = 0; i < this.points.length; i++) {
        coords.push(new google.maps.LatLng(this.points[i].x, this.points[i].y));
      }

      this.polyline = new google.maps.Polyline({
        path: coords,
        geodesic: true,
        strokeColor: helper.randomColor(true),
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      this.polyline.setMap(map);
    }
  }

  return Track;
});
