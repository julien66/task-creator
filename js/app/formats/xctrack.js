/**
 @file
 Task importer / exporter for XCTrack
 **/
define(['rejs!formats/export/xctrack'], function(exportXCTrack) {
  var converter = {
    "race-to-goal" : "RACE",
    "entry" : "ENTER",
  }
  
  var check = function(text, filename) {
    if (filename.split('.').pop() == 'xctsk') {
      return true;
    }
    return false;
  }

  var parse = function(text, filename) {
    return false;
  }
  
  var exporter = function(turnpoints, taskInfo) {
    var xcInfo =  {};
    for (var i = 0; i < turnpoints.length; i++) {
      if (turnpoints[i].type == "start") {
        xcInfo.timeGates = turnpoints[i].open;
        xcInfo.type = converter[taskInfo.type] ? converter[taskInfo.type] : taskInfo.type;;
        xcInfo.direction = converter[turnpoints[i].mode] ? converter[turnpoints[i].mode] : turnpoints[i].mode;
      }
    }
    for (var i = 0; i < turnpoints.length; i++) {
      if (turnpoints[i].type == "goal") {
        xcInfo.deadline = turnpoints[i].close;
        xcInfo.goalType = converter[turnpoints[i].goalType] ? converter[turnpoints[i].goalType] : turnpoints[i].goalType;
      }
    }
    var data = exportXCTrack({
      turnpoints : turnpoints,
      taskInfo : taskInfo,
      xcInfo : xcInfo
    });
    return new Blob([data], {'type': "text/plain"});
  }

  return {
    'check' : check,
    'exporter' : exporter,
    'extension' : '.xctsk',
    'name' : 'XCTrack',
    'parse' : parse,
  }
});
