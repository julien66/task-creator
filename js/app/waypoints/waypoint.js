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
    this.index = i;
    this.drawnOnMap = info.drawnOnMap || false;
    this.marker = info.marker || false;
    this.latLng = info.latLng || false;
    //var markerColor = param.color; 
    this.getConfigurationForm = function(mode) {
      return turnpointConfig.buildForm(mode, this);
    }

    this.set = function(name, id) {
        this.id = id;
        this.name = name;
        this.marker.label.text = id;
        this.marker.setLabel(this.marker.label);
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
        label: {
          text : this.id,
          color : "#000",
          fontSize: "11px",
          fontWeight: "bold",
          'text-shadow': "0px 0px 10px #000",
        },
        icon : {
          path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
          fillColor: "#FE7569",
          fillOpacity: 1,
          strokeColor: '#CB4236',
          strokeWeight: 1,
          scale: 1,
          labelOrigin : new google.maps.Point(0, 10),
        },
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
          /*map.infoWindow = new google.maps.InfoWindow({
            content : content, 
          });*/
          delete this.turnpoint;
          this.edit = false;
        } 
        else {
          var content = this.waypoint.buildWindowMarker();
          map.infoWindow = new google.maps.InfoWindow({
            content: content,
          });
          map.infoWindow.open(map, this);
        }
      });

      return this.marker;
    }
  }
  
  return Waypoint;
});

