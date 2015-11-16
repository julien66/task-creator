/**
 * @file
 * Turnpoint class module for the task creator/
 */
define(['app/param', 'waypoints/turnpointConfig', 'waypoints/markerWindow'],
function(param, turnpointConfig, markerWindow) {
  var i = 0;
  var Waypoint = function(info) {
    if (!info) return;
    i++;
    this.filename = info.filename;
    this.x = info.x;
    this.y = info.y;
    this.z = parseInt(info.z, 10);
    this.name = info.name;
    this.id = info.id ? info.id : info.filename + i;
    this.drawnOnMap = info.drawnOnMap || false;
    this.marker = info.marker || false;
    this.latLng = info.latLng || false;
    //var markerColor = param.color; 
    this.getConfigurationForm = function(mode) {
      return turnpointConfig.buildForm(mode, this);
    }

    this.buildWindowMarker = function() {
      return markerWindow.buildMarker(this);
    }

    this.openConfigureWindow = function() {
      turnpointConfig.openConfigureWindow(this);
    }
  
    this.drawMarker = function(map, google) {
      this.drawnOnMap = true;
      this.latLng = new google.maps.LatLng(this.x, this.y);
      this.marker = new google.maps.Marker({
        position: this.latLng,
        map: map,
        waypoint : this,
      });
      
      google.maps.event.addListener(this.marker, 'click', function() {
        if (map.infoWindow) {
          map.infoWindow.close();
        }
        if (this.edit == true) {
          var content = this.turnpoint.getConfigurationForm('edit');
          map.infoWindow = new google.maps.InfoWindow({
            content : content, 
          });
          delete this.turnpoint;
          this.edit = false;
        } 
        else {
          var content = this.waypoint.buildWindowMarker();
          map.infoWindow = new google.maps.InfoWindow({
            content: content,
          });
        }
        map.infoWindow.open(map, this);
      });

      return this.marker;
    }
  }
  
  return Waypoint;
});

