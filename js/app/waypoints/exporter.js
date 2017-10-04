/**
 * @file
 * Waypoints Exporter.
 */
define(['jquery', 'rejs!waypoints/templates/export', 'rejs!waypoints/templates/exportWaypoint', 'app/helper', 'formats/gpx', 'formats/ozi', 'formats/cup'], 
function($, ex, exWp, helper, gpx, ozi, cup) {
  
  var formats = [gpx, ozi, cup];
  
  var template = ex({});
  $("body").append(template);

  $(document).on('click', '#export-waypoints-list a', function(e) {
    var checkbox = $("#" + $(e.target).attr("id") + " input");
    checkbox.prop("checked", !checkbox.prop("checked"));
  });
  
  $(document).on('click', '#export-wp', function(e) {
    var selected = Array();
    $('input.export-single-wp:checked').each(function() {
      selected.push(parseInt($(this).attr('rel')));
    });
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('finalExportWaypoints', false, false, {
      selected : selected,
      format : $("#export-wp-format-select").val(),
    });
    document.dispatchEvent(e);
    $("#waypoints-exporter").modal('hide');
  });

  var build = function(waypoints) {
    var format = helper.formatOptions(formats.map(function(a) {return a.name;}));
    var formatWp = exWp({waypoints : waypoints}); 
    $("#export-wp-format-select").html(format);
    $("#export-waypoints-list").html(formatWp);
    $("#waypoints-exporter").modal();
  }

  var exporter = function(wps, formatName) {
    var format = $.grep(formats, function(e){ return e.name == formatName; })[0];
    var a = document.createElement('a');
    var blob = format.exporter(wps);
    a.href = URL.createObjectURL(blob);
    a.download = "waypoints" + format.extension;
    var event = document.createEvent("MouseEvents");
		event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(event);
  }

  return {
    build : build,
    exporter : exporter,
  }
});
