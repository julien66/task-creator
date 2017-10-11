/**
 * @file
 * Main module for the task creator.
 */
define(['app/map', 'app/uploader', 'jquery'], function(map, uploader, $) {
  // Grab param from url...
  // Waypoints Url
  var waypointsUrl = location.search.split('waypointsUrl=')[1];
  // Task Url
  var taskUrl = location.search.split('taskUrl=')[1];
  // Task Id
  var taskId = location.search.split('taskId=')[1]
  // Hide sidebar.
  if (location.search.split('hideSidebar=true')[1]) {
    $("#sidebar").hide();
    $("#map-canvas").css({
      width: '100%'
    });
  }

  if (waypointsUrl) {
    var filename = waypointsUrl.split("/").pop();
    $.get(waypointsUrl, function(data) {
      uploader.setFilename(filename);
      uploader.parse(data);
    });
  }

  if (taskUrl) {
    var filename = taskUrl.split("/").pop();
    $.get(taskUrl, function(data) {
      uploader.setFilename(filename);
      if (typeof(data) !== "string") {
        data = new XMLSerializer().serializeToString(data);
      }
      uploader.parse(data);
    });
  }

  if (taskId) { 
    var id = taskId.split("/").pop();
    $.get("https://pole.ffvl.fr/tasks/" + id, function(data) {
     var geo = data[0].data;
     uploader.setFilename( id + '.geojson');
     uploader.parse(JSON.stringify(geo));
    });
  }
  
  /** @todo
   * Enable variable that directly display a given task
   */
  
});
