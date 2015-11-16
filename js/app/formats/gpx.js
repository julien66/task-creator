/**
 * @file
 * Ozi parser module for the task creator.
 */
define([], function() {

  /**
   * @todo
   * Poor check : Able to parse xml or not
   */
  var check = function(text, filename) {
    if (window.DOMParser) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(text, "text/xml");
    }
    /*else {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.loadXML(text);
    }*/

    if (xmlDoc) {
      return true;
    }

    return false;
  }
  
  var parse = function(text, filename) {
    if (window.DOMParser) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(text,"text/xml");
    }

    var wpts = xmlDoc.getElementsByTagName("wpt");
    var tps = [];
    for (var i = 0; i < wpts.length; i++) {
      var tp = {
        filename : filename,
        z : wpts[i].getElementsByTagName('ele')[0].childNodes[0].nodeValue,
        name : wpts[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
        x : wpts[i].getAttribute('lat'),
        y : wpts[i].getAttribute('lon'),
      }
      tps.push(tp);
    }

    return {
      'waypoints' : tps,
    }
  }

  function ftToMeter(ft) {
    return Math.round(ft * 0.3048);
  }

  return {
    'name' : 'GPX',
    'check' : check,
    'parse' : parse,
  }
});


