/**
 * @file
 * CUP format for the task creator.
 */
define([], function() {
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
    console.log(coords, deg, min, direction, convertDMSToDD(deg, min, direction));
    return convertDMSToDD(deg, min, direction);
  }

  return {
    'name' : 'cup',
    'check' : check,
    'parse' : parse,
  }
});

