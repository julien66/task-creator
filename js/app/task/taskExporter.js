/**
 * @file
 * Task Exporter module for the task creator.
 */
define(['jquery', 'rejs!task/templates/export', 'rejs!task/templates/save', 'app/helper', 'formats/tsk', 'formats/geoJson', 'formats/kml', 'formats/xctrack', 'jquery-qrcode'], function($, taskE, taskS, helper, tsk, geoJson, kml, xctrack) {
  var formats = [xctrack, kml, geoJson, tsk];
  
  var template = taskE({});
  var saveTemplate = taskS({});
  $("body").append(template);
  $("body").append(saveTemplate);
  
  
  var build = function(turnpoints, taskInfo) {
    var format = helper.formatOptions(formats.map(function(a) {return a.name;}));
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
  
  $(document).on('click', '#save-success-button', function(e) {
    $("#task-saver").modal('hide');
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

  var save = function (turnpoints, taskInfo) { 
    $("#task-saver").modal();
    var geo = geoJson.exporter(turnpoints, taskInfo, true);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://pole.ffvl.fr/tasks", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send('task=' + JSON.stringify(geo));

    xhr.onload = function() {
      var data = this.responseText;
      var id = data;
      $(".save-load").hide();
      $(".save-good").removeClass('hidden');
      $("#save-id").html(id);
      var url = $(location).attr('protocol') + "//" + $(location).attr('host') + $(location).attr('pathname') + '?taskId=' + id;
      $("#save-link").html('<a href="' + url + ' ">' + url + '</a>');
      $('#save-qrcode').html('');
      $('#save-qrcode').qrcode(url);
    }
  }

  return {
    build : build,
    exporter : exporter,
    save : save,
  }
});
