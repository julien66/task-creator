/**
 * @file
 * Main module for the task creator.
 */
define(['app/map', 'app/uploader', 'jquery'], function(map, uploader, $) {
  // Enable a variable that directly display a custom waypoints Url.
  var waypointsUrl = location.search.split('waypointsUrl=')[1];
  
  if (waypointsUrl) {
    var filename = waypointsUrl.split("/").pop();
    $.get(waypointsUrl, function(data) {
      uploader.setFilename(filename);
      uploader.parse(data);
    });
  }

  /** @todo
   * Enable variable that directly display a given task
   */

});
