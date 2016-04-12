/**
 * @file
 * CUP format for the task creator.
 */
define(['rejs!formats/export/cup'], function(exportCup) {

  var check = function(text, filename) {
    var lines = text.split("\n");
    var words = [];
    // Replace all bad formated whitespace at the begining and end of the line..
    for (var i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      var word = lines[i].split(",");
      if (word.length == 11 && word[0].charAt(0) == '"' ) {
        return true;
      }
    }
    return false;
  }

  var parse = function(text, filename) {
    var lines = text.split("\n");
    var words = [];
    // Replace all bad formated whitespace at the begining and end of the line..
    for (var i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      var word = lines[i].split(",");
      if (word.length == 11 && word[0].charAt(0) == '"' ) {
        words.push(word); 
      }
    }

    // Storing the turnpoints.
    var tps = [];
    for (var i = 0; i < words.length; i++) {
      var tp =  {
        filename : filename,
        id : words[i][1],
        x : formatLatLng(words[i][3]),
        y : formatLatLng(words[i][4]),
        z : elevation(words[i][5]),
        name : words[i][0],
      };
      tps.push(tp);
    }
    
    return {
      'waypoints' : tps,
    };
  }

  var exporter = function(wps) {
    for (var i = 0; i < wps.length; i++) {
      wps[i].dms = convertDDtoDMS(wps[i].x, wps[i].y);
    }

    var data = exportCup({waypoints : wps});
    return new Blob([data], {'type': "text/plain"});
  }

  function convertDDtoDMS(lat, lng) {
    var convertLat = Math.abs(lat);
    var LatDeg = Math.floor(convertLat);
    var LatSec = (Math.round((convertLat - LatDeg) * 60 * 1000) / 1000);
    var LatCardinal = ((lat > 0) ? "N" : "S");
    var convertLng = Math.abs(lng);
    var LngDeg = Math.floor(convertLng);
    var LngSec = (Math.round((convertLng - LngDeg) * 60 * 1000) / 1000);
    var LngCardinal = ((lng > 0) ? "E" : "W");
                                                                              
    return pad(LatDeg, 2) + pad(LatSec, 2) + LatCardinal + "," + pad(LngDeg, 3) + pad(LngSec, 2) + LngCardinal;
  }

  function pad(n, width, z) {
    z = z || '0';
    num = Math.floor(n) + '';
    return num.length > width ? n : new Array(width - num.length + 1).join(z) + n;
  }

  function elevation(data) {
    if (data.indexOf("m") > -1) {
      return Math.round(data.replace(/[^\d.]/g, ""));
    }
    else if (data.indexOf("ft") > -1) {
      return Math.round(data.replace(/[^\d.]/g, "") * 0.3048);
    }
  }

  function convertDMSToDD(degrees, minutes, direction) {
    var dd = parseInt(degrees) + parseFloat(minutes)/60;
    if (direction == "S" || direction == "W") {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }

  function formatLatLng(coords) {
    var direction = coords.slice(-1);
    if (direction == "E" || direction == "W") {
      var deg = coords.substring(0, 3); 
      var min = coords.substring(3, 9); 
    }
    else {
      var deg = coords.substring(0, 2); 
      var min = coords.substring(2, 8); 
    }
    return convertDMSToDD(deg, min, direction);
  }

  return {
    'check' : check,
    'exporter' : exporter,
    'extension' : '.cup',
    'name' : 'CUP',
    'parse' : parse,
  }
});

