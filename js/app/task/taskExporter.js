/**
 * @file
 * Task Exporter module for the task creator.
 */
define(['rejs!task/templates/export', 'app/helper', 'formats/tsk', 'formats/kml'], function(taskE, helper, tsk, kml) {
  var formats = [tsk, kml];
  
  var template = taskE({});
  $("body").append(template);
  
  
  var build = function() {
    console.log(tsk);
    var format = helper.formatOptions(formats.map(function(a) {return a.name;}));
    console.log(format);
    $("#export-task-format-select").html(format);
    $("#task-exporter").modal();
  }
  
  $(document).on('click', '#export-task-btn', function(e) {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('finalExportTask', false, false, {
      format : $("#export-task-format-select").val(),
    });
    document.dispatchEvent(e);
    $("#task-exporter").modal('hide');
  });
  
  
  var exporter = function(turnpoints, taskInfo, formatName) {
    var format = $.grep(formats, function(e){ return e.name == formatName; })[0];
    var a = document.createElement('a');
    var data = format.exporter(turnpoints, taskInfo);
    a.href = URL.createObjectURL(data);
    a.download = "task_" + taskInfo.date + format.extension;
    var event = document.createEvent("MouseEvents");
		event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(event);
  }

  return {
    build : build,
    exporter : exporter
  }
});
