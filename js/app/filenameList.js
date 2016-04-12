/**
 * @file
 * filename list module for the task creator.
 */
define(['jquery'], function($) {
  
  var container = $("#file-handler ul");
  $(document).on('click', '#filenameList', function(e) { 
    var name = $(this).attr('class');
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('filenameRemoved', false, false, {
      filename : name, 
    });
    document.dispatchEvent(e);
  });

  $(document).on('click', '#export-waypoints', function(e) {
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent('exportWaypoints', false, false, { 
    });
    document.dispatchEvent(e);
  });

  var rebuild = function(filenames) {
    if (filenames.length > 0) {
      var html ='';
      for (var i = 0; i < filenames.length; i++) {
        html += '<li id="filenameList" class="' + filenames[i] + '"><i class="fa fa-trash"></i> ' + filenames[i] + '</li>';
      }
      container.html(html);
      container.addClass('populated');
      $("#export-waypoints").removeClass('hide');
    } else {
      container.removeClass('populated');
      container.html('');
      $("#export-waypoints").addClass('hide');
    }
  }

  return {
    rebuild : rebuild,
  }
});
