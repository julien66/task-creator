/**
  @file
  Task importer for the task creator.
  **/
define([], function() {
  var check = function(text, filename) {
    if (filename.split('.').pop() == 'tsk') {
      return true;
    }
    return false;
  }

  var parse = function(text, filename) {
    if (window.DOMParser) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(text, "text/xml");
    }

    var rtetp = xmlDoc.getElementsByTagName("rtept");
    var tps = [];
    var wps = [];
    for (var i = 0; i < rtetp.length; i++) {
      var tp = {
        close : rtetp[i].getElementsByTagName('close')[0].childNodes[0].nodeValue,
        goalType : rtetp[i].getElementsByTagName('goalType')[0].childNodes[0].nodeValue,
        index : rtetp[i].getElementsByTagName('index')[0].childNodes[0].nodeValue,
        mode : rtetp[i].getElementsByTagName('mode')[0].childNodes[0].nodeValue,
        open : rtetp[i].getElementsByTagName('open')[0].childNodes[0].nodeValue,
        radius : rtetp[i].getElementsByTagName('radius')[0].childNodes[0].nodeValue,
        type : rtetp[i].getElementsByTagName('type')[0].childNodes[0].nodeValue,
      };

      var wp = {  
        filename : filename, //rtetp[i].getElementsByTagName('filename')[0].childNodes[0].nodeValue,
        id : rtetp[i].getElementsByTagName('id')[0].childNodes[0].nodeValue,
        name : rtetp[i].getElementsByTagName('name')[0].childNodes[0].nodeValue,
        x : rtetp[i].getAttribute('lat'),
        y : rtetp[i].getAttribute('lon'),
        z : rtetp[i].getElementsByTagName('z')[0].childNodes[0].nodeValue,
      }
      wps.push(wp);
      tps.push(tp);
    } 

    return {
      'task' : {
        'date' : xmlDoc.getElementsByTagName('date')[0].childNodes[0].nodeValue,
        'type' : xmlDoc.getElementsByTagName('type')[0].childNodes[0].nodeValue,
        'num' : xmlDoc.getElementsByTagName('num')[0].childNodes[0].nodeValue,
        'turnpoints' : tps,
      },
      'waypoints' : wps,
    }
  }
  
  return {
    'name' : 'Task - tsk',
    'check' : check,
    'parse' : parse,
  }
});
