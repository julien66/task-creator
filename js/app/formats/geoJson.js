/**
  @file
  geoJson format for the taskCreator
  **/
define([],function () {
  var check = function(text, filename) {
    if (filename.split('.').pop() == 'geojson') {
      return true;
    }
    return false;
  }

  var parse = function (text, filename) {
    var geo = JSON.parse(text);
    var points = geo.geometry.coordinates.map(function(elem, index){
      var point = geo.properties.turnpoints[index];
      point.x = elem[1];
      point.y = elem[0];
      point.filename = filename;
      point.wp = point;
      return point;
    });

    return {
      task : {
        date : geo.properties.date,
        type : geo.properties.type,
        turnpoints : points,
      },
      waypoints : points,
    }
  }

  var exporter = function(turnpoints, taskInfo, noFile) {
    noFile = noFile || false;

    var bb =  taskInfo.bbox;
    
    var geo = {
      type : 'Feature',
      bbox : [bb.getSouthWest().lng(), bb.getSouthWest().lat(), bb.getNorthEast().lng(), bb.getNorthEast().lat()],
      geometry : {
        type : "MultiPoint",
        coordinates : [],
      },
      properties : {}
    };

    geo.geometry.coordinates = turnpoints.map(function(elem){ 
      return [elem.y, elem.x];
    });

    geo.properties.date = taskInfo.date;
    geo.properties.type = taskInfo.type;
    geo.properties.turnpoints = turnpoints.map(function(elem){ 
      return {
        close : elem.close,
        goalType : elem.goalType,
        id : elem.wp.id,
        mode : elem.mode,
        name : elem.wp.name,
        open : elem.open,
        radius : elem.radius,
        type : elem.type,
        z : elem.wp.z,
      }
    });
    
    if (noFile === true) { return geo; }
    return new Blob([JSON.stringify(geo)], {'type': "application/json"});
  }

  return {
    'check' : check,
    'exporter' : exporter,
    'extension' : '.geojson',
    'name' : 'geoJson',
    'parse' : parse,
  }
});
