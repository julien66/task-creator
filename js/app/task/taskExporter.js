/**
 * @file
 * Task Exporter module for the task creator.
 */
define(['rejs!task/export/gpx'], function(gpxTask) {
  var gpxExport = function(turnpoints, taskInfo) {
    var gpx = gpxTask({
      turnpoints: turnpoints,
      taskInfo: taskInfo,
    });

    var a = document.createElement('a');
    var data = new Blob([gpx], {'type': "text/xml"});
    a.href = URL.createObjectURL(data);
    a.download = "task_" + taskInfo.date + ".tsk";
    var event = document.createEvent("MouseEvents");
		event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(event);
  }

  return {
    gpxExport : gpxExport
  }
});
