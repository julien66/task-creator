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
    a.click();
  }

  return {
    gpxExport : gpxExport
  }
});
